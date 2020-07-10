const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { addUser, getUser, removeUser, getUsersInRoom } = require("./utils/users");

const app = express();
const server = http.createServer(app); //Express does this automatically, we added this for refactoring
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
	console.log("New Web-Socket Connection");

	socket.on("join", (options, callback) => {
		const { error, user } = addUser({ id: socket.id, ...options });

		if (error) {
			return callback(error);
		}

		socket.join(user.room);

		socket.emit("message", generateMessage("Admin", "Welcome"));
		socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined!`));
		io.to(user.room).emit("roomData", {
			room: user.room,
			users: getUsersInRoom(user.room),
		});
		callback();
	});

	socket.on("sendMessage", (message, callback) => {
		const user = getUser(socket.id);
		if (!user) return callback(error);
		const filter = new Filter();
		if (filter.isProfane(message)) return callback("Profanity not allowed");
		io.to(user.room).emit("message", generateMessage(user.username, message));
		callback();
	});
	socket.on("sendLocation", (locationObject, callback) => {
		const user = getUser(socket.id);
		io.to(user.room).emit(
			"locationMessage",
			generateLocationMessage(
				user.username,
				`https://google.com/maps/?q=${locationObject.latitude},${locationObject.longitude}`
			)
		);
		callback("Location shared!");
	});
	socket.on("disconnect", () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`));
			io.to(user.room).emit("roomData", {
				room: user.room,
				users: getUsersInRoom(user.room),
			});
		}
	});
});

server.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});

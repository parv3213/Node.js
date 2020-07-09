const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/message");

const app = express();
const server = http.createServer(app); //Express does this automatically, we added this for refactoring
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
	console.log("New Web-Socket Connection");
	socket.emit("message", generateMessage("Welcome"));
	socket.broadcast.emit("message", generateMessage("A new user has joined!"));
	socket.on("sendMessage", (message, callback) => {
		const filter = new Filter();
		if (filter.isProfane(message)) return callback("Profanity not allowed");
		io.emit("message", generateMessage(message));
		callback();
	});
	socket.on("sendLocation", (locationObject, callback) => {
		io.emit(
			"locationMessage",
			generateLocationMessage(`https://www.google.com/maps/?q=${locationObject.latitude},${locationObject.longitude}`)
		);
		callback("Location shared!");
	});
	socket.on("disconnect", () => {
		io.emit("message", generateMessage("A user has left!"));
	});
});

server.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});

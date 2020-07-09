const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { isPrimitive } = require("util");

const app = express();
const server = http.createServer(app); //Express does this automatically, we added this for refactoring
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
	console.log("New Web-Socket Connection");
	socket.emit("message", "Welcome");
	socket.broadcast.emit("message", "A new user has joined!");
	socket.on("sendMessage", (message) => {
		io.emit("message", message);
	});
	socket.on("sendLocation", (locaationObject) => {
		io.emit("message", `https://www.google.com/maps/?q=${locaationObject.latitude},${locaationObject.longitude}`);
	});
	socket.on("disconnect", () => {
		io.emit("message", "A user has left!");
	});
});

server.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});

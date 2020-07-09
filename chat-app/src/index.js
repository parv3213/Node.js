const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app); //Express does this automatically, we added this for refactoring
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on("connection", (socket) => {
	console.log("New Web-Socket Connection");
	socket.emit("countUpdated", count);
	socket.on("increment", () => {
		count++;
		// socket.emit("countUpdated", count); //emits only to the specific client
		io.emit("countUpdated", count);
	});
});

server.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});

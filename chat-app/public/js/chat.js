const socket = io();

socket.on("message", (message) => {
	console.log(message);
});

document.getElementById("messageForm").addEventListener("submit", (e) => {
	e.preventDefault();
	const message = e.target.elements.message.value;
	socket.emit("sendMessage", message);
});

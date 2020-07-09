const socket = io();

socket.on("message", (message) => {
	console.log(message);
});

document.getElementById("message-form").addEventListener("submit", (e) => {
	e.preventDefault();
	const message = e.target.elements.message.value;
	socket.emit("sendMessage", message);
});

document.getElementById("send-location").addEventListener("click", () => {
	if (!navigator.geolocation) return alert("Geolocation is not supported by your browser");
	navigator.geolocation.getCurrentPosition((position) => {
		const locationObject = { latitude: position.coords.latitude, longitude: position.coords.longitude };
		socket.emit("sendLocation", locationObject);
	});
});
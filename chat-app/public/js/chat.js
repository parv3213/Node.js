const socket = io();

const $messageForm = document.getElementById("message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.getElementById("send-location");
const $message = document.getElementById("message");

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationMessageTemplate = document.getElementById("location-message-template").innerHTML;
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
	// New msg element
	const $newMessage = $message.lastElementChild;

	// height of new msg
	const newMessageStyles = getComputedStyle($newMessage);
	const newMessageMargin = parseInt(newMessageStyles.marginBottom);
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

	// visible height
	const visibleHeight = $message.offsetHeight;

	// height of message container
	const containerHeight = $message.scrollHeight;

	// how far have i scolled
	const scrollOffset = $message.scrollTop + visibleHeight;

	if (containerHeight - newMessageHeight <= scrollOffset) {
		$message.scrollTop = $message.scrollHeight;
	}
};

socket.on("message", (message) => {
	console.log(message);
	const html = Mustache.render(messageTemplate, {
		username: message.username,
		createdAt: moment(message.createdAt).format("h:mm a"),
		message: message.text,
	});
	$message.insertAdjacentHTML("beforeend", html);
	autoscroll();
});

socket.on("locationMessage", (url) => {
	console.log(url);
	const html = Mustache.render(locationMessageTemplate, {
		username: url.username,
		url: url.url,
		createdAt: moment(url.createdAt).format("h:mm a"),
	});
	$message.insertAdjacentHTML("beforeend", html);
	autoscroll();
});

socket.on("roomData", ({ room, users }) => {
	const html = Mustache.render(sidebarTemplate, {
		room: room,
		users: users,
	});
	document.getElementById("sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
	e.preventDefault();
	$messageFormButton.setAttribute("disabled", "disabled");
	const message = e.target.elements.message.value;
	socket.emit("sendMessage", message, (error) => {
		$messageFormButton.removeAttribute("disabled");
		$messageFormInput.value = "";
		$messageFormInput.focus();

		if (error) return console.log(error);
		console.log("The message has been delivered!");
	});
});

$sendLocationButton.addEventListener("click", () => {
	if (!navigator.geolocation) return alert("Geolocation is not supported by your browser");
	$sendLocationButton.setAttribute("disabled", "disabled");
	navigator.geolocation.getCurrentPosition((position) => {
		const locationObject = { latitude: position.coords.latitude, longitude: position.coords.longitude };
		socket.emit("sendLocation", locationObject, (message) => {
			$sendLocationButton.removeAttribute("disabled");
			console.log(message);
		});
	});
});

socket.emit("join", { username, room }, (error) => {
	if (error) {
		alert(error);
		location.href = "/";
	}
});

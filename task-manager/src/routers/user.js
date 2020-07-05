const express = require("express");
const multer = require("multer");
const smarp = require("sharp");
const User = require("../models/user");
const { update } = require("../models/user");
const auth = require("../middleware/auth.js");
const { sendWelcomeMail, sendFeedbackMail } = require("../emails/account");
const sharp = require("sharp");
const router = new express.Router();

router.post("/users", async (req, res) => {
	const user = new User(req.body);
	try {
		const token = await user.generateAuthToken();
		sendWelcomeMail(user.email, user.name);
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e.message);
	}
});

router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();

		res.send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

router.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.post("/users/logoutAll", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.get("/users/me", auth, async (req, res) => {
	res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["name", "email", "password", "age"];
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

	if (!isValidOperation) {
		return res.status(400).send({ error: "Invalid updates!" });
	}

	try {
		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();

		res.send(req.user);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.delete("/users/me", auth, async (req, res) => {
	try {
		const deletedUser = {
			name: req.user.name,
			email: req.user.email,
		};
		await req.user.remove();
		sendFeedbackMail(deletedUser.email, deletedUser.name);
		res.send(req.user);
	} catch (e) {
		res.status(500).send();
	}
});

// multer
const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
			return cb(new Error("File must be a jpg,jpeg or png"));
		}
		cb(undefined, true);
	},
});

router.post(
	"/users/me/avatar",
	auth,
	upload.single("avatar"),
	async (req, res) => {
		// req.user.avatar = req.file.buffer;
		const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	(e, req, res, next) => {
		res.status(400).send({ e: e.message });
	}
);

router.delete("/users/me/avatar", auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send({ user: req.user });
});

router.get("/users/:id/avatar", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error();
		}
		res.set("Content-type", "image/png");
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send();
	}
});

module.exports = router;

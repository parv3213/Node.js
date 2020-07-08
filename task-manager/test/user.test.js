require("dotenv").config({ path: "./config/test-dev.env" });
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
	const response = await request(app)
		.post("/users")
		.send({
			name: "Andrew",
			email: "andrew@example.com",
			password: "MyPass777!",
		})
		.expect(201);

	// Assert that the database was changed correctly
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	// Assertions about the response
	expect(response.body).toMatchObject({
		user: {
			name: "Andrew",
			email: "andrew@example.com",
		},
		token: user.tokens[0].token,
	});
	expect(user.password).not.toBe("MyPass777!");
});

test("Should login existing user", async () => {
	const response = await request(app)
		.post("/users/login")
		.send({
			email: userOne.email,
			password: userOne.password,
		})
		.expect(200);
	const user = await User.findById(userOneId);
	expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: userOne.email,
			password: "thisisnotmypass",
		})
		.expect(400);
});

test("Should get profile for user", async () => {
	await request(app).get("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
	await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
	await request(app).delete("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
	const user = await User.findById(userOneId);
	expect(user).toBeNull();
});

test("Should not delete account for unauthenticate user", async () => {
	await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
	await request(app)
		.post("/users/me/avatar")
		.set("Authorization", "Bearer " + userOne.tokens[0].token)
		.attach("avatar", "test/fixtures/a.png")
		.expect(200);
	const user = await User.findById(userOne._id);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Update valid fields", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", "Bearer " + userOne.tokens[0].token)
		.send({
			name: "Jack",
			email: "jack@123.ca",
			password: "Hellooadasd@2",
			age: 23,
		})
		.expect(200);
	const user = await User.findById(userOne._id);
	expect(user.name).toBe("Jack");
});

test("Update In-valid user fields", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", "Bearer " + userOne.tokens[0].token)
		.send({
			name: "Jack",
			email: "jack@123.ca",
			password: "Hellooadasd@2",
			age: 23,
			heelo: "adwwdaw",
		})
		.expect(400);
});

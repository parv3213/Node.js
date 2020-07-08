require("dotenv").config({ path: "./config/test-dev.env" });
const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { userOneId, userOne, taskThree, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
	const response = await request(app)
		.post("/tasks")
		.set("Authorization", "Bearer " + userOne.tokens[0].token)
		.send({
			description: "Hey meet me",
		})
		.expect(201);
	const task = await Task.findById(response.body._id);
	expect(task).not.toBeNull();
	expect(task.completed).toBe(false);
});

test("Should be getting task created by only the owner", async () => {
	const response = await request(app)
		.get("/tasks")
		.set("Authorization", "Bearer " + userOne.tokens[0].token)
		.expect(200);
	expect(response.body.length).toBe(2);
});

test("Should not delete task created by other user", async () => {
	await request(app)
		.delete("/tasks/" + taskThree._id)
		.set("Authorization", "Bearer " + userOne.tokens[0].token)
		.expect(404);
	const task = await Task.findById(taskThree._id);
	expect(task).not.toBeNull();
});

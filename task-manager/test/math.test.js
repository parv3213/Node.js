const { calculateTip, fahrenheitToCelsius, add, celsiusToFahrenheit } = require("../src/math.js");

test("Show calculated tip", () => {
	expect(calculateTip(10, 0.3)).toBe(13);
});

// test("Caculate total with deafult tip", () => {
// 	expect(calculateTip(10)).toBe(12.5);
// });

// test("C to F", () => {
// 	expect(fahrenheitToCelsius(32)).toBe(0);
// });

// test("F to C", () => {
// 	expect(celsiusToFahrenheit(0)).toBe(32);
// });

// test("Async test demo", (done) => {
// 	setTimeout(() => {
// 		expect(1).toBe(1);
// 		done();
// 	}, 2000);
// });

// test("Should add", (done) => {
// 	add(2, 3).then((sum) => {
// 		expect(sum).toBe(5);
// 		done();
// 	});
// });

// test("should add 2 n0, async/await", async () => {
// 	expect(await add(10, 2)).toBe(12);
// });

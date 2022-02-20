import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

describe("api", () => {
	it("works for rows", async () => {
		expect(true).toBeTruthy();
	});
});
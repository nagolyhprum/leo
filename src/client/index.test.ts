import { rows, columns, stackWithImages } from "./";
import { server } from "../server/index";

import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

afterAll(() => {
	server.close();
});

const ENDPOINT = "http://localhost:8080";

describe("api", () => {
	it("works for rows", async () => {
		const image = await rows(ENDPOINT);
		expect(await image.buffer()).toMatchImageSnapshot();
	});
	it("works for columns", async () => {
		const image = await columns(ENDPOINT);
		expect(await image.buffer()).toMatchImageSnapshot();
	});
	// it("works for stack with images", async () => {
	// 	const image = await stackWithImages(ENDPOINT);
	// 	expect(await image.buffer()).toMatchImageSnapshot();
	// });
});
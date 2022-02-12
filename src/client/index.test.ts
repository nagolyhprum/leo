import { main } from "./";
import { server } from "../server/index";

import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

afterAll(() => {
	server.close();
});

describe("api", () => {
	describe("main", () => {
		it("generates an image from the server", async () => {
			const image = await main("http://localhost");
			expect(image).toBeDefined();
			if(image) {
				expect(await image.buffer()).toMatchImageSnapshot();
			}
		});
	});
});
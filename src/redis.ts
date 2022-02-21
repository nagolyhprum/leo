import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";

export const withRedis = (callback : (req : NextApiRequest & {
    redis : ReturnType<typeof createClient>
}, res : NextApiResponse) => Promise<void> | void) => async (req : NextApiRequest, res : NextApiResponse) => {
	const client = createClient({
		url : process.env.REDIS_URL
	});
	await client.connect();
	const reqWithRedis = req as NextApiRequest & {
        redis : ReturnType<typeof createClient>
    };
	reqWithRedis.redis = client;
	await callback(reqWithRedis, res);
	await client.disconnect();
};
import { api } from "./api";
import { Request, Response } from "express";
import { Server } from "http";

import express from "express";
import path from "path";

import Bear from "./bear.jpeg";
import { createCanvas, loadImage } from "canvas";

import webp from "webp-converter";

import fs from "fs";

// we need this folder in order to generate webp images
fs.mkdir(path.join(__dirname, "..", "..", "node_modules", "webp-converter", "temp"), {
	recursive : true
}, () => {
	// DO NOTHING
});

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client")));

app.get("/bear.jpeg", (_, res) => {
	res.sendFile(path.join(__dirname, Bear));
});

app.get("/basketball.svg", (_: Request, res: Response) => {
	res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve" height="100px" width="100px">
            <path d="M28.1,36.6c4.6,1.9,12.2,1.6,20.9,1.1c8.9-0.4,19-0.9,28.9,0.9c6.3,1.2,11.9,3.1,16.8,6c-1.5-12.2-7.9-23.7-18.6-31.3   c-4.9-0.2-9.9,0.3-14.8,1.4C47.8,17.9,36.2,25.6,28.1,36.6z"/>
            <path d="M70.3,9.8C57.5,3.4,42.8,3.6,30.5,9.5c-3,6-8.4,19.6-5.3,24.9c8.6-11.7,20.9-19.8,35.2-23.1C63.7,10.5,67,10,70.3,9.8z"/>
            <path d="M16.5,51.3c0.6-1.7,1.2-3.4,2-5.1c-3.8-3.4-7.5-7-11-10.8c-2.1,6.1-2.8,12.5-2.3,18.7C9.6,51.1,13.4,50.2,16.5,51.3z"/>
            <path d="M9,31.6c3.5,3.9,7.2,7.6,11.1,11.1c0.8-1.6,1.7-3.1,2.6-4.6c0.1-0.2,0.3-0.4,0.4-0.6c-2.9-3.3-3.1-9.2-0.6-17.6   c0.8-2.7,1.8-5.3,2.7-7.4c-5.2,3.4-9.8,8-13.3,13.7C10.8,27.9,9.8,29.7,9,31.6z"/>
            <path d="M15.4,54.7c-2.6-1-6.1,0.7-9.7,3.4c1.2,6.6,3.9,13,8,18.5C13,69.3,13.5,61.8,15.4,54.7z"/>
            <path d="M39.8,57.6C54.3,66.7,70,73,86.5,76.4c0.6-0.8,1.1-1.6,1.7-2.5c4.8-7.7,7-16.3,6.8-24.8c-13.8-9.3-31.3-8.4-45.8-7.7   c-9.5,0.5-17.8,0.9-23.2-1.7c-0.1,0.1-0.2,0.3-0.3,0.4c-1,1.7-2,3.4-2.9,5.1C28.2,49.7,33.8,53.9,39.8,57.6z"/>
            <path d="M26.2,88.2c3.3,2,6.7,3.6,10.2,4.7c-3.5-6.2-6.3-12.6-8.8-18.5c-3.1-7.2-5.8-13.5-9-17.2c-1.9,8-2,16.4-0.3,24.7   C20.6,84.2,23.2,86.3,26.2,88.2z"/>
            <path d="M30.9,73c2.9,6.8,6.1,14.4,10.5,21.2c15.6,3,32-2.3,42.6-14.6C67.7,76,52.2,69.6,37.9,60.7C32,57,26.5,53,21.3,48.6   c-0.6,1.5-1.2,3-1.7,4.6C24.1,57.1,27.3,64.5,30.9,73z"/>
        </svg>
    `);
});

// const getWatermark = () => {
//     const text = "watermark";
//     const font = 24;
//     const canvas = createCanvas(1, font);
//     const context = canvas.getContext("2d");
//     context.font = `${font}px Times New Roman`;
//     canvas.width = context.measureText(text).width;
//     context.font = `${font}px Times New Roman`;
//     context.textAlign = "start";
//     context.textBaseline = "top";
//     context.fillStyle = "white";
//     context.fillText(text, 0, 0);
//     return canvas;
// }

app.post("/api", async (req: Request, res: Response) => {
	res.header("Content-Type", "image/png");
	res.send(await api(req.body, 1, 12));
});

app.get("/api", async (req: Request, res: Response) => {
	try {
		const {
			src,
			type,
			size // cover, contain
		} = req.query;
		let width = Number(req.query.width);
		let height = Number(req.query.height);
		if(typeof src === "string") {
			const image = await loadImage(src);
			if(!isNaN(width) && isNaN(height)) {
				height = (width / image.width) * image.height;
			}
			if(isNaN(width) && !isNaN(height)) {
				width = (height / image.height) * image.width;
			}
			if(isNaN(width) && isNaN(height)) {
				width = image.width;
				height = image.height;
			}
			const canvas = createCanvas(width, height);
			const context = canvas.getContext("2d");
			switch(size) {
			case "cover": {
				const percent = Math.max(width / image.width, height / image.height);
				const newWidth = image.width * percent;
				const newHeight = image.height * percent;
				context.drawImage(
					image, 
					width / 2 - newWidth / 2, 
					height / 2 - newHeight / 2, 
					newWidth, 
					newHeight
				);
				break;
			}
			case "contain": {
				const percent = Math.min(width / image.width, height / image.height);
				const newWidth = image.width * percent;
				const newHeight = image.height * percent;
				canvas.width = newWidth;
				canvas.height = newHeight;
				context.drawImage(
					image, 
					0, 
					0, 
					newWidth, 
					newHeight
				);
				break;
			}
			default:
				context.drawImage(image, 0, 0, width, height);
				break;
			}
			if(typeof type === "string") {
				if(["image/webp"].includes(type)) {
					const image = await webp.buffer2webpbuffer(canvas.toBuffer("image/jpeg"), "jpg", "-q 80");
					console.log({ image });
					res.header("Content-Type", "image/webp");
					res.send(image);
				}
			} else {
				res.header("Content-Type", "image/jpeg");
				res.send(canvas.toBuffer("image/jpeg"));
			}
			return;
		}
	} catch(e) {
		console.log(e);
	}
	res.status(400).end();
});

// app.get("/api", async (_ : Request, res : Response) => {
//     const image = await loadImage(svg);
//     res.header("Content-Type", "image/png");
//     const canvas = createCanvas(100, 100);
//     const context = canvas.getContext("2d");
//     canvas.width = 300;
//     context.fillStyle = "red";
//     context.fillRect(0, 0, canvas.width, 100);
//     context.drawImage(image, 0, 0, canvas.width, 100);
//     context.globalAlpha = 0.5;
//     const watermark = getWatermark();
//     const PADDING = 10;
//     let x = 0, y = 0;
//     while(y < canvas.height) {
//         context.drawImage(watermark, x, y);
//         x += watermark.width + PADDING;
//         if(x >= canvas.width) {
//             y += watermark.height + PADDING;
//             x = ((y / (watermark.height + PADDING)) % 2) * (-watermark.width / 2)
//         }
//     }
//     res.send(canvas.toBuffer("image/png"))
// })

const PORT = process.env.PORT || 8080;

export const server = app.listen(PORT, () => {
	console.log("listening on port", PORT);
}) as Server;

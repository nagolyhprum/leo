const express = require("express");
const { createCanvas } = require("canvas");

const app = express();

app.get("/", (_, res) => {
    res.header("Content-Type", "image/png");
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext("2d");
    context.fillRect(0, 0, 100, 100);
    res.send(canvas.toBuffer("image/png"))
})

app.listen(process.env.PORT, () => {
    console.log("listening on port", process.env.PORT)
})
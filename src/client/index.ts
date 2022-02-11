require("babel-polyfill");
import {
    row,
    background,
    MATCH,
    text,
    WRAP,
    size,
    color,
    column,
    align,
    leonarto
} from "./api"

export const main = async (endpoint = "/api") => {
    try {
        const result = await leonarto({
            endpoint
        }).canvas(
            column(MATCH, MATCH, [
                background("red"),
                row(MATCH, WRAP, [
                    background("blue"),
                    text(WRAP, WRAP, [
                        size(32),
                        color("white"),
                        "Hello World"
                    ]),
                    text(.25, WRAP, [
                        background("green"),
                        align("center"),
                        size(32),
                        color("white"),
                        "Goodbye Cruel World"
                    ]),
                    text(MATCH, WRAP, [
                        background("pink"),
                        align("end"),
                        size(32),
                        color("white"),
                        "Goodbye Cruel World, Goodbye Cruel World"
                    ])
                ]), 
            ]),
            640, 
            480
        )
        if(typeof document !== "undefined") {
            const image = document.querySelector<HTMLImageElement>("#image")
            if(image) {
                image.src = await result.url();
            }
        }
        return result;
    } catch(e) {
        console.log("ERROR", e)
    }
}


if(typeof document !== "undefined") {
    main()
}
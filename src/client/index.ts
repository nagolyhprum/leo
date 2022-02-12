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
    leonarto,
    margin,
    padding,
    shadow,
    round,
    image,
    source,
    stack,
    position,
    mainAxisAlignment,
    crossAxisAlignment
} from "./api"

const Basketball = "/basketball.svg"

/*

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
                        "Goodbye **Cruel** World"
                    ]),
                    text(MATCH, WRAP, [
                        background("pink"),
                        align("end"),
                        size(32),
                        color("white"),
                        "Goodbye Cruel World, Goodbye Cruel World"
                    ])
                ]), 
                column(MATCH, WRAP, [
                    background("purple"),
                    margin(16),
                    padding(32),
                    text(MATCH, WRAP, [
                        padding({
                            top : 8,
                            right : 8,
                            bottom : 8,
                            left : 8
                        }),
                        round(7 + 8),
                        background("orange"),
                        color("white"),
                        size(14),
                        "TESTING 123",
                        shadow(true)
                    ])
                ]),
                row(MATCH, WRAP, [
                    image(200, WRAP, [
                        source(new URL(Basketball, domain).toString())
                    ]),
                    image(WRAP, 150, [
                        source(new URL(Basketball, domain).toString())
                    ]),
                    image(WRAP, MATCH, [
                        source(new URL(Basketball, domain).toString())
                    ]),
                ]),
                stack(MATCH, MATCH, [
                    row(50, 50, [
                        round(25),
                        background("black"),
                        position({
                            top : 10,
                            left : 20
                        })
                    ])
                ])
            ])
*/

export const main = async (domain = location.protocol + "//" + location.host) => {
    try {
        const result = await leonarto({
            endpoint : `${domain}/api`
        }).canvas(
            column(MATCH, MATCH, [
                row(MATCH, 75, [
                    mainAxisAlignment("start"),
                    crossAxisAlignment("center"),
                    ...["A", "B", "C"].map(it => text(WRAP, WRAP, [
                        size(12),
                        padding([4, 6, 8, 12]),
                        margin([14, 16, 18, 20]),
                        it,
                        color("black")
                    ]))
                ]),
                row(MATCH, 75, [
                    mainAxisAlignment("center"),
                    crossAxisAlignment("end"),
                    ...["A", "B", "C"].map(it => text(WRAP, WRAP, [
                        size(12),
                        padding([4, 6, 8, 12]),
                        margin([14, 16, 18, 20]),
                        it,
                        color("black")
                    ]))
                ]),
                row(MATCH, 75, [
                    mainAxisAlignment("end"),
                    crossAxisAlignment("start"),
                    ...["A", "B", "C"].map(it => text(WRAP, WRAP, [
                        size(12),
                        padding([4, 6, 8, 12]),
                        margin([14, 16, 18, 20]),
                        it,
                        color("black")
                    ]))
                ])
            ]),
            640, 
            640
        )
        return result;
    } catch(e) {
        console.log("ERROR", e)
    }
}


if(typeof document !== "undefined") {
    main().then(result => {
        return result?.url()
    }).then((url) => {
        const image = document.querySelector<HTMLImageElement>("#image")
        if(url && image) {
            image.src = url;
        }
    })
}
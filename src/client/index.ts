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
        const Basketball = `${domain}/basketball.svg`
        const children = ["A", "**B**", "C"].map(it => text(WRAP, WRAP, [
            size(it === "**B**" ? 16 : 12),
            padding([4, 6, 8, 10]),
            margin({
                top : 12,
                right : 14,
                bottom : 16,
                left: 18
            }),
            it,
            color("black")
        ]))
        const result = await leonarto({
            endpoint : `${domain}/api`
        }).canvas(
            column(MATCH, MATCH, [
                padding([10, 12, 14, 16]),
                background("white"),
                column(MATCH, 300, [
                    row(MATCH, MATCH, [
                        padding([10, 12, 14, 16]),
                        mainAxisAlignment("start"),
                        crossAxisAlignment("center"),
                        ...children
                    ]),
                    row(MATCH, MATCH, [
                        padding([10, 12, 14, 16]),
                        mainAxisAlignment("center"),
                        crossAxisAlignment("end"),
                        ...children
                    ]),
                    row(MATCH, MATCH, [
                        padding([10, 12, 14, 16]),
                        mainAxisAlignment("end"),
                        crossAxisAlignment("start"),
                        ...children
                    ]),
                ]),
                row(MATCH, 200, [
                    column(MATCH, MATCH, [
                        padding([10, 12, 14, 16]),
                        mainAxisAlignment("start"),
                        crossAxisAlignment("center"),
                        ...children
                    ]),
                    column(MATCH, MATCH, [
                        padding([10, 12, 14, 16]),
                        mainAxisAlignment("center"),
                        crossAxisAlignment("end"),
                        ...children
                    ]),
                    column(MATCH, MATCH, [
                        padding([10, 12, 14, 16]),
                        mainAxisAlignment("end"),
                        crossAxisAlignment("start"),
                        ...children
                    ]),
                ]),
                row(MATCH, MATCH, [
                    image(WRAP, MATCH, [
                        source(Basketball)
                    ]),
                    image(100, WRAP, [
                        source(Basketball)
                    ]),
                    image(WRAP, 100, [
                        source(Basketball)
                    ]),
                    image(WRAP, WRAP, [
                        source(Basketball)
                    ]),
                    column(40, 40, [
                        round(20),
                        background("black")
                    ]),
                    column(40, 40, [
                        round(10),
                        background("black")
                    ])
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
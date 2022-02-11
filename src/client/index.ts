import {
    root,
    row,
    background,
    MATCH,
    text,
    MATCH_WRAP,
    WRAP,
    size,
    color,
    column,
    align
} from "./api"

const main = async () => {
    try {
        const response = await fetch("/api", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify(root(
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
            ), (key, value) => key === "parent" ? undefined : value)
        })
        const data = await response.blob()
        const url = URL.createObjectURL(data);
        document.querySelector<HTMLImageElement>("#image").src = url;
        console.log("ALL GOOD", url)
    } catch(e) {
        console.log("ERROR", e)
    }
}

main()
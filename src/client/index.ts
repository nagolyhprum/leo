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
	leonarto,
	margin,
	padding,
	round,
	image,
	source,
	mainAxisAlignment,
	crossAxisAlignment,
	stack,
	position,
	translate
} from "./api";

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
]));

export const rows = (domain = location.protocol + "//" + location.host) => {
	return leonarto({
		endpoint : `${domain}/api`
	}).canvas(
		column(MATCH, MATCH, [
			padding([10, 12, 14, 16]),
			background("white"),
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
			])
		]),
		400, 
		400
	);
};


export const columns = (domain = location.protocol + "//" + location.host) => {
	return leonarto({
		endpoint : `${domain}/api`
	}).canvas(
		row(MATCH, MATCH, [
			padding([10, 12, 14, 16]),
			background("white"),
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
		400, 
		400
	);
};

export const stackWithImages = (domain = location.protocol + "//" + location.host) => {
	const Basketball = `${domain}/basketball.svg`;
	console.log({ Basketball });
	return leonarto({
		endpoint : `${domain}/api`
	}).canvas(stack(MATCH, MATCH, [  
		image(150, WRAP, [
			source(Basketball),
			position({
				top : 8,
				right : 16
			})
		]),
		image(WRAP, 150, [
			source(Basketball),
			position({
				bottom : .1,
				right : .2
			})
		]),
		image(WRAP, WRAP, [
			source(Basketball),
			position({
				bottom : .2,
				left : .1
			})
		]),
		column(40, 40, [
			round(20),
			background("black"),
			position({
				left : .5,
				top : .5
			}),
			translate({
				x : -.5,
				y : -.5
			})
		]),
		column(40, 40, [
			round(10),
			background("black"),
			position({
				left : .25,
				top : .25
			}),
			translate({
				x : -.5,
				y : -.5
			})
		])
	]), 400, 400);
};

const main = async () => {
	try {
        document.querySelector<HTMLImageElement>("#columns")!.src = await (await columns()).url();
        document.querySelector<HTMLImageElement>("#rows")!.src = await (await rows()).url();
        document.querySelector<HTMLImageElement>("#stackWithImages")!.src = await (await stackWithImages()).url();
        console.log("DONE");
	} catch(e) {
		console.log("ERROR", e);
	}
};

if(typeof document !== "undefined") {
	main();
}
import absoluteUrl from "next-absolute-url";
import { useMemo } from "react";
import { 
	text,
	WRAP,
	size,
	padding,
	margin,
	color,
	leonarto,
	column,
	background,
	row,
	MATCH,
	mainAxisAlignment,
	crossAxisAlignment,
	stack,
	image,
	source,
	position,
	round,
	translate
} from "../src/client/api";

export const stackWithImages = (domain) => {
	const Basketball = `${domain}/basketball.svg`;
	return leonarto({
		endpoint : "/api"
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

export const columns = () => {
	return leonarto({
		endpoint : "/api"
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

export const rows = () => {
	return leonarto({
		endpoint : "/api"
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

const Columns = () => {
	const src = useMemo(() => columns(), []);
	return (
		<>
			<h3>Columns</h3>
			<img src={src} />
		</>
	);
};

const Rows = () => {
	const src = useMemo(() => rows(), []);
	return (
		<>
			<h3>Rows</h3>
			<img src={src} />
		</>
	);
};

const StackWithImages = ({
	domain
} : {
    domain : string
}) => {
	const src = useMemo(() => stackWithImages(domain), []);
	return (
		<>
			<h3>Stack with Images</h3>
			<img src={src} />
		</>
	);
};

const Homepage = ({
	domain
} : {
    domain : string
}) => {
	return (
		<>
			<h1>Leonarto</h1>

			<h2>Raw</h2>
			<h3>Image (w320)</h3>
			<img width="320" src="/bear.jpeg" />
			<h3>Image (h240)</h3>
			<img height="240" src="/bear.jpeg" />

			<h2>API</h2>
			<h3>Resized image (320x240)</h3>
			<img src={`/api?src=${encodeURIComponent(domain)}%2Fbear.jpeg&width=320&height=240`} />
			<h3>Resized image (w320)</h3>
			<img src={`/api?src=${encodeURIComponent(domain)}%2Fbear.jpeg&width=320`} />
			<h3>Resized image (h240)</h3>
			<img src={`/api?src=${encodeURIComponent(domain)}%2Fbear.jpeg&height=240`} />
			<h3>Cover</h3>
			<img src={`/api?src=${encodeURIComponent(domain)}%2Fbear.jpeg&width=400&height=200&size=cover`} />
			<h3>Contain</h3>
			<img src={`/api?src=${encodeURIComponent(domain)}%2Fbear.jpeg&width=240&height=240&size=contain`} />
			<h3>WebP Support</h3>
			<img src={`/api?src=${encodeURIComponent(domain)}%2Fbear.jpeg&width=320&height=120&size=contain&type=image/webp`} />
			<Columns />
			<Rows />
			<StackWithImages domain={domain} />
		</>
	);
};

export const getServerSideProps = (context) => {
	const { req } = context;
	const { protocol, host } = absoluteUrl(req);
	return {
		props : {
			domain : `${protocol}//${host}`
		}
	};
};

export default Homepage;
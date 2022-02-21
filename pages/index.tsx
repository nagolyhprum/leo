import fetch from "cross-fetch";
import absoluteUrl from "next-absolute-url";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { 
	text,
	WRAP,
	size,
	padding,
	margin,
	color,
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
import { Image, ImageProvider, useCanvas } from "../src/client/api/react";

export const stackWithImages = ({
	domain
} : {
    domain : string
}) => {
	const Basketball = `${domain}/basketball.svg`;
	return stack(MATCH, MATCH, [  
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
	]);
};

export const columns = () => {
	return row(MATCH, MATCH, [
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
	]);
};

export const rows = () => {
	return column(MATCH, MATCH, [
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
	]);
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
	const src = useCanvas(columns, 400, 400, []);
	return (
		<>
			<h3>Columns</h3>
			<img src={src} />
		</>
	);
};

const Rows = () => {
	const src = useCanvas(rows, 400, 400, []);
	return (
		<>
			<h3>Rows</h3>
			<img src={src} />
		</>
	);
};

const StackWithImages = () => {
	const src = useCanvas(stackWithImages, 400, 400, []);
	return (
		<>
			<h3>Stack with Images</h3>
			<img src={src} />
		</>
	);
};

const useTracker = () : {
    stats : React.ReactNode
    ref : MutableRefObject<HTMLImageElement>
} => {
	const ref = useRef<HTMLImageElement | null>();
	const [start, setStart] = useState(0);
	const [stop, setStop] = useState(0);
	const [size, setSize] = useState(0);
	useEffect(() => {
		(async () => {
			setStart(Date.now());
			const res = await fetch(ref.current?.src);
			setStop(Date.now());
			setSize(Number(res.headers.get("Content-Length")));
		})();
	}, [ref.current?.src]);
	return {
		stats : start && stop && size ? (
			<>
				<div>Duration : {stop - start}ms</div>
				<div>Length : {Math.floor(size / 1024)}KB</div>
			</>
		) : null,
		ref
	};
};

const ImageWrapper = (props : Parameters<typeof Image>[0]) => {
	const { stats, ref } = useTracker();
	return (
		<div>
			<Image {...props} ref={ref} />
			{stats}
		</div>
	);
};

const RawImageWrapper = (props : {
    src : string
    width?: number
    height?: number
}) => {
	const { ref, stats } = useTracker();
	return (
		<div>
			<img {...props} ref={ref} />
			{stats}
		</div>
	);
};

const Homepage = ({
	domain
} : {
    domain : string
}) => {
	return (
		<ImageProvider domain={domain}>
			<h1>Leonarto</h1>

			<h2>Raw</h2>
			<h3>Image (w320)</h3>
			<RawImageWrapper width={320} src="/bear.jpeg" />
			<h3>Image (h240)</h3>
			<RawImageWrapper height={240} src="/bear.jpeg" />

			<h2>API</h2>
			<h3>Resized image (320x240)</h3>
			<ImageWrapper src="/bear.jpeg" width={320} height={240} />
			<h3>Resized image (w320)</h3>
			<ImageWrapper src="/bear.jpeg" width={320} />
			<h3>Resized image (h240)</h3>
			<ImageWrapper src="/bear.jpeg" height={240} />
			<h3>Cover (400x200)</h3>
			<ImageWrapper src="/bear.jpeg" width={400} height={200} size="cover" />
			<h3>Contain (240x240)</h3>
			<ImageWrapper src="/bear.jpeg" width={240} height={240} size="contain" />
			<h3>WebP Support (320x120)</h3>
			<ImageWrapper src="/bear.jpeg" width={320} height={120} size="contain" type="image/webp" />
			<Columns />
			<Rows />
			<StackWithImages />
		</ImageProvider>
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
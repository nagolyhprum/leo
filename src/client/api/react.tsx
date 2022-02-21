import { createContext, DependencyList, ForwardedRef, forwardRef, useContext, useMemo } from "react";
import { leonarto } from ".";

export const ImageContext = createContext({
	domain : "",
	endpoint : ""
});

export const useCanvas = (root : ({
	endpoint,
	domain
} : {
    endpoint : string
    domain : string
}) => (config : ComponentConfig) => Component, width : number, height : number, deps : DependencyList) => {
	const context = useContext(ImageContext);
	const { endpoint } = context;
	return useMemo(() => {
		return leonarto({
			endpoint
		}).canvas(root(context), width, height);
	}, [width, height, ...deps]);
};

export const ImageProvider = ({
	domain,
	endpoint = "/api",
	children
} : {
    domain : string
    endpoint?: string
    children : React.ReactNode
}) => {
	return (
		<ImageContext.Provider value={{
			domain,
			endpoint,
		}}>
			{children}
		</ImageContext.Provider>
	);
};

export const Image = forwardRef(({
	src,
	width,
	height,
	type,
	size,
} : {
    src : string
    width?: number
    height?: number
    type?: "image/png" | "image/webp" | "image/jpeg"
    size?: "cover" | "contain"
}, ref : ForwardedRef<HTMLImageElement>) => {
	const context = useContext(ImageContext);
	const query = {
		src : `${context.domain}${src}`,
		width,
		height,
		type,
		size
	};
	return (
		<div style={{
			background : "black",
			display : "inline-flex",
			justifyContent : "center",
			alignItems : "center",
			...(width ? {
				width : `${width}px`
			} : {}),
			...(height ? {
				height : `${height}px`
			} : {}),
		}}>
			<img ref={ref} src={`${context.endpoint}?${
				Object.keys(query).filter(
					key => query[key]
				).map(
					key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
				).join("&")
			}`} />
		</div>
	);
});
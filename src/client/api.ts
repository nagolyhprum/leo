export const MATCH = -1;
export const WRAP = -2;

const handleProp = (child : Component, prop : ((config : ComponentConfig) => Component) | string) => {
	if (typeof prop === "string") {
		if ("children" in child) {
			throw new Error("a component can only contain one type of child");
		}
		child.text = prop;
		return child;
	}
	return prop({
		parent: child
	});
};
const tag = (type : ComponentType) => (
	width : number,
	height : number,
	props : Array<((config : ComponentConfig) => Component) | string>
) => ({ parent } : ComponentConfig) => {
	if ("text" in parent) {
		throw new Error("a component can only contain one type of child");
	}
	const child = props.reduce(handleProp, <Component>{
		type,
		width,
		height,
		parent
	});
	const children = parent.children ?? [];
	parent.children = children;
	children.push(child);
	return parent;
};
// TAGS
export const row = tag("row");
export const column = tag("column");
export const stack = tag("stack");
export const text = tag("text");
export const image = tag("image");
const setter = <K extends keyof Component>(name : K) => (value : Component[K]) => ({ parent } : ComponentConfig) => {
	parent[name] = value;
	return parent;
};
// PROPS
export const color = setter("color");
export const background = setter("background");
export const stroke = setter("stroke");
export const padding = setter("padding");
export const position = setter("position");
export const margin = setter("margin");
export const size = setter("size");
export const source = setter("source");
export const round = setter("round");
export const mainAxisAlignment = setter("mainAxisAlignment");
export const crossAxisAlignment = setter("crossAxisAlignment");
export const opacity = setter("opacity");
export const id = setter("id");
export const translate = setter("translate");
export const align = setter("align");
export const shadow = setter("shadow");
export const clip = setter("clip");
export const wrap = setter("wrap");
export const scale = setter("scale");

export const leonarto = (config : {
  endpoint : string
}) => {
	return {
		canvas : (
			component : (config : ComponentConfig) => Component,
			width : number,
			height : number
		) => {
			const root = component({
				parent : {
					height,
					width,
					type: "root"
				} as Component
			});
			return `${config.endpoint}?src=${encodeURIComponent(JSON.stringify(root, (key, value) => key === "parent" ? undefined : value))}`;
		}
	};
};
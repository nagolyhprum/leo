import { createCanvas, loadImage } from "canvas";
import { MATCH, WRAP } from "../client/api";

const debug = true;

export const api = async (    
	root : Component,
	ratio : number,
	defaultFontSize : 12
) => {    
	const getSpacing = <T>(spacing : Spacing | null | undefined, zero : T) : SpacingCalculation<T> => {
		if(typeof spacing === "number") {
			return {
				top: spacing * ratio,
				right: spacing * ratio,
				bottom: spacing * ratio,
				left: spacing * ratio,
				width: spacing * 2 * ratio,
				height: spacing * 2 * ratio
			};
		} else if(spacing instanceof Array) {
			if (spacing.length === 1) {
				return {
					top: spacing[0] * ratio,
					right: spacing[0] * ratio,
					bottom: spacing[0] * ratio,
					left: spacing[0] * ratio,
					width: spacing[0] * 2 * ratio,
					height: spacing[0] * 2 * ratio
				};
			}
			if (spacing.length === 2) {
				return {
					top: spacing[0] * ratio,
					right: spacing[1] * ratio,
					bottom: spacing[0] * ratio,
					left: spacing[1] * ratio,
					width: spacing[1] * 2 * ratio,
					height: spacing[0] * 2 * ratio
				};
			}
			if (spacing.length === 4) {
				return {
					top: spacing[0] * ratio,
					right: spacing[1] * ratio,
					bottom: spacing[2] * ratio,
					left: spacing[3] * ratio,
					width: spacing[1] + spacing[3] * ratio,
					height: spacing[0] + spacing[2] * ratio
				};
			}
		} else if(spacing && typeof spacing === "object") {
			return {
				top : getNumber(spacing.top, zero),
				right: getNumber(spacing.right, zero),
				bottom: getNumber(spacing.bottom, zero),
				left : getNumber(spacing.left, zero),
				width : ((spacing.left ?? 0) + (spacing.right ?? 0)) * ratio,
				height : ((spacing.top ?? 0) + (spacing.bottom ?? 0)) * ratio
			};
		}
		return {
			top: zero,
			right: zero,
			bottom: zero,
			left: zero,
			width: 0,
			height: 0
		};
	};
      
	const getNumber = <T>(input : number | undefined, otherwise : T) => {
		if(input !== undefined) {
			if(-1 < input && input < 1) {
				return input;
			}
			return input * ratio;
		}
		return otherwise;
	};
      
	const draw = (element : Component, images : Record<string, HTMLImageElement>) => {
		context.save();
		if(element.scale) {
			context.scale(element.scale.x, element.scale.y);
		}
		const alpha = element.opacity ?? context.globalAlpha;
		if(alpha === 0) {
			context.restore();
			return [];
		}
		context.globalAlpha = alpha;
		context.translate(element.coords.x, element.coords.y);
		if(element.translate) {
			const { x = 0, y = 0 } = element.translate;    
			context.translate(x * element.coords.width, y * element.coords.height);
		}
		if(element.shadow) {
			context.shadowColor = "rgba(0, 0, 0, .2)";
			context.shadowOffsetX = 4;
			context.shadowOffsetY = 4;
			context.shadowBlur = 4;
		} else {
			context.shadowColor = "transparent";    
		}
		const padding = getSpacing(element.padding, 0);
		const margin = getSpacing(element.margin, 0);
		context.fillStyle = element.background ?? "transparent";
		// context.strokeStyle = "red";
		context.strokeStyle = "transparent";
		context.lineWidth = 1;
		context.beginPath();
		if (element.round) {
			const round = element.round * ratio;
			const {
				coords: { 
					width, 
					height 
				}
			} = element;
			if(round === width / 2 && round === height / 2) {
				context.ellipse(round, round, round, round, 0, 0, 2 * Math.PI);
			} else {
				context.moveTo(round, 0);
				context.lineTo(width - round, 0);
				context.quadraticCurveTo(width, 0, width, round);
				context.lineTo(width, height - round);
				context.quadraticCurveTo(
					width,
					height,
					width - round,
					height
				);
				context.lineTo(round, height);
				context.quadraticCurveTo(0, height, 0, height - round);
				context.lineTo(0, round);
				context.quadraticCurveTo(0, 0, round, 0);
				context.closePath();
			}
		} else {
			context.rect(
				0,
				0,
				Math.ceil(element.coords.width),
				Math.ceil(element.coords.height)
			);
		}
		context.stroke();
		context.fill();
		if(element.clip) {
			context.clip();
		}
		(element.children ?? []).forEach(
			(it) => {
				draw(it, images);
			}
		);
		if (element.source) {
			context.drawImage(
				images[element.source],
				padding.left,
				padding.top,
				element.coords.width - padding.width,
				element.coords.height - padding.height
			);
		}
		context.shadowColor = "transparent";    
		if (element.text instanceof Array) {
			context.fillStyle = element.color ?? "transparent";
			context.textBaseline = "top";
			context.textAlign = "start";
			const fontSize = (element.size ?? defaultFontSize) * ratio;
			element.text.forEach(({
				text,
				x,
				y,
				isBold
			}) => {
				context.font = `${isBold ? "italic bold " : ""} ${fontSize}px sans-serif`;
				context.fillText(text, x, y);
			});
		}
		if(debug) {
			// PADDING
			context.fillStyle = "rgba(0, 255, 0, 0.5)";
			// TOP
			context.fillRect(
				0, 
				0, 
				element.coords.width, 
				padding.top
			);
			// BOTTOM
			context.fillRect(
				0, 
				element.coords.height - padding.bottom, 
				element.coords.width, 
				padding.bottom
			);
			// LEFT
			context.fillRect(
				0, 
				padding.top, 
				padding.left, 
				element.coords.height - padding.top - padding.bottom
			);
			// RIGHT
			context.fillRect(
				element.coords.width - padding.right, 
				padding.top, 
				padding.right, 
				element.coords.height - padding.top - padding.bottom
			);
			// MARGIN
			context.fillStyle = "rgba(0, 0, 255, 0.5)";
			// TOP
			context.fillRect(
				-margin.left,
				-margin.top,
				margin.left + margin.right + element.coords.width,
				margin.top
			);
			// BOTTOM
			context.fillRect(
				-margin.left,
				element.coords.height,
				margin.left + margin.right + element.coords.width,
				margin.bottom
			);
			// LEFT
			context.fillRect(
				-margin.left,
				0,
				margin.left,
				element.coords.height
			);
			// LEFT
			context.fillRect(
				element.coords.width,
				0,
				margin.right,
				element.coords.height
			);
			context.lineWidth = 2;
			context.strokeStyle = "rgba(255, 0, 0, 0.5)";
			context.setLineDash([2, 4]);
			context.strokeRect(0, 0, element.coords.width, element.coords.height);
		}
		context.restore();
	};
      
	const eachNode = async (root : Component, callback : (component : Component) => Promise<void>) => {
		const nodes = [root];
		let node;
		while((node = nodes.shift())) {
			await callback(node);
			nodes.push(...(node.children || []));
		}
	};
      
	const measure = (component : Component, images : Record<string, HTMLImageElement>) => {
		measureComponentWidth(component, images, false);
		measureComponentHeight(component, images, false);
	};
      
	const dependsOnParent = (component : Component, dimension : "width" | "height") : component is Component => {
		return component[dimension] === MATCH || 
          !!component.parent?.mainAxisAlignment || 
          !!component.parent?.crossAxisAlignment || 
          !!component.position ||
          (0 < component[dimension] && component[dimension] < 1);
	};
      
	const dependsOnChild = (component : Component | undefined, dimension : "width" | "height") : component is Component => {
		return !!component && (component[dimension] === WRAP || component.type === "row" || component.type === "column");
	};
      
	const dependsOnSiblings = (component : Component, dimension : "width" | "height") : component is Component => {
		return component.parent?.children?.some(it => it[dimension] === MATCH) ?? false;
	};
      
	const measureImage = (component : Component, dimension : "width" | "height", images : Record<string, HTMLImageElement>) : number => {
		if(component.source) {
			const image = images[component.source];
			const other = OTHER[dimension];
			if(component[dimension] === WRAP) {
				const value = component[other];
				const available = (component.parent?.coords[other] ?? 0) - (getSpacing(component.parent?.padding, 0)[other]);
				if(value === WRAP) {
					return image[dimension];
				} else if(value === MATCH) {
					return (image[dimension] * (available / image[other])) / ratio;
				} else if(0 < value && value < 1) {
					return (image[dimension] * (available * value / image[other])) / ratio;
				} else {
					return (image[dimension] * (value / image[other]));
				}
			}
		}
		return component[dimension];
	};
      
	const OTHER : Record<"width" | "height", "width" | "height"> = {
		width : "height",
		height : "width"
	};
    
	const getNonWrapParent = (component : Component, dimension : "width" | "height") : number => {
		if(component[dimension] === WRAP) {
			if(component.parent) {
				return getNonWrapParent(component.parent, dimension);
			} else {
				return 0;
			}
		} else {
			return component.coords[dimension];
		}
	};
    
	const measureComponentWidth = (component : Component, images : Record<string, HTMLImageElement>, force : boolean) : boolean => {
		let width = component.width;
		if(component.source) {
			width = measureImage(component, "width", images);
		}
		if(width === WRAP) {    
			if(component.text instanceof Array) {
				const text = component.text;
				const fontSize = (component.size ?? defaultFontSize) * ratio;
				context.font = `${fontSize}px sans-serif`;
				const space = context.measureText(" ").width;
				const total = text.reduce((width, text, index) => {
					return width + text.width + (index ? space : 0);
				}, getSpacing(component.padding, 0).width);
				width = Math.min(
					getNonWrapParent(component, "width") ?? Number.POSITIVE_INFINITY, 
					total
				);
			}
			if(component.type === "stack") {      
				const max = (component.children ?? []).reduce((max, child) => {
					return Math.max(max, child.coords.width);
				}, 0);
				width = max;
			} else if(component.type === "row") {
				const total = (component.children ?? []).reduce((total, child) => {
					return total + child.coords.width + getSpacing(child.margin, 0).width;
				}, getSpacing(component.padding, 0).width);
				width = total;
			}
		} else if(width === MATCH) {
			if(component.parent?.type === "row") {
				const start = component.parent.coords.width - getSpacing(component.parent.padding, 0).width;
				const {
					space,
					children
				} = (component.parent.children ?? []).reduce(({
					space,
					children
				}, sibling) => {
					return {
						children : children + (sibling.width === MATCH ? 1 : 0),
						space : space - (sibling.width === MATCH ? 0 : (sibling.coords.width + getSpacing(sibling.margin, 0).width))
					};
				}, {
					space : start,
					children : 0
				});
				width = (space / children) - getSpacing(component.margin, 0).width;
			} else {
				width = (component.parent?.coords.width ?? 0) - getSpacing(component.margin, 0).width - getSpacing(component.parent?.padding, 0).width;
			}
		} else if(0 <= width && width < 1) {
			width = (component.parent?.coords.width ?? 0) * width;
		} else {
			width = width * ratio + getSpacing(component.padding, 0).width;
		}
      
		if(force || component.coords.width !== width) {
			if(component.coords.width !== width) {
				component.coords.width = width;
				if(component.text) {
					measureComponentHeight(component, images, true);
				}
				if(dependsOnChild(component.parent, "width")) {
					measureComponentWidth(component.parent, images, true);
				}
				if(dependsOnSiblings(component, "width")) {
					(component.parent?.children ?? []).forEach(child => {
						measureComponentWidth(child, images, true);
					});
				}
				component.children?.forEach((child) => {
					if(dependsOnParent(child, "width")) {
						measureComponentWidth(child, images, true);
					}
				});
			}
			if(component.type === "row") {
				(component.children ?? []).forEach((child, index, children) => {
					if(index) {
						const prev = children[index - 1];
						child.coords.x = prev.coords.x + prev.coords.width + getSpacing(prev.margin, 0).right + getSpacing(child.margin, 0).left;
					} else {
						const space = children.reduce((size, child) => size + child.coords.width + getSpacing(child.margin, 0).width, 0);
						const axis = component.crossAxisAlignment || "start";
						switch(axis) {
						case "start":
							child.coords.x = getSpacing(component.padding, 0).left + getSpacing(child.margin, 0).left;
							break;
						case "center": {
							const padding = getSpacing(component.padding, 0);
							child.coords.x = component.coords.width / 2 - space / 2 + padding.left;
							break;
						}
						case "end":
							child.coords.x = component.coords.width - space - getSpacing(component.padding, 0).right + getSpacing(child.margin, 0).left;
							break;
						}
					}
				});
			}
			if(component.parent?.type === "column") {
				const axis = component.parent.mainAxisAlignment ?? "start";
				switch(axis) {
				case "start" : 
					component.coords.x = getSpacing(component.margin, 0).left + getSpacing(component.parent.padding, 0).left;
					break;
				case "center": {
					const padding = getSpacing(component.padding, 0);
					component.coords.x = component.parent.coords.width / 2 - component.coords.width / 2 - padding.right + padding.left;
					break;
				}
				case "end":
					component.coords.x = component.parent.coords.width - component.coords.width - getSpacing(component.margin, 0).right - getSpacing(component.parent.padding, 0).right;
					break;
				}
			}
			if(component.position && component.parent) {
				const {
					right,
					left
				} = getSpacing(component.position, null);
				if(left !== null) {
					if(0 < left && left < 1) {
						component.coords.x = left * component.parent.coords.width;
					} else {
						component.coords.x = left;
					}
				}
				if(right !== null) {
					if(0 < right && right < 1) {
						component.coords.x = (1 - right) * component.parent.coords.width - component.coords.width;
					} else {
						component.coords.x = component.parent.coords.width - component.coords.width - right;
					}
				}
			}
			return true;
		}
		return false;
	};
      
	const measureComponentHeight = (component : Component, images : Record<string, HTMLImageElement>, force : boolean) : boolean => {
		let height = component.height;
		if(component.source) {
			height = measureImage(component, "height", images);
		}
		if(height === WRAP) {
			if(component.text instanceof Array) {
				const text = component.text;
				const fontSize = (component.size ?? defaultFontSize) * ratio;
				const lines : Array<Array<{
              text : string
              width : number
              isBold : boolean
            }>> = [[]];
				context.font = `${fontSize}px sans-serif`;
				const space = context.measureText(" ").width;      
				const padding = getSpacing(component.padding, 0);
				const max = component.coords.width - padding.width;
				const cursor = { x : 0, y : 0 };
				text.forEach(text => {
					// if it wraps then do wrapping logic
					if(component.wrap !== false) {
						// if there are words in the line already
						if(lines[lines.length - 1].length) {
							// then we need spaces
							if(cursor.x + text.width + space <= max) {
								cursor.x += text.width + space;
							} else {
								cursor.x = text.width;
								lines.push([]);
							}
						} else {       
							// then we do not need a space  
							cursor.x += text.width;
						}
					}
					lines[lines.length - 1].push({
						text : text.text,
						width : text.width,
						isBold : text.isBold,
					});
				});    
				const words : Array<{
              text : string
              x : number
              y : number
              isBold : boolean
              width : number
            }> = [];
				lines.forEach((line, index) => {
					const width = line.reduce((total, { width }) => width + total, (line.length - 1) * space);
					switch(component.align) {
					case "end":
						cursor.x = component.coords.width - width;
						break;
					case "center":
						cursor.x = component.coords.width / 2 - width / 2;
						break;
					default:
						cursor.x = padding.left;            
						break;
					}
					cursor.y = padding.top + index * fontSize;
					line.forEach(({
						text,
						width,
						isBold
					}, index) => {
						words.push({
							text,
							x: cursor.x + (index ? space : 0),
							y: cursor.y,
							isBold,
							width
						});
						cursor.x += (index ? space : 0) + width;
					});
				});
				height = cursor.y + fontSize + padding.bottom;
				component.text = words;
			} else if(component.type === "column") {
				const total = (component.children ?? []).reduce((total, child) => {
					return total + child.coords.height + getSpacing(child.margin, 0).height;
				}, getSpacing(component.padding, 0).height);
				height = total;
			} else if(component.type === "row") {
				const padding = getSpacing(component.padding, 0).height;
				const max = (component.children ?? []).reduce((max, child) => {
					return Math.max(max, child.coords.height + getSpacing(child.margin, 0).height + padding);
				}, 0);
				height = max;
			}
		} else if(height === MATCH) {
			if(component.parent?.type === "column") {
				const start = component.parent.coords.height - getSpacing(component.parent.padding, 0).height;
				const {
					space,
					children
				} = (component.parent.children ?? []).reduce(({
					space,
					children
				}, sibling) => {
					return {
						children : children + (sibling.height === MATCH ? 1 : 0),
						space : space - (sibling.height === MATCH ? 0 : (sibling.coords.height + getSpacing(sibling.margin, 0).height))
					};
				}, {
					space : start,
					children : 0
				});
				height = (space / children) - getSpacing(component.margin, 0).width;
			} else {
				height = component.parent?.coords.height ?? 0;
			}
		} else if(0 < height && height < 1) {
			height = (component.parent?.coords.height ?? 0) * height; 
		} else {
			height = height * ratio + getSpacing(component.padding, 0).height;
		}
		if(force || component.coords.height !== height) {
			if(component.coords.height !== height) {
				component.coords.height = height;
				if(dependsOnChild(component.parent, "height")) {
					measureComponentHeight(component.parent, images, true);
				}
				if(dependsOnSiblings(component, "height")) {
					(component.parent?.children ?? []).forEach(child => {
						measureComponentHeight(child, images, true);
					});
				}
				component.children?.forEach((child) => {
					if(dependsOnParent(child, "height")) {
						measureComponentHeight(child, images, true);
					}
				});
			}
			if(component.type === "column") {
				(component.children ?? []).forEach((child, index, children) => {
					if(index) {
						const prev = children[index - 1];
						child.coords.y = prev.coords.y + prev.coords.height + getSpacing(prev.margin, 0).bottom + getSpacing(child.margin, 0).top;
					} else {
						const space = children.reduce((size, child) => size + child.coords.height + getSpacing(child.margin, 0).height, 0);
						const axis = component.crossAxisAlignment || "start";
						switch(axis) {
						case "start":
							child.coords.y = getSpacing(component.padding, 0).top + getSpacing(child.margin, 0).top;
							break;
						case "center": {
							const padding = getSpacing(component.padding, 0);
							child.coords.y = component.coords.height / 2 - space / 2 + padding.top;
							break;
						}
						case "end":
							child.coords.y = component.coords.height - space - getSpacing(component.padding, 0).bottom + getSpacing(child.margin, 0).top;
							break;
						}
					}
				});
			}
			if(component.parent?.type === "row") {
				const axis = component.parent.mainAxisAlignment ?? "start";
				switch(axis) {
				case "start" : 
					component.coords.y = getSpacing(component.margin, 0).top + getSpacing(component.parent.padding, 0).top;
					break;
				case "center": {
					const padding = getSpacing(component.padding, 0);
					component.coords.y = component.parent.coords.height / 2 - component.coords.height / 2 - padding.bottom + padding.top;
					break;
				}
				case "end":
					component.coords.y = component.parent.coords.height - component.coords.height - getSpacing(component.margin, 0).bottom - getSpacing(component.parent.padding, 0).bottom;
					break;
				}
			}
			if(component.position && component.parent) {
				const {
					top,
					bottom,
				} = getSpacing(component.position, null);
				if(top !== null) {
					if(0 < top && top < 1) {
						component.coords.y = top * component.parent.coords.height;
					} else {
						component.coords.y = top;
					}
				}
				if(bottom !== null) {
					if(0 < bottom && bottom < 1) {
						component.coords.y = (1 - bottom) * component.parent.coords.height - component.coords.height;
					} else {
						component.coords.y = component.parent.coords.height - component.coords.height - bottom;
					}
				}
			}
			return true;
		}
		return false;
	};

	const canvas = createCanvas(0, 0);
	const context = canvas.getContext("2d");

	const images : Record<string, HTMLImageElement> = {};

	await eachNode(root, async node => {
		node.coords = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
		(node.children ?? []).forEach(child => child.parent = node);
		const fontSize = (node.size || defaultFontSize) * ratio;
		if(typeof node.text === "string") {
			const { text } = node.text.split("**").reduce(({
				isBold,
				text
			}, item) => {
				context.font = `${isBold ? "italic bold " : ""} ${fontSize}px sans-serif`;
				return {
					text : item.split(/\s+/).reduce((text, item) => {
						return text.concat([{
							text : item,
							x : 0,
							y : 0,
							isBold,
							width : context.measureText(item).width
						}]);
					}, text),
					isBold : !isBold
				};
			}, {
				isBold : false,
				text : [] as Array<{
                  text : string
                  x : number
                  y : number
                  isBold : boolean
                  width : number
                }>
			});
			node.text = text;
		}
		if(node.source) {
			images[node.source] = (await loadImage(node.source)) as unknown as HTMLImageElement;
		}
	});

	await eachNode(root, async node => measure(node, images));

	canvas.width = root.coords.width;
	canvas.height = root.coords.height;

	// console.log(JSON.stringify(root, (key, value) => key !== "parent" ? value : undefined, "\t"))

	draw(root, images);

	return canvas.toBuffer("image/png");
};
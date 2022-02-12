declare module '*.svg' {
  const content : string
  export default content
}

type Alignment = "start" | "center" | "end"

type ComponentType = "root" | "stack" | "image" | "column" | "row" | "text"

type Component = {
  width: number
  height: number
  type: ComponentType
  coords : {
    x : number
    y : number
    width : number
    height : number
  }
  parent?: Component
  // OPTIONAL
  stroke?: string
  scale?: {
    x : number
    y : number
  }
  wrap?: boolean
  mainAxisAlignment?: Alignment
  crossAxisAlignment?: Alignment
  opacity?: number
  shadow?: boolean
  translate?: {
    x?: number
    y?: number
  }
  margin?: Spacing
  padding?: Spacing
  position?: Spacing
  background?: string
  round?: number
  children?: Array<Component>
  source?: string
  text?: string | Array<{
    text : string
    width : number
    x : number
    y : number
    isBold : boolean
  }>
  color?: string
  align?: Alignment
  size?: number
  id?: string
  clip?: boolean
}

type ComponentConfig = {
  parent : Component
}

type Spacing = number | number[] | {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

type SpacingCalculation<T> = {
  top: number | T
  right: number | T
  bottom: number | T
  left: number | T
  width: number
  height: number
}
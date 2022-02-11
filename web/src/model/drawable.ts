export abstract class Drawable<DrawPrams = void> {
  constructor(protected ctx: CanvasRenderingContext2D) {}
  abstract draw(params: DrawPrams): void
}

type CellDrawParams = { x: number; y: number; w: number; h: number }

export class Cell extends Drawable<CellDrawParams> {
  #color: string
  constructor(ctx: CanvasRenderingContext2D, color: string) {
    super(ctx)
    this.#color = color
  }
  draw({ x, y, w, h }: CellDrawParams) {
    this.ctx.beginPath()
    this.ctx.rect(x, y, w, h)
    this.ctx.fillStyle = this.#color
    this.ctx.fill()
    this.ctx.closePath()
  }
}
export abstract class Drawable<DrawPrams = void> {
  constructor(protected ctx: CanvasRenderingContext2D) {}
  abstract draw(params: DrawPrams): void
}

type CellDrawParams = { x: number; y: number; w: number; h: number }

export class Cell extends Drawable<CellDrawParams> {
  #color: string
  // #cellWidth = 0
  // #cellHeight = 0
  constructor(ctx: CanvasRenderingContext2D, color: string) {
    super(ctx)
    this.#color = color
    // this.#cellWidth = Math.floor(this.ctx.canvas.width / BOARD_SIZE.x)
    // this.#cellHeight = Math.floor(this.ctx.canvas.height / BOARD_SIZE.y)
  }
  draw({ x, y, w, h }: CellDrawParams) {
    this.ctx.beginPath()
    this.ctx.rect(x, y, w, h)
    this.ctx.fillStyle = this.#color
    this.ctx.fill()
    this.ctx.closePath()
  }
}
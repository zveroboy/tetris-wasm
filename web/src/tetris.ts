import init, {Game} from "tetris-wasm";

enum BoardCell {
  Empty = 0,
  Filled = 1
}

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
    // console.log({ x, y, w, h }, this.#color)

    this.ctx.beginPath()
    this.ctx.rect(x, y, w, h)
    this.ctx.fillStyle = this.#color
    this.ctx.fill()
    this.ctx.closePath()
  }
}

export class Tetris extends Drawable {
  private interval?: number
  private game!: Game
  private board: BoardCell[][] = []

  constructor(
    protected ctx: CanvasRenderingContext2D,
  ) {
    super(ctx)
  }

  async init() {
    await init()
    this.game = Game.new()
    return 
  }

  *traverse(): Generator<[number, number]> {
    for (const r in this.board) {
      for (const c in this.board[r]) {
        yield [+r, +c]
      }
    }
  }

  draw() {
    const gap = 1
    
    const {height, width}= this.ctx.canvas;

    const cellHeight = Math.floor(height / this.board.length)
    const cellWidth = Math.floor(width / this.board[0].length)

    this.ctx.clearRect(0, 0, width, height)
    for (const [r, c] of this.traverse()) {
      if(this.board[r][c] === BoardCell.Empty){
        continue;
      }

      new Cell(this.ctx, '#FF0000').draw({
        x: c * cellWidth + gap,
        y: r * cellHeight + gap,
        w: cellWidth - 2 * gap,
        h: cellHeight - 2 * gap,
      })
    }
  }

  addListeners() {
    document.addEventListener('keydown', this.keyListener)
  }

  removeListeners() {
    document.removeEventListener('keydown', this.keyListener)
  }

  tick = () => {
    try {
      this.board = this.game.tick()
      // if there is an intersection or reached bottom
      //    then put shape on top of heap
      this.draw()
      // merge figure and heap matrixes
      // if it is a top line
      //    then stop game
    } catch (e) {}
  }

  keyListener = ({ code }: KeyboardEvent) => {
    try {
      if (code === 'ArrowUp') {
        this.board = this.game.rotate()
        // this.scene.figure.moveY(-1)
      } else if (code === 'ArrowLeft') {
        this.board = this.game.move_left()
      } else if (code === 'ArrowRight') {
        this.board = this.game.move_right()
      } else if (code === 'ArrowDown') {
        this.board = this.game.move_down()
      }
      this.draw()
    } catch (e) {}
  }

  start(step: number) {
    this.addListeners()
    this.draw()
    this.interval = setInterval(this.tick, step)
  }

  stop() {
    clearInterval(this.interval)
    this.removeListeners()
  }
}

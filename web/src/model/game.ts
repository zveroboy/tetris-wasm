import { Renderer } from "./renderer"
import { GameStateExtended, GameStatus } from "./state"
import { Tetris } from "./tetris"

export class GameService {
  private interval: number | null = null

  constructor(    
    private game: Tetris,
    private renderers: Renderer[],
    private step: number
  ) {
    this.game.on('changed', this.handleStateChange)
    this.renderers.forEach((r)=>{
      r.on('start', () => this.start())
      r.on('pause', () => this.game.pause())
      r.on('resume', () => this.game.resume())
      r.on('restart', () => this.restart())
    })
  }

  load() {
    return this.game.load()
  }

  handleStateChange = (prev: GameStateExtended, cur: GameStateExtended) => {
    if (prev.status !== GameStatus.Over && cur.status === GameStatus.Over) {
      this.stop()
    } else if (!prev.paused && cur.paused) {
      this.clearInterval()
    } else if (prev.paused && !cur.paused) {
      this.setInterval()
    }

    this.render(cur)
  }

  addListeners() {
    document.addEventListener('keydown', this.keyListener)
  }

  removeListeners() {
    document.removeEventListener('keydown', this.keyListener)
  }

  keyListener = ({ code }: KeyboardEvent) => {
    if (code === 'ArrowUp') {
      this.game.rotate()
    } else if (code === 'ArrowLeft') {
      this.game.moveLeft()
    } else if (code === 'ArrowRight') {
      this.game.moveRight()
    } else if (code === 'ArrowDown') {
      this.game.moveDown()
    }
  }

  create(){
    this.game.create()
  }

  start = () => {
    this.addListeners()
    this.game.start()
    this.setInterval()
  }

  restart() {
    this.create()
    this.start()
  } 

  stop = () => {
    this.clearInterval()
    this.removeListeners()
  }

  setInterval = () => {
    this.interval = setInterval(this.game.tick, this.step)
  }

  clearInterval = () => {
    this.interval && clearInterval(this.interval)
    this.interval = null
  }

  render = (state: GameStateExtended) => {
    this.renderers.forEach((r) => r.render(state))
  }
}

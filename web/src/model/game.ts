import { Tetris } from "./tetris"
import { GameStateExtended, Presenter, View } from "./types"

export class GamePresenter implements Presenter {
  private interval: number | null = null
  
  constructor(    
    private state: GameStateExtended,
    private view: View,
    private game: Tetris,
    private step: number
  ) {
    this.state.on('next', this.render)
    this.state.on('paused', this.handlePaused)
    this.state.on('resumed', this.handleResumed)
    this.state.on('over', this.stop)
    
    this.view.on('rotate', this.rotate)
    this.view.on('moveLeft', this.moveLeft)
    this.view.on('moveRight', this.moveRight)
    this.view.on('moveDown', this.moveDown)
    this.view.on('start', this.start)
    this.view.on('pause', this.pause)
    this.view.on('resume', this.resume)
    this.view.on('restart', this.restart)
  }

  load(): void {
    return this.game.load()
  }

  rotate = () => {
    this.state.updateGameState(this.game.rotate())
  }

  moveLeft = () => {
    this.state.updateGameState(this.game.moveLeft())
  }

  moveRight = () => {
    this.state.updateGameState(this.game.moveRight())
  }

  moveDown = () => {
    this.state.updateGameState(this.game.moveDown())
  }

  create = () => {
    this.state.updateGameState(this.game.create())
  }

  pause = () => {
    this.state.updatePaused(true)
  }

  resume = () => {
    this.state.updatePaused(false)
  }

  start = () =>  {
    this.view.addListeners()
    this.state.updateGameState(this.game.start())
    this.setInterval()
  }

  restart = () => {
    this.create()
    this.start()
  } 

  stop = (state: GameStateExtended) => {
    this.clearInterval()
    this.view.removeListeners()
    this.render(state)
  }

  handlePaused = (state: GameStateExtended): void => {
    this.clearInterval()
    this.render(state)
  }

  handleResumed = (state: GameStateExtended): void => {
    this.setInterval()
    this.render(state)
  }

  render = (state: GameStateExtended): void => {
    this.view.render(state)
  }

  tick = () => {
    this.state.updateGameState(this.game.tick())
  }

  setInterval(): void {
    this.interval = setInterval(this.tick, this.step)
  }

  clearInterval(): void {
    this.interval && clearInterval(this.interval)
    this.interval = null
  }
}
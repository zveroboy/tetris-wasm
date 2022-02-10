import { Tetris } from "./tetris"
import { GameStateExtended, Presenter, View } from "./types"

export class GamePresenter implements Presenter {
  private interval: number | null = null
  private _view?: View
  private _state?: GameStateExtended

  constructor(    
    private game: Tetris,
    private step: number
  ) {
    
  }

  get view(): View | undefined {
    return this._view
  }
  
  set view(value: View | undefined) {
    this._view && (this._view.presenter = undefined)
    this._view = value
    this._view && (this._view.presenter = this)
  }

  get state(){
    return this._state
  }
  
  set state(value: GameStateExtended | undefined) {
    if(this._state){
      this._state.subscribe('next', this.render)
      this._state.subscribe('paused', this.handlePaused)
      this._state.subscribe('resumed', this.handleResumed)
      this._state.subscribe('over', this.stop)
    }
    this._state = value
    value?.subscribe('next', this.render)
    value?.subscribe('paused', this.handlePaused)
    value?.subscribe('resumed', this.handleResumed)
    value?.subscribe('over', this.stop)
  }

  load(): void {
    return this.game.load()
  }

  rotate(){
    this.state?.updateGameState(this.game.rotate())
  }

  moveLeft(){
    this.state?.updateGameState(this.game.moveLeft())
  }

  moveRight(){
    this.state?.updateGameState(this.game.moveRight())
  }

  moveDown(){
    this.state?.updateGameState(this.game.moveDown())
  }

  create(){
    this.state?.updateGameState(this.game.create())
  }

  pause(){
    this.state?.updatePaused(true)
  }

  resume(){
    this.state?.updatePaused(false)
  }

  start() {
    this.view?.addListeners()
    this.state?.updateGameState(this.game.start())
    this.setInterval()
  }

  restart() {
    this.create()
    this.start()
  } 

  stop = (state: GameStateExtended) => {
    this.clearInterval()
    this.view?.removeListeners()
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
    this.view?.render(state)
  }

  tick = () => {
    this.state?.updateGameState(this.game.tick())
  }

  setInterval(): void {
    this.interval = setInterval(this.tick, this.step)
  }

  clearInterval(): void {
    this.interval && clearInterval(this.interval)
    this.interval = null
  }
}

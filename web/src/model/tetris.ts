import init, {Game} from "tetris-wasm"
import EventEmitter from 'eventemitter3';
import {ConcrecetGameStateExtended, GameStateExtended} from './state'

export interface Tetris extends EventEmitter {
  load(): void

  create(): void

  start(): void
  tick(): void
  
  resume(): void
  pause(): void

  rotate(): void
  moveLeft(): void
  moveRight(): void
  moveDown(): void
}


export class ContcreteTetris extends EventEmitter implements Tetris {
  private game!: Game
  private _state!: GameStateExtended

  constructor() {
    super()
  }

  get state(): GameStateExtended {
    return this._state
  }
  
  set state(newState: GameStateExtended) {
    const oldState = this._state
    this._state = newState
    this.emit('changed', oldState, this._state)
  }

  load = init

  create(){
    this.game = Game.new()
    this._state = new ConcrecetGameStateExtended(this.game.to_js())
    this.state = this._state // initial emit
  }

  tick = () => {
    this.state = this.state.updateGameState(this.game.tick())
  }

  rotate = () => {
    this.state = this.state.updateGameState(this.game.rotate())
  }
  
  moveLeft = () => {
    this.state = this.state.updateGameState(this.game.move_left())
  }
  
  moveRight = () => {
    this.state = this.state.updateGameState(this.game.move_right())
  }
  
  moveDown = () => {
    this.state = this.state.updateGameState(this.game.move_down())
  }

  start = () => {
    this.state = this.state.updateGameState(this.game.start())
  }

  resume = () =>{
    this.state = this.state.updatePaused(false)
  }
  
  pause = () => {
    this.state = this.state.updatePaused(true)
  }
}

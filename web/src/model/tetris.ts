import init, {Game} from "tetris-wasm"
import { GameState } from "./types"

export interface Tetris {
  load(): void

  create(): GameState

  start(): GameState
  tick(): GameState

  rotate(): GameState
  moveLeft(): GameState
  moveRight(): GameState
  moveDown(): GameState
}


export class ContcreteTetris implements Tetris {
  private game!: Game

  load = init

  create(){
    this.game = Game.new()
    return this.game.to_js()
  }

  start = (): GameState => {
    return this.game.start()
  }

  tick = (): GameState => {
    return this.game.tick()
  }

  rotate = (): GameState => {
    return this.game.rotate()
  }
  
  moveLeft = (): GameState => {
    return this.game.move_left()
  }
  
  moveRight = (): GameState => {
    return this.game.move_right()
  }
  
  moveDown = (): GameState => {
    return this.game.move_down()
  }
}

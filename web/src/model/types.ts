import { BoardCell, GameStatus } from "./enums";

export interface GameState {
  blocks: BoardCell[][],
  status: GameStatus
}

export type GameEventTypes = 'next' | 'paused' | 'resumed' | 'over'

export interface GameStateExtended extends GameState {
  paused: boolean
  subscribe(type: GameEventTypes, fn: (...args: any)=>void): void
  unsubscribe(type: GameEventTypes, fn: (...args: any)=>void): void
  updateGameState(state: GameState): void
  updatePaused(paused: boolean): void
  traverse(): Generator<[number, number]>
}

export interface Presenter {
  start(): void
  restart(): void
  
  resume(): void
  pause(): void

  rotate(): void
  moveLeft(): void
  moveRight(): void
  moveDown(): void
}

export interface Component {
  view?: View
  render(state: GameStateExtended): void
}

export interface View {
  presenter?: Presenter 
  render(state: GameStateExtended): void
  addComponent(component: Component): void
  addListeners(): void
  removeListeners(): void
  start(): void
  pause(): void
  resume(): void
  restart(): void
}

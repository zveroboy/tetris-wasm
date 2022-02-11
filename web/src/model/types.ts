import type EventEmitter from "eventemitter3";
import { BoardCell, GameStatus } from "./enums";

export interface GameState {
  blocks: BoardCell[][],
  status: GameStatus
}

export type GameEventTypes = 'next' | 'paused' | 'resumed' | 'over'

type GameEmitter = Pick<EventEmitter<GameEventTypes>, 'on' | 'off'>

export interface GameStateExtended extends GameState, GameEmitter {
  paused: boolean
  updateGameState(state: GameState): void
  updatePaused(paused: boolean): void
  blocksIndexes(): Generator<[number, number]>
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
  view: View
  render(state: GameStateExtended): void
}

export type ViewEventTypes = 'rotate' | 'moveLeft' | 'moveRight' | 'moveDown' | 'start' | 'pause' | 'resume' | 'restart'

type ViewEmitter = Pick<EventEmitter<ViewEventTypes>, 'on' | 'off'>

export interface View extends ViewEmitter {
  render(state: GameStateExtended): void
  addComponent(component: Component): void
  addListeners(): void
  removeListeners(): void
  start(): void
  pause(): void
  resume(): void
  restart(): void
}

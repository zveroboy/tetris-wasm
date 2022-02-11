import EventEmitter from 'eventemitter3';
import { BoardCell, GameStatus } from './enums';
import { GameEventTypes, GameState, GameStateExtended } from './types';

export class ConcrecetGameStateExtended implements GameStateExtended {
  paused = false
  blocks: BoardCell[][] = []
  status: GameStatus = GameStatus.Pending
  emitter = new EventEmitter<GameEventTypes>()

  on = this.emitter.on.bind(this.emitter)

  off = this.emitter.off.bind(this.emitter)

  updateGameState(state: GameState) {
    const isOver = this.status !== GameStatus.Over && state.status === GameStatus.Over
    Object.assign(this, state)
    if(isOver){
      this.emitter.emit('over', this)
      return
    }
    this.emitter.emit('next', this)
  }
  
  updatePaused(paused: boolean) {
    this.paused = paused
    this.emitter.emit(paused ? 'paused' : 'resumed', this)
  }

  subscribe(type: GameEventTypes, fn: (...args: any)=>void){
    this.emitter.on(type, fn)
  }

  unsubscribe(type: GameEventTypes, fn: (...args: any)=>void){
    this.emitter.off(type, fn)
  }

  *blocksIndexes(): Generator<[number, number]> {
    for (const r in this.blocks) {
      for (const c in this.blocks[r]) {
        yield [+r, +c]
      }
    }
  }
}
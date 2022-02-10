export enum GameStatus {
  Pending = 0,
  InProgress = 1,
  Over = 2
}

export enum BoardCell {
  Empty = 0,
  Filled = 1
}

export interface GameState {
  blocks: BoardCell[][],
  status: GameStatus
}

export interface GameStateExtended extends GameState {
  paused: boolean
  traverse(): Generator<[number, number]>
  updateGameState(state: GameState): ConcrecetGameStateExtended
  updatePaused(paused: boolean): ConcrecetGameStateExtended
}

export class ConcrecetGameStateExtended implements GameStateExtended {
  paused = false
  blocks: BoardCell[][] = []
  status!: GameStatus

  constructor(state: GameState){
    Object.assign(this, state);
  }
  
  updateGameState(state: GameState): ConcrecetGameStateExtended {
    return this.patch(state)
  }
  
  updatePaused(paused: boolean): ConcrecetGameStateExtended {
    return this.patch({paused})
  }
  
  patch(patch: Partial<ConcrecetGameStateExtended>): ConcrecetGameStateExtended{
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this, patch)
  }

  *traverse(): Generator<[number, number]> {
    for (const r in this.blocks) {
      for (const c in this.blocks[r]) {
        yield [+r, +c]
      }
    }
  }
}
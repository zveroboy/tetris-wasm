import invariant from 'invariant';
import EventEmitter from 'eventemitter3';
import { Cell } from "./drawable";
import { BoardCell, GameStateExtended, GameStatus } from "./state";
import { assertHtmlElement } from './error';

export interface Renderer extends EventEmitter {
  render(state: GameStateExtended): void
}

export class CanvasRenderer extends EventEmitter implements Renderer {
  protected ctx: CanvasRenderingContext2D
  constructor(root: HTMLCanvasElement){
    super()
    const context = root.getContext('2d')
    invariant(context, 'Context is null');
    this.ctx = context
  }

  render(state: GameStateExtended): void {
    const gap = 1
    
    const {height, width} = this.ctx.canvas;

    const cellHeight = Math.floor(height / state.blocks.length)
    const cellWidth = Math.floor(width / state.blocks[0].length)

    this.ctx.clearRect(0, 0, width, height)

    new Cell(this.ctx, '#FFFFFF').draw({
      x: 0,
      y: 0,
      w: width,
      h: height,
    })
    for (const [r, c] of state.traverse()) {
      if(state.blocks[r][c] === BoardCell.Empty){
        continue;
      }

      new Cell(this.ctx, '#003e88').draw({
        x: c * cellWidth + gap,
        y: r * cellHeight + gap,
        w: cellWidth - 2 * gap,
        h: cellHeight - 2 * gap,
      })
    }
  }
}

export class CanvasOverlayRenderer extends EventEmitter implements Renderer {
  constructor(
    private root: HTMLDivElement
  ){
    super();
  }

  render(state: GameStateExtended){
    if (state.status === GameStatus.Pending) {
      this.root.dataset.text = 'Press "Start"'
    } else if (state.status === GameStatus.Over) {
      this.root.dataset.text = 'Game over'
    } else if (state.paused) {
      this.root.dataset.text = 'Game paused'
    } else {
      delete this.root.dataset.text
    }
  }
}

export class ControlsRenderer extends EventEmitter implements Renderer {
  private $start!: HTMLButtonElement
  private $pause!: HTMLButtonElement
  private $resume!: HTMLButtonElement
  private $restart!: HTMLButtonElement
  constructor(
    private root: HTMLElement
  ){
    super();
    const $start = this.root.querySelector<HTMLButtonElement>('[data-type="start"]')
    const $pause = this.root.querySelector<HTMLButtonElement>('[data-type="pause"]')
    const $resume = this.root.querySelector<HTMLButtonElement>('[data-type="resume"]')
    const $restart = this.root.querySelector<HTMLButtonElement>('[data-type="restart"]')

    assertHtmlElement($start, 'start')
    assertHtmlElement($pause, 'pause')
    assertHtmlElement($resume, 'resume')
    assertHtmlElement($restart, 'restart')

    this.$start = $start
    this.$pause = $pause
    this.$resume = $resume
    this.$restart = $restart

    this.addListeners()
  }

  addListeners(){
    this.$start.addEventListener('click', ()=> this.emit('start'))
    this.$pause.addEventListener('click', ()=> this.emit('pause'))
    this.$resume.addEventListener('click', ()=> this.emit('resume'))
    this.$restart.addEventListener('click', ()=> this.emit('restart'))
  }

  render(state: GameStateExtended){
    this.$start.hidden = state.status !== GameStatus.Pending
    this.$pause.hidden = state.status !== GameStatus.InProgress || state.paused
    this.$resume.hidden = state.status !== GameStatus.InProgress || !state.paused
    this.$restart.hidden = state.status !== GameStatus.Over
  }
}
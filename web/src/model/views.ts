import invariant from 'invariant';
import EventEmitter from 'eventemitter3';

import { Cell } from "./drawable";
import { assertHtmlElement } from './errors';
import type { Component, GameStateExtended, View, ViewEventTypes } from './types';
import { BoardCell, GameStatus } from './enums';

const KEY_2_EVENT: Record<string, ViewEventTypes> = Object.freeze({
  ArrowUp: 'rotate',
  ArrowLeft: 'moveLeft',
  ArrowRight: 'moveRight',
  ArrowDown: 'moveDown',
})

export class GameView implements View {
  private components: Component[] = []
  private emitter = new EventEmitter<ViewEventTypes>()

  constructor(private root: Document){}

  on = this.emitter.on.bind(this.emitter)

  off = this.emitter.off.bind(this.emitter)

  render(state: GameStateExtended) {
    this.components.forEach((c) => c.render(state))
  }

  addComponent(component: Component): void {
    this.components.push(component)
  }

  addListeners() {
    this.root.addEventListener('keydown', this.keyListener)
  }

  removeListeners() {
    this.root.removeEventListener('keydown', this.keyListener)
  }

  keyListener = ({ code }: KeyboardEvent) => {
    code in KEY_2_EVENT && this.emitter.emit(KEY_2_EVENT[code])
  }

  start = () => this.emitter.emit('start')
  
  pause = () => this.emitter.emit('pause')
  
  resume = () => this.emitter.emit('resume')

  restart = () => this.emitter.emit('restart')
}

export class CanvasRenderer implements Component {
  private ctx: CanvasRenderingContext2D
  constructor(
    public view: View,
    root: HTMLCanvasElement
  ){
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
    for (const [r, c] of state.blocksIndexes()) {
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

export class CanvasOverlayRenderer implements Component {
  constructor(
    public view: View,
    private root: HTMLDivElement
  ){
  }

  render(state: GameStateExtended){
    if (state.status === GameStatus.Pending) {
      this.root.dataset.text = `
    Press "Start".
  Use arrow keys
    to move and rotate the figure.`
    } else if (state.status === GameStatus.Over) {
      this.root.dataset.text = 'Game over'
    } else if (state.paused) {
      this.root.dataset.text = 'Game paused'
    } else {
      delete this.root.dataset.text
    }
  }
}

export class ControlsRenderer implements Component {
  private $start!: HTMLButtonElement
  private $pause!: HTMLButtonElement
  private $resume!: HTMLButtonElement
  private $restart!: HTMLButtonElement
  constructor(
    public view: View,
    private root: HTMLElement
  ){
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
    if(!this.view) return
    this.$start.addEventListener('click', this.view.start)
    this.$pause.addEventListener('click', this.view.pause)
    this.$resume.addEventListener('click', this.view.resume)
    this.$restart.addEventListener('click', this.view.restart)
  }

  removeListeners(){
    if(!this.view) return
    this.$start.removeEventListener('click', this.view.start)
    this.$pause.removeEventListener('click', this.view.pause)
    this.$resume.removeEventListener('click', this.view.resume)
    this.$restart.removeEventListener('click', this.view.restart)
  }

  render(state: GameStateExtended){
    this.$start.hidden = state.status !== GameStatus.Pending
    this.$pause.hidden = state.status !== GameStatus.InProgress || state.paused
    this.$resume.hidden = state.status !== GameStatus.InProgress || !state.paused
    this.$restart.hidden = state.status !== GameStatus.Over
  }
}
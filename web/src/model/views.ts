import invariant from 'invariant';
import EventEmitter from 'eventemitter3';
import { Cell } from "./drawable";
// import { BoardCell, GameStateExtended, GameStatus } from "./state";
import { assertHtmlElement } from './errors';
import type { Component, GameStateExtended, Presenter, View } from './types';
import { BoardCell, GameStatus } from './enums';


export class GameView implements View {
  private _presenter?: Presenter
  private components: Component[] = []

  get presenter(): Presenter | undefined {
    return this._presenter
  }

  set presenter(value: Presenter | undefined) {
    this._presenter = value
  }
  
  render(state: GameStateExtended) {
    this.components.forEach((c) => c.render(state))
  }

  addComponent(component: Component): void {
    component.view = this
    this.components.push(component)
  }

  addListeners() {
    document.addEventListener('keydown', this.keyListener)
  }

  removeListeners() {
    document.removeEventListener('keydown', this.keyListener)
  }

  keyListener = ({ code }: KeyboardEvent) => {
    if (code === 'ArrowUp') {
      this.presenter?.rotate()
    } else if (code === 'ArrowLeft') {
      this.presenter?.moveLeft()
    } else if (code === 'ArrowRight') {
      this.presenter?.moveRight()
    } else if (code === 'ArrowDown') {
      this.presenter?.moveDown()
    }
  }

  start = () => {
    this.presenter?.start()
  }
  
  pause = () => {
    this.presenter?.pause()
  }
  
  resume = () => {
    this.presenter?.resume()
  }

  restart = () => {
    this.presenter?.restart()
  }
}

export class CanvasRenderer implements Component {
  protected ctx: CanvasRenderingContext2D
  constructor(root: HTMLCanvasElement){
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

export class CanvasOverlayRenderer extends EventEmitter implements Component {
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

export class ControlsRenderer implements Component {
  private _view?: View
  private $start!: HTMLButtonElement
  private $pause!: HTMLButtonElement
  private $resume!: HTMLButtonElement
  private $restart!: HTMLButtonElement
  constructor(
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
  }

  get view(){
    return this._view
  }
  
  set view(value: View | undefined) {
    this.removeListeners();
    this._view = value
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
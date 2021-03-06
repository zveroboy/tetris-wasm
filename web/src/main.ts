import { assertHtmlElement } from './model/errors';
import { GamePresenter as GamePresenter } from './model/game';
import { CanvasOverlayRenderer, CanvasRenderer, ControlsRenderer, GameView } from "./model/views";
import { ContcreteTetris } from "./model/tetris";
import { ConcrecetGameStateExtended } from './model/state';

export const BOARD_SIZE = Object.freeze({ x: 10, y: 18 })
const usize = 24
const width = usize * BOARD_SIZE.x
const height = usize * BOARD_SIZE.y

async function main() {
  try {
    const $app = document.querySelector<HTMLDivElement>('#app')
    const $container = $app?.querySelector<HTMLDivElement>('#container')
    const $controls = $app?.querySelector<HTMLDivElement>('#controls')
    const $canvasOverlay = $app?.querySelector<HTMLDivElement>('#canvas-overlay')
    const $canvas = $app?.querySelector<HTMLCanvasElement>('#canvas')
  
    assertHtmlElement($container, 'container')
    assertHtmlElement($controls, 'controls')
    assertHtmlElement($canvasOverlay, 'canvas-overlay')
    assertHtmlElement($canvas, 'canvas')
  
    $canvas.width = width * 2
    $canvas.height = height * 2
    $canvas.style.setProperty('--ratio', (BOARD_SIZE.x / BOARD_SIZE.y).toString())
    
    const tetris = new ContcreteTetris()
    
    const state = new ConcrecetGameStateExtended();

    const view = new GameView(document);
    
    view.addComponent(new CanvasRenderer(view, $canvas))
    view.addComponent(new CanvasOverlayRenderer(view, $canvasOverlay))
    view.addComponent(new ControlsRenderer(view, $controls))
    
    const presenter = new GamePresenter(state, view, tetris, 1000)
    
    await presenter.load()
    presenter.create()
  } catch (e){
    console.error(e)
  }
}
main();
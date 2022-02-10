import { assertHtmlElement } from './model/error';
import { GameService } from './model/game';
import { CanvasOverlayRenderer, CanvasRenderer, ControlsRenderer } from "./model/renderer";
import { ContcreteTetris } from "./model/tetris";

export const BOARD_SIZE = Object.freeze({ x: 10, y: 18 })
const usize = 24
const width = usize * BOARD_SIZE.x
const height = usize * BOARD_SIZE.y


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
  const service = new GameService(
    tetris, 
    [
      new CanvasRenderer($canvas), 
      new CanvasOverlayRenderer($canvasOverlay), 
      new ControlsRenderer($controls)], 
    1000
  )
  await service.load()
  service.create()
} catch (e){
  console.error(e)
}
import { Tetris } from "./tetris";
// @ts-ignore

// import init, {greet} from "./tetris_wasm.js";
// import {TEST} from "tetris-wasm/index.js";
// import init, {Game} from "tetris-wasm/tetris_wasm.js";
// import init from "tetris-wasm/tetris_wasm_bg.wasm";

// @ts-ignore
// await init();
// await init(new URL('./../node_modules/tetris-wasm/tetris_wasm_bg.wasm', import.meta.url));

// console.log(wasm)

// console.log({TEST})
// // @ts-ignore
// wasm().then((exports) => {
//   console.log(exports)
//   // exports.test()
// })

export const BOARD_SIZE = Object.freeze({ x: 10, y: 18 })
const usize = 12
const width = usize * BOARD_SIZE.x
const height = usize * BOARD_SIZE.y

const canvas = document.createElement('canvas')
canvas.width = width
canvas.height = height
canvas.style.width = `${width * 2}px`
canvas.style.height = `${height * 2}px`
document.body.append(canvas)
try {
  const context = canvas.getContext('2d')
  if (!context) {
      throw new Error('Context is null')
  }

  const tetrix = new Tetris(context)
  await tetrix.init()
  tetrix.addListeners()
  // tetrix.start(1000)
}catch{

}
// const game = Game.new()
// console.log({game})
// console.log('game.move_left', game.move_left())


// <canvas
//         ref={ref}
//         width={width}
//         height={height}
//         style={{
//           width: `${width * 2}px`,
//           height: `${height * 2}px`,
//         }}
//       ></canvas>

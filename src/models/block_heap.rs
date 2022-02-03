use crate::models::board::{BoardCell, BOARD_HEIGHT, BOARD_WIDTH};
use crate::models::matrix::Matrix;

#[derive(Debug)]
pub struct BlockHeap([[BoardCell; BOARD_WIDTH]; BOARD_HEIGHT]);
//  {
//     pub matrix: [[BoardCell; BOARD_WIDTH]; BOARD_HEIGHT],
// }

impl BlockHeap {
    pub fn new() -> Self {
        BlockHeap([[BoardCell::Empty; BOARD_WIDTH]; BOARD_HEIGHT])
    }
}

use serde::Serialize;
use serde_repr::Serialize_repr;
use std::ops::{BitAnd, BitOr};

pub type BoardMatrix = [[BoardCell; BOARD_WIDTH]; BOARD_HEIGHT];

pub const BOARD_WIDTH: usize = 10;
pub const BOARD_HEIGHT: usize = 18;

#[derive(Serialize_repr, Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum BoardCell {
    Empty = 0,
    Filled = 1,
}

impl From<u8> for BoardCell {
    fn from(i: u8) -> Self {
        match i {
            0 => BoardCell::Empty,
            1 => BoardCell::Filled,
            _ => panic!("unknown index {:?}", i),
        }
    }
}

impl BitAnd for BoardCell {
    type Output = Self;

    fn bitand(self, rhs: Self) -> Self::Output {
        BoardCell::from(self as u8 & rhs as u8)
    }
}

impl BitOr for BoardCell {
    type Output = Self;

    fn bitor(self, rhs: Self) -> Self::Output {
        BoardCell::from(self as u8 | rhs as u8)
    }
}

#[derive(Serialize, Debug, PartialEq, Eq)]
pub struct Board(BoardMatrix);
//  {
//     pub matrix: [[BoardCell; BOARD_WIDTH]; BOARD_HEIGHT],
// }

impl Board {
    pub fn empty() -> BoardMatrix {
        [[BoardCell::Empty; BOARD_WIDTH]; BOARD_HEIGHT]
    }

    pub fn new() -> Self {
        Board(Board::empty())
    }

    pub fn iter(&self) -> impl Iterator<Item = &[BoardCell; BOARD_WIDTH]> {
        self.0.iter()
    }

    pub fn merge_with(&self, b2: &Board) -> Board {
        Board::merge(self, b2)
    }

    pub fn check_intersects_with(&self, b2: &Board) -> bool {
        Board::intersection(self, b2)
    }

    // pub fn f(&mut self) -> Board {
    //     let mut result = Board::empty();

    //     // for (r, row) in self.0.iter().enumerate() {
    //     //     if row.iter().all(|&c| c == BoardCell::Filled) {
    //     //         self.0 =
    //     //     }
    //     // }
    // }

    pub fn remove_line(&mut self, i: usize) {
        let first = self.0[0..i].to_vec();
        let second = self.0[i + 1..].to_vec();
        let concat = [vec![[BoardCell::Empty; BOARD_WIDTH]], first, second].concat();
        *self = Board::from(&concat)
    }

    pub fn merge(b1: &Board, b2: &Board) -> Board {
        let mut result = Board::new();

        for (r, row) in result.0.iter_mut().enumerate() {
            for (c, cell) in row.iter_mut().enumerate() {
                *cell = b1.0[r][c] | b2.0[r][c]
            }
        }

        result
    }

    pub fn intersection(b1: &Board, b2: &Board) -> bool {
        for (r, row) in b1.0.iter().enumerate() {
            for (c, _) in row.iter().enumerate() {
                if b1.0[r][c] & b2.0[r][c] == BoardCell::Filled {
                    return true;
                }
            }
        }

        false
    }
}

impl From<BoardMatrix> for Board {
    fn from(m: BoardMatrix) -> Self {
        Board(m)
    }
}

impl From<&Vec<[BoardCell; BOARD_WIDTH]>> for Board {
    fn from(m: &Vec<[BoardCell; BOARD_WIDTH]>) -> Self {
        let mut result = Board::empty();

        for (r, row) in result.iter_mut().enumerate() {
            *row = *m.get(r).unwrap_or(row)
        }

        Board(result)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn check_board_merge() {
        let mut b1 = Board::new();
        let mut b2 = Board::new();

        b1.0[0][0] = BoardCell::Filled;
        b2.0[0][1] = BoardCell::Filled;

        let mut compare = Board::new();
        compare.0[0][0] = BoardCell::Filled;
        compare.0[0][1] = BoardCell::Filled;

        assert_eq!(Board::merge(&b1, &b2), compare);
    }

    #[test]
    fn check_board_don_t_intersect() {
        let mut b1 = Board::new();
        let mut b2 = Board::new();

        b1.0[0][0] = BoardCell::Filled;
        b2.0[0][1] = BoardCell::Filled;

        assert!(!Board::intersection(&b1, &b2));
    }

    #[test]
    fn check_board_intersect() {
        let mut b1 = Board::new();
        let mut b2 = Board::new();

        b1.0[0][0] = BoardCell::Filled;
        b2.0[0][0] = BoardCell::Filled;

        assert!(Board::intersection(&b1, &b2));
    }

    #[test]
    fn check_remove_line() {
        let mut b1 = Board::new();

        b1.0[1] = [BoardCell::Filled; BOARD_WIDTH];
        b1.remove_line(1);

        assert_eq!(b1, Board::new());
    }
}

use crate::models::board::BoardCell;
use crate::models::dir::{HDir, VDir};
use crate::models::matrix::{Matrix, MatrixBody};
use rand::seq::SliceRandom;
use std::fmt::Debug;

// use super::matrix::MatrixBody;

static SHAPES: [&'static [&'static [BoardCell]]; 7] = [
    // [0, 1, 0],
    // [1, 1, 1],
    // [0, 0, 0],
    &[
        &[BoardCell::Empty, BoardCell::Filled, BoardCell::Empty],
        &[BoardCell::Filled, BoardCell::Filled, BoardCell::Filled],
        &[BoardCell::Empty, BoardCell::Empty, BoardCell::Empty],
    ],
    // [0, 0, 0, 0],
    // [1, 1, 1, 1],
    // [0, 0, 0, 0],
    // [0, 0, 0, 0],
    &[
        &[
            BoardCell::Empty,
            BoardCell::Empty,
            BoardCell::Empty,
            BoardCell::Empty,
        ],
        &[
            BoardCell::Filled,
            BoardCell::Filled,
            BoardCell::Filled,
            BoardCell::Filled,
        ],
        &[
            BoardCell::Empty,
            BoardCell::Empty,
            BoardCell::Empty,
            BoardCell::Empty,
        ],
        &[
            BoardCell::Empty,
            BoardCell::Empty,
            BoardCell::Empty,
            BoardCell::Empty,
        ],
    ],
    // [1, 1],
    // [1, 1],
    &[
        &[BoardCell::Filled, BoardCell::Filled],
        &[BoardCell::Filled, BoardCell::Filled],
    ],
    // [1, 1, 0],
    // [0, 1, 1],
    // [0, 0, 0],
    &[
        &[BoardCell::Filled, BoardCell::Filled, BoardCell::Empty],
        &[BoardCell::Empty, BoardCell::Filled, BoardCell::Filled],
        &[BoardCell::Empty, BoardCell::Empty, BoardCell::Empty],
    ],
    // [0, 1, 1],
    // [1, 1, 0],
    // [0, 0, 0],
    &[
        &[BoardCell::Empty, BoardCell::Filled, BoardCell::Filled],
        &[BoardCell::Filled, BoardCell::Filled, BoardCell::Empty],
        &[BoardCell::Empty, BoardCell::Empty, BoardCell::Empty],
    ],
    // [1, 0, 0],
    // [1, 1, 1],
    // [0, 0, 0],
    &[
        &[BoardCell::Filled, BoardCell::Empty, BoardCell::Empty],
        &[BoardCell::Filled, BoardCell::Filled, BoardCell::Filled],
        &[BoardCell::Empty, BoardCell::Empty, BoardCell::Empty],
    ],
    // [0, 0, 1],
    // [1, 1, 1],
    // [0, 0, 0],
    &[
        &[BoardCell::Empty, BoardCell::Empty, BoardCell::Filled],
        &[BoardCell::Filled, BoardCell::Filled, BoardCell::Filled],
        &[BoardCell::Empty, BoardCell::Empty, BoardCell::Empty],
    ],
];

// pub enum ShapeNames {
//     Shape1,
//     Shape2,
//     // Shape3,
//     // Shape4,
//     // Shape5,
//     // Shape6,
//     // Shape7,
// }

// type RectMatrix<const ROWS: usize, const COLS: usize> = [[u8; COLS]; ROWS];
// type SquareMatrix<const SIZE: usize> = RectMatrix<SIZE, SIZE>;

pub trait Transform {
    fn move_x(&mut self, dx: i8);
    fn move_y(&mut self, dy: i8);
    fn rotate(&mut self, v_dir: VDir, h_dir: HDir);
}

#[derive(Debug)]
pub struct Shape {
    pub x: i8,
    pub y: i8,
    pub matrix: Matrix,
}

impl Shape {
    pub fn get_named(name: &str) -> &[&[BoardCell]] {
        match name {
            "shape0" => SHAPES[0],
            "shape1" => SHAPES[1],
            "shape2" => SHAPES[2],
            "shape3" => SHAPES[3],
            "shape4" => SHAPES[4],
            "shape5" => SHAPES[5],
            "shape6" => SHAPES[6],
            _ => panic!("Unknown shape"),
        }
    }

    pub fn clone(matrix: &[&[BoardCell]]) -> MatrixBody {
        matrix.iter().map(|arr| arr.to_vec()).collect()
    }

    pub fn new(shape: MatrixBody) -> Self {
        let x = 3;
        let y = 0;
        Shape {
            x,
            y,
            matrix: Matrix::new(shape),
        }
    }

    pub fn random() -> Self {
        let shape = Shape::clone(SHAPES.choose(&mut rand::thread_rng()).unwrap());

        Shape::new(shape)
    }
}

impl Transform for Shape {
    fn move_x(&mut self, dx: i8) {
        self.x += dx;
    }

    fn move_y(&mut self, dy: i8) {
        self.y += dy;
    }

    fn rotate(&mut self, v_dir: VDir, h_dir: HDir) {
        self.matrix = self.matrix.rotate(v_dir, h_dir)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // Before:
    // [0, 1, 0],
    // [1, 1, 1],
    // [0, 0, 0],

    // After:
    // [0, 1, 0],
    // [0, 1, 1],
    // [0, 1, 0],
    #[test]
    #[ignore]
    fn rotation_bottom_left_works() {
        let mut sh = Shape::new(Shape::clone(Shape::get_named("shape0")));
        sh.rotate(VDir::Bottom, HDir::Left);
        assert_eq!(
            *sh.matrix.body(),
            vec![
                vec![BoardCell::Empty, BoardCell::Filled, BoardCell::Empty],
                vec![BoardCell::Empty, BoardCell::Filled, BoardCell::Filled],
                vec![BoardCell::Empty, BoardCell::Filled, BoardCell::Empty],
            ]
        );
    }

    // Before:
    // [0, 1, 0],
    // [0, 1, 1],
    // [0, 1, 0],

    // After:
    // [0, 1, 0],
    // [1, 1, 1],
    // [0, 0, 0],
    #[test]
    #[ignore]
    fn rotation_top_right_works() {
        let mut sh = Shape::new(Shape::clone(Shape::get_named("shape0")));
        let body = sh.matrix.body().clone();
        sh.rotate(VDir::Bottom, HDir::Left);
        sh.rotate(VDir::Top, HDir::Right);
        assert_eq!(*sh.matrix.body(), body);
    }

    #[test]
    fn slice_works() {
        let mut sh = Shape::new(Shape::clone(Shape::get_named("shape0")));
        let (height, width) = sh.matrix.size();

        let slice = sh.matrix.slice((0, 0), (1, width));
        assert_eq!(
            slice,
            vec![[BoardCell::Empty, BoardCell::Filled, BoardCell::Empty]]
        );

        sh.rotate(VDir::Bottom, HDir::Left);
        let slice = sh.matrix.slice((0, 0), (height, 1));

        assert_eq!(
            slice,
            vec![
                vec![BoardCell::Empty],
                vec![BoardCell::Empty],
                vec![BoardCell::Empty]
            ]
        );

        let slice = sh.matrix.slice((0, width - 1), (height, width));
        assert_eq!(
            slice,
            vec![
                vec![BoardCell::Empty],
                vec![BoardCell::Filled],
                vec![BoardCell::Empty]
            ]
        );

        sh.rotate(VDir::Top, HDir::Right);
        sh.rotate(VDir::Top, HDir::Right);
        let slice = sh.matrix.slice((0, width - 1), (height, width));
        assert_eq!(
            slice,
            vec![
                vec![BoardCell::Empty],
                vec![BoardCell::Empty],
                vec![BoardCell::Empty]
            ]
        );
    }
}

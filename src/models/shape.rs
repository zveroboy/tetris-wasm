use std::fmt::Debug;
use crate::models::dir::{VDir, HDir};
use crate::models::matrix::Matrix;

pub enum ShapeNames {
    Shape1,
    Shape2,
    // Shape3,
    // Shape4,
    // Shape5,
    // Shape6,
    // Shape7,
}

// type RectMatrix<const ROWS: usize, const COLS: usize> = [[u8; COLS]; ROWS];
// type SquareMatrix<const SIZE: usize> = RectMatrix<SIZE, SIZE>;

trait Transform {
    fn move_x(&mut self, dx: i8);
    fn move_y(&mut self, dy: i8);
    fn rotate(&mut self, v_dir: VDir, h_dir: HDir);
}

#[derive(Debug)]
// struct Shape<'a> {
struct Shape {
    x: i8,
    y: i8,
    matrix: Matrix,
    // _matrix: &'a [&'a [u8]]
}

// impl Shape<'_> {
impl Shape {
    fn new(target: ShapeNames) -> Self {
        let x = 3;
        let y = 0;
        match target {
            // [0, 1, 0],
            // [1, 1, 1],
            // [0, 0, 0],
            ShapeNames::Shape1 => {
                Shape {
                    x,
                    y,
                    matrix: Matrix::new(vec![vec![0, 1, 0], vec![1, 1, 1], vec![0, 0, 0]]),
                    // _matrix: &[&[0, 0, 0]]
                }
            },
            // [0, 0, 0, 0],
            // [1, 1, 1, 1],
            // [0, 0, 0, 0],
            // [0, 0, 0, 0],
            ShapeNames::Shape2 => Shape {
                x,
                y,
                matrix: Matrix::new(vec![
                    vec![0, 0, 0, 0],
                    vec![1, 1, 1, 1],
                    vec![0, 0, 0, 0],
                    vec![0, 0, 0, 0],
                ]),
            },
        }
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
    fn rotation_bottom_left_works() {
        let mut sh = Shape::new(ShapeNames::Shape1);
        sh.rotate(VDir::Bottom, HDir::Left);
        assert_eq!(
            *sh.matrix.body(),
            vec![vec![0, 1, 0], vec![0, 1, 1], vec![0, 1, 0],]
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
    // #[test]
    fn rotation_top_right_works() {
        let mut sh = Shape::new(ShapeNames::Shape1);
        let body = sh.matrix.body().clone();
        sh.rotate(VDir::Bottom, HDir::Left);
        sh.rotate(VDir::Top, HDir::Right);
        assert_eq!(
            *sh.matrix.body(),
            body
        );
    }
}

use crate::models::board::BoardCell;
use crate::models::dir::{HDir, VDir};

pub type MatrixBody = Vec<Vec<BoardCell>>;
type Indexes = [usize; 4];

#[derive(Debug)]
pub struct Matrix {
    body: MatrixBody,
}

impl Matrix {
    pub fn new(body: MatrixBody) -> Self {
        Matrix { body }
    }

    pub fn rotate(&self, v_dir: VDir, h_dir: HDir) -> Self {
        let (height, width) = self.size();
        let v_range_vec = (0..height).collect::<Vec<_>>();
        let h_range_vec = (0..width).collect::<Vec<_>>();

        let read_backward = |mut acc: MatrixBody, [ri, mc, ci, mr]: Indexes| -> MatrixBody {
            acc[ri][ci] = self.body[mr][mc];
            acc
        };

        match (v_dir, h_dir) {
            (VDir::Bottom, HDir::Left) => {
                let body = Matrix::create_indexes(
                    h_range_vec,
                    v_range_vec.into_iter().rev().collect::<Vec<_>>(),
                )
                .into_iter()
                .fold(vec![vec![BoardCell::Empty; height]; width], read_backward);
                Matrix { body }
            }
            (VDir::Top, HDir::Right) => {
                let body = Matrix::create_indexes(
                    h_range_vec.into_iter().rev().collect::<Vec<_>>(),
                    v_range_vec,
                )
                .into_iter()
                .fold(vec![vec![BoardCell::Empty; height]; width], read_backward);
                Matrix { body }
            }
            _ => unimplemented!(),
        }
    }

    pub fn size(&self) -> (usize, usize) {
        (self.body.len(), self.body[0].len())
    }

    fn create_indexes(row_it: Vec<usize>, col_it: Vec<usize>) -> Vec<Indexes> {
        let mut result: Vec<Indexes> = vec![];
        for row_tup in row_it.into_iter().enumerate() {
            for col_tup in col_it.clone().into_iter().enumerate() {
                result.push([row_tup.0, row_tup.1, col_tup.0, col_tup.1]);
            }
        }

        result
    }

    pub fn body(&self) -> &MatrixBody {
        &self.body
    }

    pub fn slice(
        &self,
        (top, left): (usize, usize),
        (bottom, right): (usize, usize),
    ) -> MatrixBody {
        self.body[top..bottom]
            .into_iter()
            .map(|row| row[left..right].to_vec())
            .collect()
    }
}

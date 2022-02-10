use super::board::{Board, BoardCell, BOARD_HEIGHT, BOARD_WIDTH};
use super::dir::{HDir, VDir};
use super::matrix::MatrixBody;
use super::shape::{Shape, Transform};

#[derive(Debug)]
pub struct Scene {
    shape: Shape,
    block_heap: Board,
}

impl Scene {
    pub fn new() -> Self {
        let shape = Shape::random();
        let block_heap = Board::new();
        Scene { shape, block_heap }
    }

    pub fn get_merged(&self) -> Board {
        let board = self.place_figure_on_board();
        self.block_heap.merge_with(&board)
    }

    pub fn credit(&mut self) {
        self.merge();
        self.remove_filled_lines();
    }

    pub fn reset_figure(&mut self) {
        self.shape = Shape::random();
    }

    fn place_figure_on_board(&self) -> Board {
        let mut board_matrix = Board::empty();

        let Shape { x, y, matrix } = &self.shape;

        for (r, row) in matrix.body().iter().enumerate() {
            for (c, &cell) in row.iter().enumerate() {
                let rr = y + r as i8;
                if rr < 0 || rr >= BOARD_HEIGHT as i8 {
                    continue;
                }
                let rc = x + c as i8;
                if rc < 0 || rc >= BOARD_WIDTH as i8 {
                    continue;
                }

                board_matrix[rr as usize][rc as usize] = cell
            }
        }

        Board::from(board_matrix)
    }

    pub fn merge(&mut self) {
        let board = self.place_figure_on_board();
        self.block_heap = self.block_heap.merge_with(&board)
    }

    fn check_shape_crosses_h_borders(&self) -> bool {
        let Shape { x, y: _, matrix } = &self.shape;
        let (height, width) = matrix.size();

        let slice: MatrixBody = if *x < 0 {
            matrix.slice((0, 0), (height, -x as usize))
        } else if (BOARD_WIDTH as i8) < (width as i8) + x {
            let start_x = width + (*x as usize) - BOARD_WIDTH;

            matrix.slice((0, width - start_x), (height, width))
        } else {
            vec![]
        };

        !Scene::check_empty(&slice)
    }

    fn check_shape_crosses_v_borders(&self) -> bool {
        let Shape { x: _, y, matrix } = &self.shape;
        let (height, width) = matrix.size();

        let slice: MatrixBody = if (BOARD_HEIGHT as i8) < (height as i8) + y {
            let start_y = height + (*y as usize) - BOARD_HEIGHT;

            matrix.slice((height - start_y, 0), (height, width))
        } else {
            vec![]
        };

        !Scene::check_empty(&slice)
    }

    fn check_empty(body: &MatrixBody) -> bool {
        body.iter()
            .all(|r| r.iter().all(|&c| c == BoardCell::Empty))
    }

    pub fn check_shape_intersects_heap(&self) -> bool {
        let board = self.place_figure_on_board();
        self.block_heap.check_intersects_with(&board)
    }

    pub fn move_figure_x(&mut self, dx: i8) {
        self.shape.move_x(dx);
        if self.check_shape_crosses_h_borders() || self.check_shape_intersects_heap() {
            self.shape.move_x(-dx);
        }
    }

    // TODO: split for 2 functions. extract creation logic
    pub fn move_figure_y(&mut self, dy: i8) -> bool {
        self.shape.move_y(dy);
        if self.check_shape_crosses_v_borders() || self.check_shape_intersects_heap() {
            self.shape.move_y(-dy);
            return true
            // self.merge();
            // self.remove_filled_lines();
            // return self.reset_figure();
        }
        false
    }

    pub fn rotate_figure(&mut self) {
        self.shape.rotate(VDir::Bottom, HDir::Left);
        if self.check_shape_crosses_h_borders()
            || self.check_shape_crosses_v_borders()
            || self.check_shape_intersects_heap()
        {
            self.shape.rotate(VDir::Top, HDir::Right);
        }
    }

    pub fn remove_filled_lines(&mut self) {
        let filled = self
            .block_heap
            .iter()
            .enumerate()
            .filter(|(_, row)| row.iter().all(|&c| c == BoardCell::Filled))
            .map(|(r, _)| r)
            .collect::<Vec<_>>();
        filled
            .into_iter()
            .for_each(|r| self.block_heap.remove_line(r));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[ignore]
    fn check_if_shape_crosses_left_border() {
        let mut scene = Scene::new();
        scene.shape = Shape::new(Shape::clone(Shape::get_named("shape0")));
        scene.shape.move_x(-4);

        assert!(scene.check_shape_crosses_h_borders());

        scene.shape.move_x(1);
        scene.shape.rotate(VDir::Bottom, HDir::Left);
        scene.shape.move_x(-1);
        assert!(!scene.check_shape_crosses_h_borders());
        scene.shape.move_x(-1);
        assert!(scene.check_shape_crosses_h_borders());
    }

    #[test]
    #[ignore]
    fn check_if_shape_crosses_right_border() {
        let mut scene = Scene::new();
        scene.shape = Shape::new(Shape::clone(Shape::get_named("shape0")));
        scene.shape.move_x(5);

        assert!(scene.check_shape_crosses_h_borders());

        scene.shape.rotate(VDir::Top, HDir::Right);
        assert!(!scene.check_shape_crosses_h_borders());
    }

    #[test]
    #[ignore]
    fn check_if_shape_crosses_bottom_border() {
        let mut scene = Scene::new();
        scene.shape = Shape::new(Shape::clone(Shape::get_named("shape0")));
        scene.shape.move_y(16);

        assert!(!scene.check_shape_crosses_v_borders());
        scene.shape.move_y(1);
        assert!(scene.check_shape_crosses_v_borders());
    }

    #[test]
    #[ignore]
    fn check_place_figure_on_board() {
        let mut scene = Scene::new();
        scene.shape = Shape::new(Shape::clone(Shape::get_named("shape0")));

        let mut compare = Board::empty();
        compare[0][4] = BoardCell::Filled;
        compare[1][3] = BoardCell::Filled;
        compare[1][4] = BoardCell::Filled;
        compare[1][5] = BoardCell::Filled;
        assert_eq!(scene.place_figure_on_board(), Board::from(compare));

        scene.rotate_figure();
        let mut compare = Board::empty();
        compare[0][4] = BoardCell::Filled;
        compare[1][4] = BoardCell::Filled;
        compare[1][5] = BoardCell::Filled;
        compare[2][4] = BoardCell::Filled;
        assert_eq!(scene.place_figure_on_board(), Board::from(compare));
    }

    #[test]
    #[ignore]
    fn check_if_shape_crosses_border_on_rotation() {
        unimplemented!()
    }

    #[test]
    #[ignore]
    fn check_if_shape_crosses_block_heap() {
        unimplemented!()
    }

    #[test]
    fn check_game_over() {
        let mut scene = Scene::new();
        let shape = Shape::get_named("shape2");
        let mut heap_height: usize = shape.len();
        loop {
            if heap_height > BOARD_HEIGHT {
                break;
            }

            scene.shape = Shape::new(Shape::clone(shape));
            let steps = BOARD_HEIGHT - heap_height;
            for _ in 0..steps { 
                assert!(!scene.move_figure_y(1)); 
            }
            assert!(scene.move_figure_y(1));
            scene.credit();
            let (hight, _) = scene.shape.matrix.size();
            heap_height += hight;
        }

        scene.shape = Shape::new(Shape::clone(shape));
        assert!(scene.check_shape_intersects_heap())
    }
}

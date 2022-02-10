use super::board::Board;
use super::game_status::GameStatus;
use super::scene::Scene;
use serde::Serialize;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
struct GameState {
    blocks: Board,
    status: GameStatus,
}

#[wasm_bindgen]
pub struct Game {
    scene: Scene,
    status: GameStatus,
}

#[wasm_bindgen]
impl Game {
    pub fn new() -> Self {
        Game {
            scene: Scene::new(),
            status: GameStatus::Pending,
        }
    }

    pub fn move_left(&mut self) -> JsValue {
        self.scene.move_figure_x(-1);
        self.to_js()
    }

    pub fn move_right(&mut self) -> JsValue {
        self.scene.move_figure_x(1);
        self.to_js()
    }

    pub fn move_down(&mut self) -> JsValue {
        let touched = self.scene.move_figure_y(1);
        
        if !touched {
            return self.to_js() 
        }

        self.scene.credit();
        self.scene.reset_figure();

        self.status = if self.scene.check_shape_intersects_heap() {
            GameStatus::Over
        } else {
            GameStatus::InProgress
        };

        self.to_js()
    }

    pub fn rotate(&mut self) -> JsValue {
        self.scene.rotate_figure();
        self.to_js()
    }

    pub fn to_js(&self) -> JsValue {
        JsValue::from_serde(&self.get_state()).unwrap()
    }

    fn get_state(&self) -> GameState {
        GameState {
            blocks: self.scene.get_merged(),
            status: self.status,
        }
    }

    pub fn start(&mut self) -> JsValue {
        if self.status == GameStatus::Pending {
            self.status = GameStatus::InProgress
        }
        self.to_js()
    }

    pub fn tick(&mut self) -> JsValue {
        self.move_down()
    }
}

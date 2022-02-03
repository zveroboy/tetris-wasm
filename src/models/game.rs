use wasm_bindgen::prelude::*;

use super::scene::Scene;

#[wasm_bindgen]
pub struct Game {
    scene: Scene,
}

#[wasm_bindgen]
impl Game {
    pub fn new() -> Self {
        Game {
            scene: Scene::new(),
        }
    }

    pub fn move_left(&mut self) -> JsValue {
        self.scene.move_figure_x(-1);
        JsValue::from_serde(&self.scene.get_merged()).unwrap()
    }

    pub fn move_right(&mut self) -> JsValue {
        self.scene.move_figure_x(1);
        JsValue::from_serde(&self.scene.get_merged()).unwrap()
    }

    pub fn move_down(&mut self) -> JsValue {
        self.scene.move_figure_y(1);
        JsValue::from_serde(&self.scene.get_merged()).unwrap()
    }

    pub fn rotate(&mut self) -> JsValue {
        self.scene.rotate_figure();
        JsValue::from_serde(&self.scene.get_merged()).unwrap()
    }

    pub fn tick(&mut self) -> JsValue {
        self.move_down()
    }
}

use wasm_bindgen::prelude::*;
use physics::{Charge, Vector2};

#[wasm_bindgen]
pub fn electric_potential(
    charge_value: f64,
    charge_x: f64,
    charge_y: f64,
    point_x: f64,
    point_y: f64
) -> Result<f64, JsValue> {
    let charge1 = Charge {
        pos: Vector2 {
            x: charge_x,
            y: charge_y,
        },
        charge: charge_value
    };
    let point = Vector2 {
        x: point_x,
        y: point_y,
    };

    Charge::electric_potential(&charge1, &point)
    .map_err(|error| JsValue::from_str(&error))
}
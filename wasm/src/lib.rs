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

#[wasm_bindgen]
pub fn electric_field(
    charge_value: f64,
    charge_x: f64,
    charge_y: f64,
    point_x: f64,
    point_y: f64,
) -> Result<Vec<f64>, JsValue> {

    let charge = Charge {
        pos: Vector2 {
            x: charge_x,
            y: charge_y,
        },
        charge: charge_value
    };
    let point = Vector2 {
        x:point_x,
        y:point_y,
    };

    let field = Charge::electric_field(&charge, &point)
        .map_err(|error| JsValue::from_str(&error))?;

    Ok(vec![field.x, field.y])



}

#[wasm_bindgen]
pub fn total_electric_potential(
    charges_data: &[f64],
    point_x: f64,
    point_y: f64,
) -> Result<f64, JsValue> {
    if charges_data.len() % 3 != 0 {
        return Err(JsValue::from_str(
            "Cada carga necesita tres valores: x, y, carga"
        ));
    }

    let mut charges = Vec::new();

    let point = Vector2 {
        x:point_x,
        y:point_y,
    };

    for values in charges_data.chunks_exact(3) {
        let q1 = Charge {
            pos: Vector2 {
                x:values[0],
                y:values[1],
            },
            charge: values[2]
        };
        
        charges.push(q1);
    };

    Charge::total_electric_potential(&charges, &point)
        .map_err(|error| JsValue::from_str(&error))

}
#[wasm_bindgen]
pub fn total_electric_field(
    charges_data: &[f64],
    point_x:f64,
    point_y:f64,
) -> Result<Vec<f64>, JsValue> {
    if charges_data .len() % 3 != 0 {
        return Err(JsValue::from_str(
            "Cada carga necesita 3 valores"))
    }
    let mut charges = Vec::new();

    let point = Vector2 {
        x:point_x,
        y:point_y,
    };

    for values in charges_data.chunks_exact(3) {
        let q1 = Charge {
            pos: Vector2 {
                x:values[0],
                y:values[1],
            },
            charge: values[2]
        };
        
        charges.push(q1);
    };

    let field = Charge::total_electric_field(&charges, &point)
        .map_err(|error| JsValue::from_str(&error))?;

    Ok(vec![field.x,field.y])




}

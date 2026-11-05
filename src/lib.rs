#[derive(Debug, Clone, Copy)]
pub struct Vector2 {
    pub x: f64,
    pub y: f64,
}

pub struct Charge {
    pub pos: Vector2,
    pub charge: f64,
}

impl Vector2 {
    pub fn magnitude(&self) -> f64 {
        let module = (self.x.powi(2) + self.y.powi(2)).sqrt();
        return module;
    }
    pub fn substract(&self, other: Vector2) -> Vector2 {
        let sub1 = self.x - other.x;
        let sub2 = self.y - other.y;
        let vector = Vector2 { x: sub1, y: sub2 };
        return vector;
    }

    pub fn add(&self, other: Vector2) -> Vector2 {
        let suma1 = self.x + other.x;
        let suma2 = self.y + other.y;
        let vector = Vector2 { x: suma1, y: suma2 };
        return vector;
    }

    pub fn distance(&self, other: &Vector2) -> f64 {
        let distance = other.substract(*self);
        let distance = distance.magnitude();
        return distance;
    }
    pub fn normalize(&self) -> Result<Vector2, String> {
        let magnitude = self.magnitude();
        if magnitude == 0.0 {
            return Err(String::from(
                "The module of the vector is 0.
                El modulo del vector es 0.",
            ));
        };
        let x = Vector2 {
            x: (self.x / magnitude),
            y: (self.y / magnitude),
        };
        return Ok(x);
    }
    pub fn scale(&self, factor: f64) -> Vector2 {
        let v = Vector2 {
            x: self.x * factor,
            y: self.y * factor,
        };
        return v;
    }
}

impl Charge {
    pub fn coulomb_force(q1: &Charge, q2: &Charge) -> Result<f64, String> {
        const K: f64 = 8.99e9;
        let distance = &q1.pos.distance(&q2.pos);
        if *distance == 0.0 {
            return Err(String::from(
                "The charges are in the same position.
                Las cargas estan en la misma posicion.
        ",
            ));
        }
        let force = K * ((q1.charge * q2.charge).abs() / distance.powi(2));
        return Ok(force);
    }

    pub fn coulomb_force_vector(q1: &Charge, q2: &Charge) -> Result<Vector2, String> {
        let normal = q1.pos.substract(q2.pos);
        let normal = normal.normalize()?;
        let module = Charge::coulomb_force(&q1, q2);
        if q1.charge * q2.charge < 0.0 {
            let vector = normal.scale(module?).scale(-1.0);
            Ok(vector)
        } else {
            let vector = normal.scale(module?);
            Ok(vector)
        }
    }
}

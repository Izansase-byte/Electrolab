const vector1: Vector2 = Vector2 { x: 0.0, y: 0.0 };
const vector2: Vector2 = Vector2 { x: 0.5, y: 0.0 };

#[test]
fn repulsion_test() {
    let q1 = Charge {
        pos: vector1,
        charge: 2e-6,
    };
    let q2 = Charge {
        pos: vector2,
        charge: 3e-6,
    };
    let vector = Charge::coulomb_force_vector(&q1, &q2);
    assert!((vector.unwrap().x + 0.21576).abs() < 1e-6);
}
#[test]
fn atraction_test() {
    let q1 = Charge {
        pos: vector1,
        charge: 2e-6,
    };
    let q2 = Charge {
        pos: vector2,
        charge: -3e-6,
    };
    let vector = Charge::coulomb_force_vector(&q1, &q2);
    assert!((vector.unwrap().x - 0.21576).abs() < 1e-6);
}

#[test]
fn neutral_test() {
    let q1 = Charge {
        pos: vector1,
        charge: 2e-6,
    };
    let q2 = Charge {
        pos: vector2,
        charge: 0.0,
    };
    let vector = Charge::coulomb_force_vector(&q1, &q2);
    assert_eq!((vector.unwrap().x).abs(), 0.0);
}

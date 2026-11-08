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

pub fn total_force(
    target: &Charge,
    charges: &[Charge],
) -> Result<Vector2, String> {
    let mut vector = Vector2 {
        x:0.0,
        y:0.0,
    };
    for charge in charges {

        let force = Charge::coulomb_force_vector(target, charge)?;
        vector = vector.add(force)
    };
    return Ok(vector)
}

#[test]
fn test_total_force() {
    let vector1 = Vector2 {
        x:0.0,
        y:0.0,
    };
    let q1 = Charge {
        pos: vector1,
        charge: 1e-6,
    };
    let vector2 = Vector2 {
        x:1.0,
        y:0.0,
    };
    let q2 = Charge {
        pos: vector2,
        charge: 2e-6,
    };
    let vector3 = Vector2 {
        x:0.0,
        y:1.0,
    };
    let q3 = Charge {
        pos: vector3,
        charge: 3e-6,
    };

    let force = total_force(&q1, &[q2,q3]).unwrap();
    
    assert!(force.x < 0.0);
    assert!(force.y < 0.0)
}
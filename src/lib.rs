#[derive(Debug, Clone, Copy)]
pub struct Vector2 {
    pub x: f64,
    pub y: f64,
}
impl Vector2{
    pub fn magnitude(&self) -> f64 {
        let module = (self.x.powi(2) + self.y.powi(2)).sqrt();
        return module
    }
    pub fn substract(&self, other: Vector2) -> Vector2 {
        let sub1 = self.x - other.x;
        let sub2 = self.y - other.y;
        let vector = Vector2{
            x: sub1,
            y: sub2
        };
        
        return vector

        
        }

    pub fn add(&self, other: Vector2) -> Vector2 {
        let suma1 = self.x + other.x;
        let suma2 = self.y + other.y;
        let vector = Vector2 {
            x: suma1,
            y: suma2
        };
        return vector

    }

    pub fn distance(&self, other: &Vector2) -> f64 {
       let distance = other.substract(*self);
       let distance = distance.magnitude();
       return distance
    }

}

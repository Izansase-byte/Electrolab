#[derive(Debug, Clone, Copy)]
pub struct Vector2 {
    pub x: f64,
    pub y: f64,
}
impl Vector2{
    fn magnitude(&self) -> f64 {
        let module = (self.x.powi(2) + self.y.powi(2)).sqrt();
        return module
    }

}

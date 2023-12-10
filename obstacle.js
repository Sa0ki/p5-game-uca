class Obstacle {
  constructor(x, y, img) {
    this.pos = createVector(x, y);
    this.radius = random(30, 80);
    this.img = img;
  }

  show() {
    push();
    imageMode(CENTER);
    image(this.img, this.pos.x, this.pos.y, this.radius, this.radius);
    pop();
  }
}
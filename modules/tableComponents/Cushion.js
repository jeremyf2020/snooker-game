class Cushion {
    // init the cushion with default value
    constructor(x, y, vertexSets) {
        this.color = 'darkgreen';
        this.body = Bodies.fromVertices(x, y, vertexSets, {
            restitution: .6, friction: 0.3, // should slow down the ball when it hits the cushion
            isStatic: true, label: `${this.color}`
        });
        this.addToWorld();
    }
    // add to physics engine (world)
    addToWorld() {
        World.add(engine.world, this.body);
    }
    // Draw the cushion
    draw() {
        push();
        fill(this.color)
        drawVertices(this.body.vertices);
        pop();
    }
}
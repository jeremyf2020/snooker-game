class Cushion {
    constructor(x, y, vertexSets) {
        this.color = 'darkgreen';
        this.body = Bodies.fromVertices(x, y, vertexSets, {
            restitution: .6, friction: 0.3,
            isStatic: true, label: `${this.color}`
        });
        this.addToWorld();
    }
    addToWorld() {
        World.add(engine.world, this.body);
    }
    draw() {
        push();
        fill(this.color)
        drawVertices(this.body.vertices);
        pop();
    }
}
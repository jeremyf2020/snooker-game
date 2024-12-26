class Cushion {
    constructor(x, y, vertexSets) {
        this.color = 'darkgreen';
        this.body = Bodies.fromVertices(x, y, vertexSets, { isStatic: true });
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
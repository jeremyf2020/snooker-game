
class Ball {
    constructor(color, x, y, diameter) {
        this.color = color;
        this.body = Bodies.circle(x, y, diameter / 2, { restitution: .8, friction: 0.001 });
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

class CueBall extends Ball {
    constructor(x, y, diameter) {
        super('white', x, y, diameter);
        this.isDragging = false; // Track if the cue ball is being dragged
    }

    // Start dragging the cue ball
    checkMouseHovering() {
        const adjustedMouse = getAdjustMousePos();
        if (adjustedMouse.x <= this.body.bounds.max.x && adjustedMouse.x >= this.body.bounds.min.x
            && adjustedMouse.y <= this.body.bounds.max.y && adjustedMouse.y >= this.body.bounds.min.y) {
            return true;
        }
        return false;
    }
    // Update the cue ball's position while dragging
    updateDragging() {
        const adjustedMouse = getAdjustMousePos();
        if (this.isDragging) {
            cue.hide = true;
            Matter.Body.setPosition(this.body, { x: adjustedMouse.x, y: adjustedMouse.y });
        }
    }

    // Draw the cue ball
    draw() {
        if (this.isDragging) {
            this.updateDragging();
        }
        if (game.moving && checkBallsStopped()) {
            game.moving = false;
            cue.hide = false; // Show the cue after all balls have stopped moving
        }
        push();
        fill(this.color)
        drawVertices(this.body.vertices);
        pop();
    }
}

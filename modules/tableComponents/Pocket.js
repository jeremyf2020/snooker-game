class Pocket {
    // initialize the pocket in default Pos
    constructor(x, y, pocketSize) {
        this.position = createVector(x, y);
        this.radius = pocketSize;
    }

    // Check if a ball is close enough to be potted
    checkPot() {
        // Combine all balls into a single array for iteration
        const cueBall = ballPool.cueBall;
        // Tell the game that if the ball is potted
        if (cueBall) { // check cueBall
            if (cueBall.onHand) return; // Skip if the cue ball is on hand
            if (this.isClosedToPot(cueBall)) {
                game.potted(cueBall);
            }
        }
        // check all other balls
        [...ballPool.colorBalls, ...ballPool.redBalls].forEach(b => {
            if (this.isClosedToPot(b)) {
                game.potted(b);
            }
        })
    }

    // Check if a ball is close enough to be potted
    isClosedToPot(ball) {
        const distance = dist(this.position.x, this.position.y, ball.body.position.x, ball.body.position.y);
        if (distance < this.radius) {
            return true;
        }
    }

    // Draw the pocket
    draw() {
        push();
        fill('black');
        ellipse(this.position.x, this.position.y, this.radius);
        pop();
        this.checkPot();
    }
}

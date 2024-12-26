class Pocket {
    constructor(x, y, pocketSize) {
        this.position = createVector(x, y);
        this.radius = pocketSize;
    }

    // Check if a ball is close enough to be potted
    checkPot(table) {
        // Combine all balls into a single array for iteration
        const cueBall = table.cueBall;
        if (cueBall) {
            if (cueBall.onHand) return; // Skip if the cue ball is on hand
            const distance = dist(this.position.x, this.position.y, cueBall.body.position.x, cueBall.body.position.y);
            if (distance < this.radius) {
                Matter.World.remove(engine.world, cueBall.body);
                table.cueBall = null; // Mark cue ball as potted
                console.log("Cue ball potted!");
                return;
            }
        }

        // Check and remove balls from the colorBalls array
        table.colorBalls = table.colorBalls.filter(ball => {
            const distance = dist(this.position.x, this.position.y, ball.body.position.x, ball.body.position.y);
            if (distance < this.radius) {
                Matter.World.remove(engine.world, ball.body);
                console.log(`${ball.color} ball potted!`);
                return false; // Remove this ball from the array
            }
            return true; // Keep this ball in the array
        });

        // Check and remove balls from the redBalls array
        table.redBalls = table.redBalls.filter(ball => {
            const distance = dist(this.position.x, this.position.y, ball.body.position.x, ball.body.position.y);
            if (distance < this.radius) {
                Matter.World.remove(engine.world, ball.body);
                console.log("Red ball potted!");
                return false; // Remove this ball from the array
            }
            return true; // Keep this ball in the array
        });
    }

    // Draw the pocket
    draw(table) {
        push();
        fill('black');
        ellipse(this.position.x, this.position.y, this.radius);
        pop();
        this.checkPot(table);
    }
}

class Game {
    constructor() {
        this.mode = 0;
        this.players = [new Player(), new Player()];
        this.player = this.players[0];
        this.moving = false;
        this.nextBall = 'red';

    }
    start(num) {
        this.mode = num;
        ballPool.genAllballs(this.mode);
    }

    potted(color) {
        const ballValue = this.getBallValue(color);
        if (this.isValidPotted(color)) {
            this.player.addScore(ballValue);
        } else {
            this.player.penalize(ballValue);
        }
    }

    isValidPotted(color) {
        if (color === "white") return false;
        return color === this.nextBall;
    }

    nextPlayer() {
        this.player = this.players[0] === this.player ? this.player[1] : this.player[0];
        this.nextBall = ballPool.redBalls.length > 0 ? 'red' : this.nextColorBall();
        if (!this.nextBall) {
            // console.log("Game over!");
            // [TODO] end the game
        }
    }

    nextShoot() {
        this.moving = false;
        cue.hide = false;
    }


    nextColorBall() {
        const colorOrder = ['yellow', 'green', 'brown', 'blue', 'pink', 'black']; // Snooker color order
        const remainingColors = ballPool.colorBalls.map(ball => ball.color); // Get remaining colors on the table

        for (let color of colorOrder) {
            if (remainingColors.includes(color)) {
                return color; // Return the next available color
            }
        }

        return null; // No color balls remain
    }

    getBallValue(ballColor) {
        // the order of the balls helps penalize when foul
        if (ballColor === 'black') return 7;
        if (ballColor === 'pink') return 6;
        if (ballColor === 'blue') return 5;
        if (ballColor === 'brown') return 4;
        // cue ball is worth 4 points 
        if (ballColor === 'white') return 4;
        if (ballColor === 'lightgreen') return 3;
        if (ballColor === 'yellow') return 2;
        if (ballColor === 'red') return 1;
    }

    checkAllBallsStopped() {
        const stopThreshold = 0.01; // Threshold for stopping

        // Check all red balls
        for (const ball of [ballPool.cueBall, ...ballPool.redBalls, ...ballPool.colorBalls]) {
            if (!ball) {
                continue;
            }
            const velocity = ball.body.velocity;
            const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
            if (speed > stopThreshold) {
                return false; // If any red ball is moving, return false
            }
        }
        return true;
    }

}

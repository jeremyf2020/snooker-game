class Game {
    constructor() {
        this.mode = 0;
        this.players = [new Player("1"), new Player("2")];
        this.player = this.players[0];
        this.board = [];
        // for every round
        this.validBall = 'red';
        this.penalyPoint = 0;
        this.moving = false;
        this.toRespotted = [];
        this.lastPoted = null;
    }
    start(num) {
        this.mode = num;
        ballPool.genAllballs(this.mode);
    }

    potted(ball) {
        // check the color of current round
        if (ball.color === this.validBall) { // valid potted
            this.validBall = this.lastPoted === null ? 'red' : null; // reset validBall before selection
            this.lastPoted = ball.color;
            this.player.addScore(ball.score);
            if (ballPool.redBalls.length > 0) {
                ballPool.colorBalls.forEach(ball => {
                    ball.availableToSel = true;
                });
            }
            else {
                this.validBall = nextColorBall();
            }
        } else {
            if (ball.score > this.penalyPoint) { //invalid potted
                this.penalyPoint = ball.score;
            }
            this.toRespotted.push(ball);
        }
    }

    nextShot() {
        // calculate scores
        if (this.penalyPoint != 0) {
            this.player.penalize(this.penalyPoint)
        }
        // respot all the balls
        if (!ballPool.cueBall) {
            ballPool.genCueBall();
        }
        this.nextPlayer();
        cue.hide = false;
        this.moving = false;
    }

    nextPlayer() {
        this.toRespotted.forEach(b => {
            ballPool.reSpot(b.id)
        })
        this.player = this.player.name === "1" ? this.players[1] : this.players[0];
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

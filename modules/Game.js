class Game {
    constructor() {
        this.mode = 0;
        this.players = [new Player("1"), new Player("2")];
        this.player = this.players[0];
        this.validBall = 'red';
        this.penalyPoint = 0;
        this.moving = false;
        this.toRespotted = [];

    }
    start(num) {
        this.mode = num;
        ballPool.genAllballs(this.mode);
    }

    potted(ball) {
        // check the color of current round
        if (ball.color === this.validBall) {
            this.player.addScore(ball.score);
        } else {
            if (ball.score > this.penalyPoint) {
                this.penalyPoint = ball.score;
            }
            this.toRespotted.push(ball);
        }
    }

    // isValidPotted(color) {
    //     if (color === "white") return false;
    //     return color === this.validBall;
    // }

    nextPlayer() {
        this.toRespotted.forEach(b => {
            ballPool.reSpotted(b.id)
        })
        this.player = this.player.name === "1" ? this.players[1] : this.players[0];



        // this.nextBall = ballPool.redBalls.length > 0 ? 'red' : this.nextColorBall();
        // if (!this.nextBall) {
        //     // console.log("Game over!");
        //     // [TODO] end the game
        // }
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
        if (ballPool.redBalls.length > 0) {
            //refill the color balls
        }
        this.nextPlayer();
        cue.hide = false;
        this.moving = false;
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

class Game {
    constructor() {
        this.mode = 0;
        this.players = [new Player("1"), new Player("2")];
        this.currentPlayer = this.players[0];
        this.board = ["Please place your cue ball in D-zone"];
        // for each shot (and each round)
        this.validBall = 'red';
        this.penalyPoint = 0;
        this.moving = false;
        this.toRespotted = [];
        this.lastPoted = null;
        // for each round
        this.freeBall = true;
    }
    start(num) {
        this.mode = num;
        ballPool.genAllballs(this.mode);
    }
    shooted() {
        // change game status, monitor by this.checkAllBallsStopped
        // running in sketch.js draw, becuase of checking in every frame
        // (Cue ball Collision and pockect sensor will be implement by themselves)
        game.moving = true;

        // Hide the cue after shooting
        cue.hide = true;
        // turn off the selection for color balls
        ballPool.stopSelection();
        // turn off the freeball for next shot
        game.freeBall = false;
    }

    potted(ball) {
        // remove the potted ball from the ballPool
        ballPool.removeFromPool(ball);
        // check the potted ball is valid potted
        const isValid = ball.color === this.validBall ? true : false;

        if (ballPool.colorBalls.length === 0 && ballPool.redBalls.length === 0) {
            this.gameEnded()
        }
        // apply different actions by valid status 
        if (isValid) {
            // add score immediately if valid move
            this.currentPlayer.changeScore(ball.score);
        }
        if (!isValid) {
            if (ball.color === 'white') {
                this.freeBall = true;
                cue.hide = true;
            }
            // from wiki: If multiple fouls are committed in one shot,
            // only the penalty for the highest-valued foul is scored 
            // the penaly will be execute when ball stopped, will invoke nextShot function
            if (ball.score > this.penalyPoint) {
                this.penalyPoint = ball.score;
            }
            // store the potential respoted ball in array, will be respoted in nextShot function
            this.toRespotted.push(ball);
            // if potted invalid ball, then the rest potted ball will be invalid
            this.validBall = null;
        }
        // no matter the ball is valid or not,
        // player collect 1 ball, this could be player's stratgy
        this.currentPlayer.dragonBallCollected();
        // update last potted ball waiting for nextShot function
        this.lastPoted = ball.color;
    }

    nextShot() {
        // check the toRespotted balls
        if (this.toRespotted.length > 0) {
            let pottedColorBalls = 0;
            for (const ball of this.toRespotted) {
                if (ball.color === 'red') {
                    continue; // red is not needed to repot, then the remaining will be color and white
                }
                if (ball.color === 'white') {
                    ballPool.genCueBall();
                    this.addMessage("cue ball has been respotted")
                    continue;
                }
                ballPool.reSpot(ball.id);
                this.addMessage(`${ball.color} ball has been respotted`);
                pottedColorBalls++;
            }
            if (pottedColorBalls > 1) {
                this.addMessage(`FOUL: two consecutive colored balls!`)
                this.addMessage(`Player ${this.currentPlayer.name} score -${this.penalyPoint}`)
            }
        }

        // reset the status when the ball stopped, some of them needed to wait for the resborn
        ballPool.cueBall.collision = null;
        ballPool.stopSelection();
        this.moving = false;
        if (!ballPool.cueBall.onHand) {
            cue.hide = false;
        }
        this.toRespotted = [];

        if (this.validBall !== this.lastPoted) {
            // penality if invalid potted
            if (this.penalyPoint != 0) {
                this.currentPlayer.changeScore(-this.penalyPoint);
                this.penalyPoint = 0;
            }
            this.nextPlayer();
            return;
        }
        // if valid potted, then last
        // potted red, next should be color
        if (this.lastPoted === 'red') {
            ballPool.colorBalls.forEach(ball => {
                ball.availableToSel = true;
            });
        }
        if (this.lastPoted !== 'red') {
            // that means it must be color, white ball wouldnt be valid potted
            if (ballPool.redBalls.length == 0) {
                // if all red potted and finished last color, 
                // then should start color by order, yellow->green...->black.
                this.validBall = nextColorBall();
                return;
            }
            // if red remainngi, next should be red
            this.validBall = 'red';
        }

        this.freeBall = false;
        this.lastPoted = null;
    }

    nextPlayer() {
        // reset the status and array
        this.validBall = 'red';
        // other player's turn
        this.currentPlayer = this.currentPlayer.name === "1" ? this.players[1] : this.players[0];
    }

    gameEnded() {

    }
    addMessage(str) {
        this.board.unshift(str)
    }

    checkAllBallsStopped() {
        const stopThreshold = 0.1; // Threshold for stopping
        // Check all balls
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

    changeScore(num, player = this.currentPlayer) {
        let targetPlayer = player;
        if (player === "opponent") {
            targetPlayer = game.players.find(player => player !== game.currentPlayer);
        }
        targetPlayer.changeScore(num);
        this.addMessage(`Player ${targetPlayer.name} score increased by ${num}`);
    }

}

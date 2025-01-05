class Game {
    constructor() {
        this.mode = 1;
        this.players = [new Player("Player One"), new Player("Player Two")];
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
        this.nextPlayerIsWaitingDragon = false;
        // for dragon ball character mode only
        this.characters = [new Character("Goku"), new Character("Guhan")];
        this.currentCharacter = this.characters[0];
    }
    reset() {
        // reset all the game status
        this.players.forEach(player => player.reset());
        this.currentPlayer = this.players[0];
        this.board = ["Please place your cue ball in D-zone"];
        this.validBall = 'red';
        this.penalyPoint = 0;
        this.moving = false;
        this.toRespotted = [];
        this.lastPoted = null;
        this.freeBall = true;
        this.nextPlayerIsWaitingDragon = false;
        this.currentCharacter = this.characters[0];
    }
    start(num) {
        this.mode = num;
        ballPool.genAllballs(this.mode);
        this.players[0].name = num === 0 ? "Goku" : "One";
        this.players[1].name = num === 0 ? "Gohan" : "Two";
    }
    shooted() {
        // change game status, monitor by this.checkAllBallsStopped
        // running in sketch.js draw, becuase of checking in every frame
        // (Cue ball Collision and pockect sensor will be implement by themselves)
        this.moving = true;
        if (this.mode === 0) {
            this.currentCharacter.motion = 'attack';
        }

        // this.currentCharacter.rolling = true;

        // Hide the cue after shooting
        cue.hide = true;
        // turn off the selection for color balls
        ballPool.stopSelection();
        // turn off the freeball for next shot
        game.freeBall = false;
    }

    potted(ball) {
        this.addMessage(`${ball.color === "white" ? "Cue" : ball.color} ball has been potted`)
        // remove the potted ball from the ballPool
        ballPool.removeFromPool(ball);
        // check the potted ball is valid potted
        const isValid = ball.color === this.validBall;

        if (ballPool.colorBalls.length === 0 && ballPool.redBalls.length === 0) {
            this.gameEnded();
            return;
        }
        // apply different actions by valid status 
        if (isValid) {
            // add score immediately if valid move
            this.currentPlayer.changeScore(ball.score);
            this.toRespotted.push(ball);
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
        // reset the status when the ball stopped
        this.moving = false;

        if (this.mode === 0 && !ballPool.cueBall) {
            this.currentCharacter.currentPos = null;
            this.currentCharacter.lastPos = null;
        }
        this.currentCharacter.stopRolling();

        ui.force = 0.5;
        // check the toRespotted balls, see message for situation explaination
        if (this.toRespotted.length > 0) {
            let pottedColorBalls = 0;
            for (const ball of this.toRespotted) {
                if (ball.color === 'red') {
                    continue; // red is not needed to repot, then the remaining will be color and white
                }
                if (ball.color === 'white') {
                    ballPool.genCueBall();
                    this.addMessage("Cue ball has been respotted");
                    this.addMessage("Please place your cue ball in D-zone");
                    if (this.mode === 0) {
                        // in dragon ball mode, the cue ball will be placed at the last position of the opponent, avoid the position is out of bound
                        const opponent = this.currentCharacter.name === this.characters[0].name ? this.characters[1] : this.characters[0];
                        if (opponent.lastPos) {
                            Matter.Body.setPosition(ballPool.cueBall.body, opponent.lastPos);
                            ballPool.cueBall.onHand = false;
                            ballPool.cueBall.isPotted = false;
                        }
                    }
                    continue;
                }
                ballPool.reSpot(ball.id);
                this.addMessage(`${ball.color} ball has been respotted`);
                pottedColorBalls++;
            }
            if (pottedColorBalls > 1) {
                this.addMessage(`FOUL: two consecutive colored balls!`)
                this.addMessage(`${this.currentPlayer.name} score -${this.penalyPoint}`)
            }
        }

        // reset the status after every ball has been respotted
        ballPool.cueBall.collision = null;
        // ballPool.stopSelection();
        cue.hide = ballPool.cueBall.onHand;

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
            this.validBall = null;
            this.addMessage("Please select a color ball to pot");
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
        this.freeBall = this.currentPlayer.everyShotFreeBall ? true : this.freeBall;
        this.lastPoted = null;
    }

    nextPlayer() {
        if (dragon.isSummoned) {
            this.nextPlayerIsWaitingDragon = true;
            return;
        }
        // reset the status and array
        this.validBall = 'red';
        // other player's turn
        this.currentPlayer = this.currentPlayer.name === this.players[0].name ? this.players[1] : this.players[0];
        this.currentCharacter = this.currentCharacter.name === this.characters[0].name ? this.characters[1] : this.characters[0];
        if (game.mode === 0) {
            // in dragon ball mode, the position of the cue ball will be stored
            if (!this.currentCharacter.lastPos
                || !ballPool.cueBall.isInsideTable(this.currentCharacter.lastPos)
            ) {
                ballPool.cueBall.onHand = true;
                cue.hide = true;
            } else {
                // apply the last position of the opponent
                Matter.Body.setPosition(ballPool.cueBall.body, game.currentCharacter.lastPos);
            }
        }
        this.freeBall = this.currentPlayer.everyShotFreeBall ? true : this.freeBall;
        this.addMessage(`${this.currentPlayer.name}'s turn`);
    }

    gameEnded() {
        this.addMessage(`Game ended!`);
        this.addMessage(`${this.players[0].score > this.players[1].score ? this.players[0].name : this.players[1].name} won!`);
    }
    addMessage(str) {
        this.board.unshift(str)
    }

    checkAllBallsStopped() {
        // Check all balls
        for (const ball of [ballPool.cueBall, ...ballPool.redBalls, ...ballPool.colorBalls]) { // check all balls
            if (!ball) { // skip if the ball is not exist
                continue;
            }
            const speed = ball.body.speed;
            if (speed > 0.005) { // check if any ball is moving
                return false;
            }
            ball.body.speed = 0; // when almost stop, completely stop it to make next turn faster come up
        }
        return true;
    }

    outBound(ball) {
        // check if the ball is out of bound
        this.addMessage(`${ball.color === "white" ? "Cue" : ball.color} ball out of bound!`)
        this.addMessage(`${this.currentPlayer.name} score -${ball.score}`);

        // penalyPoint is now positive, excution will turn it to negative
        this.penalyPoint = ball.score;
        ballPool.removeFromPool(ball);
        if (this.mode === 0) {
            // dragon ball mode
            this.currentCharacter.outBounded = true;
        }
        if (ball.color === 'white') {
            this.toRespotted.push(ball);
        } else if (ball.color !== 'red') {
            this.toRespotted.push(ball);
            this.addMessage(`Place ${ball.color} back on table`);
        }
        //reset the status
        this.freeBall = true;
        this.lastPoted = null;
        cue.hide = true;
    }

    changeScore(num, targetPlayer = this.currentPlayer) {
        // change the score of the player
        targetPlayer.changeScore(num);
        this.addMessage(`${targetPlayer.name} score ${num > 0 ? "increased" : "decreased"} by ${num}`);
    }

    stealBalls(summoingPlayer) {
        //summoingPlayer steal targetPlayer's balls
        const targetPlayer = game.players.find(player => player.dragonSummoring === false);
        const targetBalls = targetPlayer.pottedBalls;
        summoingPlayer.pottedBalls = targetBalls;
        targetPlayer.pottedBalls = 0;
    }

}

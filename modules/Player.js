class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.pottedBalls = 0;
        this.anotherShot = false; // if player have score successfuly, play can get another shot in the same round
    }
    dragonBallCollected() {
        this.pottedBalls++;
        console.log(this.pottedBalls)
        if (this.pottedBalls === 7) {
            console.log(this.pottedBalls)

            dragon.isSummoned = true;
        }
    }
    addScore(score) {
        this.score += score;
        this.dragonBallCollected();
    }
    penalize(score) {
        this.score -= score;
        // player can startgily to penalize to summor dragon 
        this.dragonBallCollected();
    }
}
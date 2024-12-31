class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.pottedBalls = 0;
        this.anotherShot = false; // if player have score successfuly, play can get another shot in the same round
    }
    dragonBallCollected() {
        this.pottedBalls++;
        if (this.pottedBalls === 7) {
            dragon.isSummoned = true;
            this.pottedBalls = 0;
        }
    }
    changeScore(score) {
        this.score += score;
    }
}
class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.pottedBalls = 0;
        this.anotherShot = false; // if player have score successfuly, play can get another shot in the same round
    }
    addScore(score) {
        this.score += score;
        this.pottedBalls++;
    }
    penalize(score) {
        this.score -= score;
        // player can startgily to penalize to summor dragon 
        this.pottedBalls++;
    }
}
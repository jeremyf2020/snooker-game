class Player {
    constructor() {
        this.score = 0;
        this.pottedBalls = 0;
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
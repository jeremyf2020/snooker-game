class Player {

    // init the player class with name and default values
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.pottedBalls = 0;
        this.anotherShot = false; // if player have score successfuly, play can get another shot in the same round
        this.dragonSummoring = false;
        this.everyShotFreeBall = false;
        this.everyRoundFreeBall = false;
    }
    // dragon ball calulater
    dragonBallCollected() {
        this.pottedBalls++;
        if (this.pottedBalls === 7) {
            dragon.isSummoned = true;
            this.dragonSummoring = true;
        }
    }
    // score handling function
    changeScore(score) {
        this.score += score;
    }
}
class Game {
    /* abs function? [TODO] 
        this change gamePosition
        Draw the balls in three modes 
        a) starting positions using keystroke “1”, 
        b) random positions (reds only) using keystroke “2”, 
        c) random positions (reds and coloured balls) using keystroke “3”. (This excludes the cue ball)
    */

    constructor() {
        this.mode = 0;
        this.turn = 1;
        this.moving = false;

    }
    //    a) starting positions using keystroke “1”, 
    start(num) {
        this.mode = num;
        ballPool.genAllballs(this.mode);
    }
    //    b) random positions (reds only) using keystroke “2”, 


}

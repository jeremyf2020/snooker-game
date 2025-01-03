class Character {
    constructor() {
        this.currentPos = createVector(100, 100);
        this.curentImage = null;
    }
}

class Goku extends Character {
    constructor() {
        this.positions = {
            idle: [],
            // walk: [],
        }
    }

    getImage(motion, size) {
        image(gokuSprite,
            this.currentPos, this.currentPos, //dx, dy,
            size, size, //dWidth, dHeight, destination rectangle
            320, 1084, //sx, sy, subsection of the source image
            200, 200 //[sWidth], [sHeight] of the subsection of the source image to draw
        )

        push();
        imageMode(CENTER);
        resetMatrix();
        image(gokuSprite,
            mouseX, mouseY, //dx, dy,
            43 / 2, 86 / 2, //dWidth, dHeight, destination rectangle
            320, 1084, //sx, sy, subsection of the source image
            43, 86 //[sWidth], [sHeight] of the subsection of the source image to draw
        )
        pop();


    }
}
class DragonBall {
    constructor() {
        this.positions = [
            { x: 430, y: 0 },
            { x: 1500, y: 0 },
            { x: 1850, y: 850 },
            { x: 1500, y: 1700 },
            { x: 500, y: 1700 },
            { x: 40, y: 850 },
            { x: 940, y: 850 },
        ];
    }
    getStarBallImage(star, size, posX, posY) {
        const index = star - 1;
        image(dragonBallsImage,
            posX, posY, //dx, dy,
            size, size, //dWidth, dHeight, destination rectangle
            this.positions[index].x, this.positions[index].y, //sx, sy, subsection of the source image
            800, 800 //[sWidth], [sHeight] of the subsection of the source image to draw
        )
    }
}

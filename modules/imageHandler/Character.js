const gokuCropPos = {
    // different positions of goku in the sprite sheet, 
    // will be used to crop the image depending on the motion
    'idle': [{ 'pos': { x: 320, y: 1084 }, 'size': { x: 43, y: 86 } }],
    'roll': [{ 'pos': { x: 145, y: 555 }, 'size': { x: 49, y: 38 } },],
    'attack': [
        { 'pos': { x: 81, y: 780 }, 'size': { x: 83, y: 82 } },
        { 'pos': { x: 230, y: 780 }, 'size': { x: 58, y: 82 } },
        { 'pos': { x: 168, y: 780 }, 'size': { x: 54, y: 82 } },
        { 'pos': { x: 290, y: 780 }, 'size': { x: 62, y: 82 } },
        { 'pos': { x: 583, y: 780 }, 'size': { x: 62, y: 82 } },
        { 'pos': { x: 649, y: 780 }, 'size': { x: 57, y: 82 } },
        { 'pos': { x: 716, y: 780 }, 'size': { x: 54, y: 82 } },
        { 'pos': { x: 771, y: 780 }, 'size': { x: 84, y: 82 } },
    ],
}
const guhanCropPos = {
    //different positions of guhan in the sprite sheet, 
    // will be used to crop the image depending on the motion
    'idle': [{ 'pos': { x: 285, y: 1362 }, 'size': { x: 31, y: 83 } }],
    'roll': [{ 'pos': { x: 218, y: 616 }, 'size': { x: 43, y: 47 } }],
    'attack': [
        { 'pos': { x: 193, y: 170 }, 'size': { x: 48, y: 79 } },
        { 'pos': { x: 247, y: 170 }, 'size': { x: 58, y: 79 } },
        { 'pos': { x: 314, y: 170 }, 'size': { x: 46, y: 79 } },
        { 'pos': { x: 365, y: 170 }, 'size': { x: 46, y: 79 } },
        { 'pos': { x: 416, y: 170 }, 'size': { x: 46, y: 79 } },
        { 'pos': { x: 468, y: 170 }, 'size': { x: 46, y: 79 } },
        { 'pos': { x: 520, y: 170 }, 'size': { x: 59, y: 79 } },
        { 'pos': { x: 585, y: 170 }, 'size': { x: 48, y: 79 } },
    ]
}

class Character {
    // initialize the character with the name
    constructor(name) {
        this.name = name;
        this.currentPos = null; // Initialize position
        this.sprite = this.name === 'Goku' ? gokuSprite : guhanSprite; // Assign sprite
        this.scaleRatio = 0.5;
        this.motion = 'idle'; // Default motion
        this.cropPosIndex = 0; // Initialize frame index
        this.cropPos = this.getCropPos(this.motion); // Crop position
        this.angle = 0; // Initial rotation angle in radians
        this.speed = 0.5; // Speed of rotation
        this.rolling = false; // Rolling state
        this.lastPos = null;
        this.outBounded = false;
        this.animationFrameDelay = 10 * this.speed; // Delay between frames
        this.animationFrameCounter = 10; // Counter for frame delay
    }

    draw() {
        push();
        // Move the origin to the character's position
        if (!this.currentPos) {
            this.lastPos = null;
            return;
        }

        // translate the position of the character to the current position for drawing
        translate(this.currentPos.x, this.currentPos.y);
        // attack motion: when the character starts moving, stop when the character collised with the other ball
        if (this.motion === 'attack') {
            this.attack(); // Update frame for left motion
        }
        // roll motion: when the character collised with the other ball, stop when it really stopped
        if (this.motion === 'roll') {
            rotate(this.angle);
            this.angle += this.speed; // Increment rotation angle
        }
        // Draw the image centered at the origin
        if (!this.cropPos) { // enable the position
            console.error("Crop position is undefined. Check motion and sprite configuration.");
            pop();
            return;
        }
        imageMode(CENTER); //center image at the origin to draw, convinient for rotation
        image(
            this.sprite,
            0, 0, // Position relative to the new origin
            this.cropPos.size.x * this.scaleRatio, // Destination width
            this.cropPos.size.y * this.scaleRatio, // Destination height
            this.cropPos.pos.x, // Source x
            this.cropPos.pos.y, // Source y
            this.cropPos.size.x, // Source width
            this.cropPos.size.y  // Source height
        );
        pop();
        // update the last position of the character for the next round 
        this.lastPos = this.currentPos;
    }

    getCropPos(motion) {
        // currently only have 2 characters, so we can hard code the crop position
        const cropArray = this.name === 'Goku' ? gokuCropPos[motion] : guhanCropPos[motion];
        if (!cropArray || cropArray.length === 0) {
            console.error(`Crop array for motion '${motion}' is empty or undefined.`);
            return null;
        }
        return cropArray[this.cropPosIndex % cropArray.length];
    }

    stopRolling() {
        // stop rolling when it really stopped (speed almost 0 will turn to 0)
        this.rolling = false;
        this.updateMotion('idle');
    }

    updateMotion(motion) {
        // update the motion of the character (for external use)
        this.motion = motion;
        this.cropPosIndex = 0;
        const newCropPos = this.getCropPos(this.motion);
        if (!newCropPos) {
            console.error(`No crop position found for motion '${motion}'`);
            return;
        }
        this.cropPos = newCropPos;
    }

    setRotationSpeed(speed) {
        // set the speed of rotation (for external use)
        this.speed = speed;
    }

    attack() {
        // this function starts the animation of attack motion
        // (attack motion: when the character starts moving, stop when the character collised with the other ball)
        this.animationFrameCounter++;
        if (this.animationFrameCounter >= this.animationFrameDelay) {
            this.animationFrameCounter = 0;
            const cropArray = this.name === 'Goku' ? gokuCropPos['attack'] : guhanCropPos['attack'];
            this.cropPosIndex = (this.cropPosIndex + 1) % cropArray.length;
            this.cropPos = this.getCropPos('attack');
        }
    }
}

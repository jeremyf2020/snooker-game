const gokuCropPos = {
    'idle': [{ 'pos': { x: 320, y: 1084 }, 'size': { x: 43, y: 86 } }],
    'roll': [
        { 'pos': { x: 145, y: 555 }, 'size': { x: 49, y: 38 } },
    ],
}
const guhanCropPos = {
    'idle': [{ 'pos': { x: 285, y: 1362 }, 'size': { x: 31, y: 83 } }],
    'roll': [{ 'pos': { x: 218, y: 616 }, 'size': { x: 43, y: 47 } }],
}

class Character {
    constructor(name) {
        this.name = name;
        this.currentPos = null; // Initialize position
        this.sprite = this.name === 'Goku' ? gokuSprite : guhanSprite; // Assign sprite
        this.scaleRatio = 0.5;
        this.motion = 'idle'; // Default motion
        this.cropPos = this.name === 'Goku' ? gokuCropPos[this.motion][0] : guhanCropPos[this.motion][0]; // Crop position
        this.angle = 0; // Initial rotation angle in radians
        this.rotationSpeed = 0.5; // Speed of rotation
        this.rolling = false; // Rolling state
        this.lastPos = null;
    }

    draw() {
        push();
        // Move the origin to the character's position
        if (!this.currentPos) {
            this.lastPos = null;
            return;
        }

        translate(this.currentPos.x, this.currentPos.y);
        if (this.rolling) {
            this.updateMotion('roll');
            // Apply rotation
            rotate(this.angle);
            // Increment the rotation angle for rolling effect
            this.angle += this.rotationSpeed;
        }

        // Draw the image centered at the origin
        imageMode(CENTER);
        image(
            this.sprite,
            0, 0, // Position relative to the new origin
            this.cropPos["size"].x * this.scaleRatio, // Destination width
            this.cropPos["size"].y * this.scaleRatio, // Destination height
            this.cropPos["pos"].x, // Source x
            this.cropPos["pos"].y, // Source y
            this.cropPos["size"].x, // Source width
            this.cropPos["size"].y  // Source height
        );
        pop();
        this.lastPos = this.currentPos;
    }

    stopRolling() {
        this.rolling = false;
        this.updateMotion('idle');
    }

    updateMotion(motion) {
        this.motion = motion; // Default motion
        this.cropPos = this.name === 'Goku' ? gokuCropPos[this.motion][0] : guhanCropPos[this.motion][0]; // Crop position
    }

    setRotationSpeed(speed) {
        this.rotationSpeed = speed; // Set the speed of rotation
    }
}

/** Global Parameters Object */
const params = { };

/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
const randomInt = n => Math.floor(Math.random() * n);

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

/**
 * Returns distance from two points
 * @param {Number} p1, p2 Two objects with x and y coordinates
 * @returns Distance between the two points
 */
const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};


// undocumented :) (blame abe)
const clamp = (min, val, max) => Math.min(max, Math.max(min, val));

class Animate {
    constructor() {
        throw new Error("Animate is a static class and cannot be instantiated.");
    }

    static textDisplay(text) {
        // return the entire x and y value of the text?
    }

    static easeInOut(startX, startY, endX, endY, frames) {
        let positions = [];

        for (let i = 0; i < frames; i++) {
            let progress = i / frames; // Normalize progress (0 to 1)
            let bounceEffect = this.easeInOutQuad(progress);

            let currentX = startX + (endX - startX) * bounceEffect;
            let currentY = startY + (endY - startY) * bounceEffect;

            positions.push({ x: currentX, y: currentY });
        }

        return positions;
    }

    static easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    /**
     * Simulates a falling effect with a single bounce.
     * @param {number} startY - The initial Y position (higher up).
     * @param {number} endY - The final Y position where the object lands.
     * @param {number} frames - Total number of frames for the animation.
     * @param {number} overshootFactor - How much below endY the object falls before bouncing.
     * @return {Array} - Returns an array of {x, y} positions for animation.
     */
    static bounceSpace(startY, endY, frames, overshootFactor = 0.2) {
        let positions = [];
        let overshootY = endY + (endY - startY) * overshootFactor; // Overshoot below endY

        let halfFrames = Math.floor(frames * 0.6); // Time to reach overshoot
        let bounceFrames = frames - halfFrames; // Remaining frames for bounce

        // Falling to overshoot
        for (let i = 0; i < halfFrames; i++) {
            let progress = i / halfFrames; // Normalize 0 to 1
            let easedProgress = this.easeInQuad(progress); // Fall fast
            let currentY = startY + (overshootY - startY) * easedProgress;
            positions.push({ x: 0, y: currentY });
        }

        // Bouncing up to settle at endY
        for (let i = 0; i < bounceFrames; i++) {
            let progress = i / bounceFrames; // Normalize 0 to 1
            let easedProgress = this.easeOutQuad(progress); // Bounce slows down
            let currentY = overshootY + (endY - overshootY) * easedProgress;
            positions.push({ x: 0, y: currentY });
        }

        return positions;
    }

    /**
     * Ease-in function (falling phase, starts slow, speeds up)
     */
    static easeInQuad(t) {
        return t * t;
    }
    
    /**
     * Simulates a skew effect that peaks at the midpoint of an animation.
     * @param {number} frames - Total frames for animation.
     * @return {Array} - Returns an array of skew values.
     */
    static skewEffect(frames) {
        let skews = [];
        
        for (let i = 0; i < frames; i++) {
            let progress = i / frames; // Normalize progress (0 to 1)
            
            // Skew peaks at 50% progress, then eases back to 0
            let skewAmount = Math.sin(progress * Math.PI) * 0.5; // Max skew = ±0.5
            
            skews.push(skewAmount);
        }
        
        return skews;
    }


    /**
     * Ease-out function (bounce phase, starts fast, slows down)
     */
    static easeOutQuad(t) {
        return 1 - (1 - t) * (1 - t);
    }
    static hit() {

    }
}

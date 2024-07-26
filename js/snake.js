/**
 * Represents the snake object in the game, including its position, size, speed, direction, and tail.
 * @property {number} x - The x-coordinate of the snake's head.
 * @property {number} y - The y-coordinate of the snake's head.
 * @property {number} size - The number of segments in the snake's body.
 * @property {number} speed - The delay (in milliseconds) between each movement of the snake.
 * @property {string} direction - The current direction the snake is moving (up, down, left, or right).
 * @property {Array<{x: number, y: number}>} tail - An array of objects representing the positions of the snake's tail segments.
 * @property {function} increaseSpeed - A function that increases the snake's speed based on the current score.
 * @property {number} speedCap - The minimum speed the snake can reach.
 */
export class Snake {
  constructor({ startDirection }) {
    this.x = 0;
    this.y = 0;
    this.size = 3;
    this.speed = 1000; //is used for delay. the lower, the faster the snake will move
    this.direction = startDirection; // Default direction, update this as needed
    this.tail = [];
    this.speedCap = 50;
  }

  increaseSpeed({ decreaseAmount }) {
    console.log(this.speed);
    console.log(this.speed - decreaseAmount);
    if (this.speed - decreaseAmount < this.speedCap) {
      this.speed = this.speedCap;
    } else {
      this.speed -= decreaseAmount;
    }
    console.log(this.speed);
  }
}

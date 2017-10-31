// Enemies our player must avoid
class Enemy {
  constructor(speed, lane) {
    this.sprite = 'images/enemy-bug.png';
    this.lane = lane;
    this.x = 1;
    this.y = this.getYCoord();
    this.speed = speed; //px per second
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x + this.speed * dt);
    if (this.x === 0 || this.x > 505) {
      this.speed = App.getRandomIntInclusive(...App.getSpeedRange()); //speed
      this.lane = App.getRandomIntInclusive(1, 3); //lane
      this.x = 1;
      this.y = this.getYCoord();
    }
  }
  // Draw the enemy on the screen, required method for game
  render() {
    window.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y);
  }
  getYCoord() {
    return this.lane * 83 - 22;
  }
}

class Player {
  constructor() {

  }
  update(dt) {

  }
  render() {

  }
  handleInput(keyPressed) {

  }
}

class App {
  constructor() {
    this.stopRendering = false;
    this.player = new Player();
    this.allEnemies = [];
    this.enemyNumber = 3;
    for (var i = 0; i < this.enemyNumber; i++) {
      this.allEnemies.push(new Enemy(
        App.getRandomIntInclusive(...App.getSpeedRange()), //speed
        App.getRandomIntInclusive(1, 3))); //lane
    }
    document.getElementById('btn-stop').addEventListener('click', () => {
      this.stopRendering = true;
    });
  }
  getEnemies() {
    return this.allEnemies;
  }
  getPlayer() {
    return this.player;
  }
  isStopRendering() {
    return this.stopRendering;
  }
  static getRandomIntInclusive(min, max) {
    //the algorithm is taken from the article on Math.random() on developer.mozilla.org
    const rand = Math.random();
    return Math.floor(rand * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }
  static getSpeedRange() {
    return [100, 400];
  }
}

const app = new App(); //eslint-disable-line no-unused-vars


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  app.getPlayer().handleInput(allowedKeys[e.keyCode]);
});

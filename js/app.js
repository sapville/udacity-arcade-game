// Enemies our player must avoid
class Enemy {
  constructor(speed, lane) {
    this.sprite = 'images/enemy-bug.png';
    this.x = 1;
    this.y = lane*83 - 22;
    this.lane = lane;
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
      this.x = 1;
    }
  }
  // Draw the enemy on the screen, required method for game
  render() {
    window.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y);
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
  constructor(enemyNumber) {
    this.stopRendering = false;
    this.player = new Player();
    this.allEnemies = [];
    this.enemyNumber = enemyNumber;
    for (var i = 0; i < enemyNumber; i++) {
      this.allEnemies.push(new Enemy(200, i+1));
    }
    document.getElementById('btn-stop').addEventListener('click',() => {this.stopRendering = true;});
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
}

const app = new App(3); //eslint-disable-line no-unused-vars


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

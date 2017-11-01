/*globals
  Constants
 */
// Enemies our player must avoid
class Enemy {
  constructor(speed, lane) {
    this.sprite = 'images/enemy-bug.png';
    this.lane = lane;
    this.x = 1;
    this.y = App.getYCoord(this.lane);
    this.speed = speed; //px per second
    this.width = 50;
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x + this.speed * dt);
    if (this.x === 0 || this.x > Constants.canvasSize.width) {
      this.speed = App.getRandomIntInclusive(...App.getSpeedRange()); //speed
      this.lane = App.getRandomIntInclusive(1, 3); //lane
      this.x = 1;
      this.y = App.getYCoord(this.lane);
    }
    app.collisionCheck(this, this.lane, this.x + this.width); //adjust coordinates to the widht of the enemy
  }
  // Draw the enemy on the screen, required method for game
  render() {
    window.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y);
  }
}

class Player {
  constructor(mile) {
    this.sprite = 'images/char-cat-girl.png';
    this.lane = 4;
    this.mile = mile;
    this.x = App.getXCoord(this.mile);
    this.y = App.getYCoord(this.lane);
  }
  update() {
    this.x = App.getXCoord(this.mile);
    this.y = App.getYCoord(this.lane);
    app.collisionCheck(this);
  }
  render() {
    window.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y);
  }
  handleInput(keyPressed) {
    switch (keyPressed) {
      case 'left':
        this.mile = this.mile === 0 ? 0 : this.mile - 1;
        break;
      case 'right':
        this.mile = this.mile === 4 ? 4 : this.mile + 1;
        break;
      case 'up':
        this.lane = this.lane === 0 ? 0 : this.lane - 1;
        break;
      case 'down':
        this.lane = this.lane === 5 ? 5 : this.lane + 1;
        break;
    }
  }
}

class App {
  constructor() {
    this.stopRendering = false;
    this.player = new Player(App.getRandomIntInclusive(0, 4));
    this.allEnemies = [];
    this.enemyNumber = 3;
    this.bang = false;
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
  collisionCheck(caller, lane, x) {
    if (caller instanceof Enemy) {
      if (lane === this.player.lane && this.getMile(x) === this.player.mile) {
        this.bang = true;
      }
      return this.bang;
    } else if (caller instanceof Player) {
      if (this.bang) {
        this.bang = false;
        this.player.lane = 4;
        return true;
      }
    } else {
      return;
    }
  }
  getMile(x) {
    return Math.floor( x / Constants.tileSize.width);
  }
  static getRandomIntInclusive(min, max) {
    //the algorithm is taken from the article on Math.random() on developer.mozilla.org
    const rand = Math.random();
    return Math.floor(rand * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }
  static getSpeedRange() {
    return [100, 400];
  }
  static getYCoord(lane) {
    return lane * Constants.tileSize.height - 22;
  }
  static getXCoord(mile) {
    return mile * Constants.tileSize.width;
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

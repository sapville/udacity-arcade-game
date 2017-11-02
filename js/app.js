/*globals
  Constants
 */
class Entity {
  constructor (sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
  }

  render () {
    window.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y);
  }
}

// Enemies our player must avoid
class Enemy extends Entity {
  constructor (speed, lane) {
    super('images/enemy-bug.png', 1, App.getYCoord(lane));
    this.lane = lane;
    this.speed = speed; //px per second
    this.width = 50;
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (app.isParading || app.blinking) {
      return;
    }
    this.x = this.x + this.speed * dt;
    if (this.x === 0 || this.x > Constants.canvasSize.width) {
      this.speed = App.getRandomIntInclusive(...App.getSpeedRange()); //speed
      this.lane = App.getRandomIntInclusive(1, 3); //lane
      this.x = 1;
      this.y = App.getYCoord(this.lane);
    }
    app.collisionCheck(this, this.lane, this.x + this.width); //adjust coordinates to the width of the enemy
  }
}

class Player extends Entity {
  constructor (mile) {
    super('images/char-cat-girl.png', App.getXCoord(mile), App.getYCoord(4));
    this.sprite = 'images/char-cat-girl.png';
    this.lane = 4;
    this.mile = mile;
    this.hide = false;
  }

  update () {
    if (app.isParading || app.blinking) {
      return;
    }
    this.x = App.getXCoord(this.mile);
    this.y = App.getYCoord(this.lane);
    if (this.lane === 0) {
      app.parade();
    } else {
      app.collisionCheck(this);
    }
  }
  blink() {
    const interval = window.setInterval(() => {
      this.hide = !this.hide;
    }, 100);
    window.setTimeout(() => {
      this.hide = false;
      app.blinking = false;
      this.lane = 4;
      window.clearInterval(interval);
    }, 1000);
  }
  render () {
    if (!(app.blinking && this.hide)) {
      super.render();
    }
  }

  handleInput (keyPressed) {
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
  constructor () {
    this.stopRendering = false;
    this.isParading = false;
    this.player = new Player(App.getRandomIntInclusive(0, 4));
    this.allEnemies = [];
    this.stars = [];
    this.enemyNumber = 3;
    this.bang = false;
    this.blinking = false;
    for (let i = 0; i < this.enemyNumber; i++) {
      this.allEnemies.push(new Enemy(
        App.getRandomIntInclusive(...App.getSpeedRange()), //speed
        App.getRandomIntInclusive(1, 3))); //lane
    }
    document.getElementById('btn-stop').addEventListener('click', () => {
      this.stopRendering = true;
    });
  }

  getStars () {
    return this.stars;
  }

  getEnemies () {
    return this.allEnemies;
  }

  getPlayer () {
    return this.player;
  }

  isStopRendering () {
    return this.stopRendering;
  }

  collisionCheck (caller, lane, x) {
    if (caller instanceof Enemy) {
      if (lane === this.player.lane && App.getMile(x) === this.player.mile) {
        this.bang = true;
      }
      return this.bang;
    }
    if (caller instanceof Player) {
      if (this.bang) {
        this.bang = false;
        this.blinking = true;
        this.player.blink();
        return true;
      } else {
        return false;
      }
    }
  }

  parade () {
    let i = 0;
    this.isParading = true;
    App.getUniqueRandoms(0, 4, 5).forEach((mile) => { //
      window.setTimeout(() => { //
        this.stars.push(new Star(mile));
      }, 1000 * i++);
    });
    /*window.setTimeout(() => {
      this.stars.push(new Star(0, false));
      }, 1000 * 5);
*/
  }


  //do not use when the size is large
  static getUniqueRandoms (min, max, size) {
    const randoms = new Set();
    //one can insert only unique values to sets; try to insert a new value until all of them are unique
    while (randoms.size < size) {randoms.add(App.getRandomIntInclusive(min, max));}
    return randoms;

  }

  static getMile (x) {
    return Math.floor(x / Constants.tileSize.width);
  }

  static getRandomIntInclusive (min, max) {
    //the algorithm is taken from the article on Math.random() on developer.mozilla.org
    const rand = Math.random();
    return Math.floor(rand * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  static getSpeedRange () {
    return [100, 400];
  }

  static getYCoord (lane) {
    return lane * Constants.tileSize.height - 22;
  }

  static getXCoord (mile) {
    return mile * Constants.tileSize.width;
  }

}

class Star extends Entity {
  constructor (mile) {
    super('images/Star.png', App.getXCoord(mile), 1);
    this.speed = 90;
  }

  update (dt) {
    this.y = this.y + this.speed * dt;
    if (this.y > Constants.canvasSize.height - 170) {
      this.y = 1;
    }
  }

  render () {
    if (!this.hidden) {
      super.render();
    }
  }
}

const app = new App();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  const allowedKeys = { // jshint ignore:line
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  app.getPlayer().handleInput(allowedKeys[e.keyCode]);
});

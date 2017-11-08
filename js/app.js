/*globals
  Constants
 */

/**
 * The class manages the entire application
 */
class App {
  constructor () {
    // this.stopRendering = false;

    //attributes
    this.status = Constants.appStatus.initial;
    this.player = new Player(App.getRandomIntInclusive(0, 4));
    this.failures = 0; //number of attempts
    this.allEnemies = [];
    this.stars = [];
    this.gems = [];
    this.stones = [];
    this.gemPics = [
      'images/Gem Blue.png',
      'images/Gem Green.png',
      'images/Gem Orange.png'
    ];

    //set initial state
    const slBug = document.querySelector('.sl-input-bug');
    const slGem = document.querySelector('.sl-input-gem');
    slBug.value = 3;
    slGem.value = 3;
    this.enemyNumber = slBug.value;
    this.gemNumber = slGem.value;
    document.querySelector('#lb-bugs').textContent = String(slBug.value);
    document.querySelector('#lb-gems').textContent = String(slGem.value);

    //set event handlers
    slBug.oninput = function () {
      document.querySelector('#lb-bugs').textContent = String(slBug.value);
    };
    slGem.oninput = function () {
      document.querySelector('#lb-gems').textContent = String(slGem.value);
    };
    document.querySelector('#start').addEventListener('click', () => {
      this.onStartClick();
    });
    document.querySelector('#stop').addEventListener('click', () => {
      this.onStopClick();
    });
  }

  /**
   * Enable and disable controls depending on the stage of the game
   * @param enable  true - enable Start button and disable all other controls
   *                false - vice versa
   */
  enableStart (enable) {
    const btnStop = document.querySelector('#stop');
    const btnStart = document.querySelector('#start');
    btnStop.disabled = enable;
    btnStart.disabled = !enable;
    btnStop.classList.toggle('button-inactive');
    btnStart.classList.toggle('button-inactive');
    document.querySelectorAll('.sl-number').forEach(
      (elem) => {
        elem.classList.toggle('sl-input-inactive');
      }
    );
    document.querySelectorAll('.sl-input').forEach((elem) => {
      elem.disabled = !enable;
      elem.classList.toggle('sl-input-inactive');
    });
  }

  getStars () {
    return this.stars;
  }

  getGems () {
    return this.gems;
  }

  clearStones () {
    App.clearEntities(this.stones);
  }

  setCTX (ctx) {
    this.ctx = ctx;
  }

  getStones () {
    return this.stones;
  }

  getEnemies () {
    return this.allEnemies;
  }

  getPlayer () {
    return this.player;
  }

  /*
    isStopRendering () {
      return this.stopRendering;
    }
  */

  onStartClick () {
    this.status = Constants.appStatus.waitingForStart;
    App.clearEntities(this.stars);      //empty the array with stars
    App.clearEntities(this.allEnemies); //empty the array with enemies

    this.enemyNumber = document.querySelector('.sl-input-bug').value;
    this.gemNumber = document.querySelector('.sl-input-gem').value;
    //create new enemies
    for (let i = 0; i < this.enemyNumber; i++) {
      this.allEnemies.push(new Enemy(
        App.getRandomIntInclusive(...App.getSpeedRange()), //speed
        App.getRandomIntInclusive(1, 3))); //lane
    }

    //create new gems
    this.scatterGems();

    //set initial values
    this.player.lane = 4;
    this.failures = 0;
    document.querySelector('#fail-num').textContent = String(this.failures);

    //disable other controls and enable Stop button
    this.enableStart(false);
  }

  onStopClick () {
    this.status = Constants.appStatus.initial;

    //clear all entities
    App.clearEntities(this.stones);
    App.clearEntities(this.gems);
    App.clearEntities(this.stars);
    App.clearEntities(this.allEnemies);

    //disable Stop button and enable other controls
    this.enableStart(true);
  }

  /**
   * maintain the collision between Player end Enemy - the method is to be called within an update method
   * @param caller        an object checking the collision
   * @param lane          the lane where the collision took place
   * @param x             the x-coordinate where the collision took place
   * @returns {boolean}   true if the collision took place
   */
  collisionCheck (caller, lane, x) {
    if (caller instanceof Enemy) {
      if (lane === this.player.lane && App.getMile(x) === this.player.mile) {
        this.status = Constants.appStatus.bang; //the enemy is one who signals about collision
        document.querySelector('#fail-num').textContent = String(++this.failures);
        return true;
      }
      return false;
    }
    if (caller instanceof Player) {
      if (this.status === Constants.appStatus.bang) { // check if an enemy has sent a signal of collision
        this.status = Constants.appStatus.blinking;
        this.player.blink(); //further asynchronous actions after the collision are placed in this method
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * check if the Player found a gem
   */
  gemCheck () {
    const gemIndex = this.gems.findIndex((gem) => gem.lane === this.player.lane && gem.mile === this.player.mile);
    if (gemIndex >= 0) {
      this.gems.splice(gemIndex, 1); //if found, a gem is to be deleted
      if (this.gems.length === 0) { //if no gems are left then clear the way to the see
        this.clearStones();
        this.status = Constants.appStatus.allClear;
      }
    }
  }

  /**
   * put gems to pick up
   */
  scatterGems () {
    this.gems.splice(0, this.gems.length); //clear what have been left from a previous attempt

    const tileNumber = App.getUniqueRandoms(1, 15, this.gemNumber).values(); //get the set object containing numbers of tiles to set gems on

    for (let i = 0; i < this.gemNumber; i++) {
      this.addGem(tileNumber.next().value, this.gemPics[App.getRandomIntInclusive(0, 2)]);
    }
  }

  /**
   * build walls preventing reaching the see and returning to the grass field when the game is in progress
   */
  throwStones () {
    for (let i = 0; i < 5; i++) {
      this.stones.push(new Stone(0, i, 'images/Rock.png')); //lane 0
      this.stones.push(new Stone(4, i, 'images/Rock.png')); //lane 4
    }
  }

  /**
   * convert the sequential number of a tile to the x(mile) and y(lane) coordinates
   * @param number  the sequential number of a tile
   * @param sprite  gem image
   */
  addGem (number, sprite) {
    const lane = Math.ceil(number / 5);
    const mile = number % 5 === 0 ? 4 : number % 5 - 1;
    this.gems.push(new Gem(lane, mile, sprite));
  }

  /**
   * make star shower after the victory
   */
  parade () {
    let i = 0;
    this.status = Constants.appStatus.parading;
    this.enableStart(true); //enable Start button and other controls
    App.getUniqueRandoms(0, 4, 5).forEach((mile) => { //choose the mile for a star to fall on randomly
      window.setTimeout(() => { //
        if (this.status === Constants.appStatus.parading) {
          this.stars.push(new Star(mile)); //create one star per second
        }
      }, 1000 * i++);
    });
  }

  /**
   * clear an array with Entities
   * @param array an array to clear
   */
  static clearEntities (array) {
    if (!(array instanceof Array)) {
      return;
    }
    array.splice(0, array.length);
  }

  //do not use when the size is large
  /**
   * get the set with unique integer values within a given range in a random order
   * @param min     the minimal value of the range
   * @param max     the maximum value of the range
   * @param size    the size of the range
   * @returns {Set}
   */
  static getUniqueRandoms (min, max, size) {
    const randoms = new Set();
    //one can insert only unique values to sets; try to insert a new value until all of them are unique
    while (randoms.size < size) {randoms.add(App.getRandomIntInclusive(min, max));}
    return randoms;
  }

  /**
   * get a random integer value within a given range
   * @param min   the minimal value of the range
   * @param max   the maximum value of the range
   * @returns {*}
   */
  static getRandomIntInclusive (min, max) {
    //the algorithm is taken from the article on Math.random() on developer.mozilla.org
    const rand = Math.random();
    return Math.floor(rand * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  /**
   * return the range within which the enemy speed lies (the wider the range the more speed will differ, the larger the values the faster enemies will move)
   * @returns {[number,number]}
   */
  static getSpeedRange () {
    return [100, 400];
  }

  /**
   * get the x-number of a tile by its x-coordinate in pixels
   * @param x
   * @returns {number}
   */
  static getMile (x) {
    return Math.floor(x / Constants.tileSize.width);
  }

  /**
   * get the y-coordinate of a tile in pixels
   * @param lane        y-number of a tile
   * @returns {number}  y-coordinate in pixels
   */
  static getYCoord (lane) {
    return lane * Constants.tileSize.height - 22;
  }

  /**
   * get the x-coordinate of a tile in pixels
   * @param mile        x-number of a tile
   * @returns {number}  x-coordinate in pixels
   */
  static getXCoord (mile) {
    return mile * Constants.tileSize.width;
  }

}

/**
 * Superclass for all objects appearing on the field
 */
class Entity {
  /**
   * @param sprite  entity image
   * @param x       initial x-coordinate
   * @param y       initial y-coordinate
   */
  constructor (sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
  }

  render () {
    app.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y);
  }
}

/**
 * Enemies our player must avoid
 */
class Enemy extends Entity {
  /**
   * @param speed   px per second
   * @param lane    lane number beginning with 0
   */
  constructor (speed, lane) {
    super('images/enemy-bug.png', 1, App.getYCoord(lane));
    this.lane = lane;   //the row a bug assigned to
    this.speed = speed;
    this.width = 50;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The method is called from the engine and calculates the coordinate of the entity before rendering
   * @param dt  The time between two renderings - allows to adjust to the performance of a PC app is run on
   */
  update (dt) {
    if (app.status === Constants.appStatus.parading || app.status === Constants.appStatus.blinking) {
      return;
    }
    this.x = this.x + this.speed * dt;
    if (this.x === 0 || this.x > Constants.canvasSize.width) {
      this.speed = App.getRandomIntInclusive(...App.getSpeedRange());
      this.lane = App.getRandomIntInclusive(1, 3);
      this.x = 1;
      this.y = App.getYCoord(this.lane);
    }
    app.collisionCheck(this, this.lane, this.x + this.width); //adjust coordinates to the width of the enemy
  }
}

/**
 * A character to play with
 */
class Player extends Entity {
  /**
   * @param mile  initial mile
   */
  constructor (mile) {
    super('images/char-cat-girl.png', App.getXCoord(mile), App.getYCoord(4));
    this.sprite = 'images/char-cat-girl.png';
    this.lane = 4;        //the row number where the player is situated
    this.mile = mile;     //the column number where the player is situated
    this.hide = false;    //used for blinking after collision with an enemy
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * see the comment to Enemy->update method (except for dt parameter - there is no need for it since the player doesn't have the speed of its own)
   */
  update () {
    if (app.status === Constants.appStatus.parading || app.status === Constants.appStatus.blinking) {
      return;
    }
    this.x = App.getXCoord(this.mile);
    this.y = App.getYCoord(this.lane) + 11; //make an adjustment for the height of the player's body

    // noinspection JSCheckFunctionSignatures
    if (app.collisionCheck(this)) {
      return;
    }
    switch (app.status) {
      case Constants.appStatus.allClear:
        if (this.lane === 0) { //the player reached to the last lane; hence victory;
          app.parade();
        }
        break;
      case Constants.appStatus.gameInProgress:
        app.gemCheck();  //if the player found a gem?
        break;
      case Constants.appStatus.waitingForStart:
        if (this.lane === 3) { //the player is out for a game (left the green field)
          app.status = Constants.appStatus.gameInProgress;
          app.throwStones();
        }
        break;
      default:
    }
  }

  /**
   * after the collision with an enemy the player should be blinking for a while and then start from the beginning
   */
  blink () {
    const interval = window.setInterval(() => {
      this.hide = !this.hide; //blink every 0.1 second
    }, 100);
    window.setTimeout(() => { //after a second of blinking the player returns to the start point
      this.hide = false;
      app.status = Constants.appStatus.waitingForStart;
      app.scatterGems();
      app.clearStones();
      this.lane = 4;
      window.clearInterval(interval);
    }, 1000);
  }

  /**
   * to implement blinking the Entity's render method should be redefined
   */
  render () {
    if (!(app.status === Constants.appStatus.blinking && this.hide)) {
      super.render();
    }
  }

  /**
   * control the player
   * @param keyPressed    the code passed from the 'keyup' event handler
   */
  handleInput (keyPressed) {
    switch (keyPressed) {
      case 'left':
        this.mile = this.mile === 0 ? 0 : this.mile - 1; //if the player reached the edge it cannot move further
        break;
      case 'right':
        this.mile = this.mile === 4 ? 4 : this.mile + 1;
        break;
      case 'up':
        if (app.status === Constants.appStatus.gameInProgress && this.lane === 1) { //the last lane is fenced with the wall during the game
          break;
        }
        this.lane = this.lane === 0 ? 0 : this.lane - 1;
        break;
      case 'down':
        if (app.status === Constants.appStatus.gameInProgress && (this.lane === 3)) {
          break;
        }
        this.lane = this.lane === 5 ? 5 : this.lane + 1;
        break;
    }
  }
}

/**
 * stars falling during the parade after victory
 */
class Star extends Entity {
  /**
   * @param mile  the column the star is assigned to
   */
  constructor (mile) {
    super('images/Star.png', App.getXCoord(mile), 1);
    this.speed = 90;
  }

  // noinspection JSUnusedGlobalSymbols
  update (dt) {
    this.y = this.y + this.speed * dt;
    if (this.y > Constants.canvasSize.height - 170) { //stars shouldn't fall all the way to the end
      this.y = 1;
    }
  }
}

/**
 * gems to be collected by the player
 */
class Gem extends Entity {
  constructor (lane, mile, sprite) {
    super(sprite, App.getXCoord(mile) + 20, App.getYCoord(lane) + 42);
    this.lane = lane;
    this.mile = mile;
  }

  /**
   * redefine the Entity's method to make gems smaller
   */
  render () {
    app.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y, 63, 106);
  }
}

/**
 * stones to build a wall from
 */
class Stone extends Entity {
  constructor (lane, mile, sprite) {
    super(sprite, App.getXCoord(mile), App.getYCoord(lane) + 6); //shift stones lower
  }
}

const app = new App();

document.addEventListener('keyup', function (e) {
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  app.getPlayer().handleInput(allowedKeys[e.keyCode]);
});

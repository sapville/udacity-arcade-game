# Gameplay

## Controls
- **Player** - the character you can control by keys `Left`, `Right`, `Up`, `Down`
- **Bugs** - the slider determining the number of bugs the character struggles with.
- **Gems** - the slider determining the number of gems the character is to pick up.
- **Start** - the button starting the game
- **Stop** - the button ceasing the game before its logical end
- **Failed** - the field showing the number of tries

## Give it a try!
You can play [here](https://sapville.github.io/udacity-arcade-game/).

## Description
The goal of the game is to make the character reach the opposite side of the board having picked up all the gems scattered around and avoided collisions with bugs.
##Process
At the initial stage there is not much to do - the player is able to move around the board in any direction.

When the button `Start` is pushed the enemy is brought into play - the bugs running upon the paved tiles. As well as that the gems to collect are placed among bugs. The player is still safe staying on green grass and can work out a strategy.

After the player leaves the green field the game begins in earnest. The player is prevented from either returning to the safety of green or advancing to the sea by stone walls. The only way to get rid of them is to collect all the gems.

When all the gems are gathered and the way is clear all the player has to do is to reach the last lane (aka the sea) and the game ends. Having achieved that, the user can adjust the difficulty with two sliders (see Controls section) and restart the game pushing `Start` button.

# Program
## Used libraries and frameworks
The program uses the resources provided as a part of Udacity FEND Nanodegree course:
- images;
- the engine, which maintains the interaction with Canvas elements and implements rendering.

## Structure

### JS Files
- `engine.js` - contains functions interacting with HTML Canvas element (provided);
- `resources.js` - contains functions loading and caching images (provided);
- `constants.js` - contains constants used throughout the project (developed);
- `app.js` - constants the main logic of the game (developed);

# Further development

## Gameplay
- After the game ends offer the user to increase the difficulty level and show the failure statistics at different levels.
- Add scoring
- Show user's maximum score
- Add a description of the game on a modal screen before the game starts

## Refactoring
- change existing asynchronous algorithms to ones using Promises;
- use private class attributes utilizing WeakMaps.

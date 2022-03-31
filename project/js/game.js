/**
 * Creates a new game. 
 * @class
 * 
 * @property {Array} map - 2D array storing integer codes
 * @property {Array} shadow - 2D array holding a map of the shadow
 * @property {Boolean} isShadowToggled - is shadow on or off? 
 * @property {HTMLElement} canvas - the DOM element
 * @property {Object} context - the bundle of drawing methods tied to the canvas
 */
class Game {
   constructor() {
      this.rooms = [];
      this.curRoomId = 0;

      this.map = [];
      this.shadow = [];

      this.isShadowToggled = false;

      this.enemies = [];
      this.canvas = null;

      this.context = null;
   }
}
/**
 * Reset all level-specific properties
 * 
 */
Game.prototype.reset = function() {
   this.enemies = [];
   this.shadow = [];
   this.map = [];
   this.rooms = []
}
/**
 * @TODO: Fill the entire game map with wall tiles.
 */ 
Game.prototype.resetMap = function() {

}

/**
 * @TODO: Return TRUE if the passed-in coordinate is in at least one room.
 */ 
Game.prototype.inRoom = function({x,y}) {
   
}

/**
 * @TODO: Add floor tiles to the 2D game map that correspond
 *        to the start and end coordinates of th passed-in path.
 * 
 * @param {Object} path
 */ 
Game.prototype.addPath = function(path) {
 
   
}

/**
 * @TODO: Add floor tiles ot the 2D game map that correspond
 *        to the start and end coordinates of the passed-in room.
 */ 
Game.prototype.carveRoom = function(room) {

}




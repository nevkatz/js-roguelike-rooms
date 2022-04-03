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
 * Resets the game map by filling it with a solid mass of wall.
 */ 
Game.prototype.resetMap = function() {

   this.map = [];
   // generate a solid wall.
   for (var row = 0; row < ROWS; row++) {
      // create row
      this.map.push([]);

      for (var col = 0; col < COLS; col++) {
         // create wall
         this.map[row].push(WALL_CODE);
      }
   }
}
/**
 * Adds floor tiles ot the 2D game map that correspond
 * to the start and end coordinates of the passed-in room.
 */ 
Game.prototype.carveRoom = function(room) {

   for (var y = room.start.y; y <= room.end.y; ++y) {
      for (var x = room.start.x; x <= room.end.x; ++x) {

         this.map[y][x] = FLOOR_CODE;
      }
   }
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
 * @LATER: Return TRUE if the passed-in coordinate is in at least one room.
 */ 
Game.prototype.inRoom = function({x,y}) {
   
}






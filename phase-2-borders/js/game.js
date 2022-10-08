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

Game.prototype.inRoom = function({x,y}) {
   return this.rooms.find(r => r.encloses(x,y));
}



Game.prototype.resetMap = function() {

   this.map = [];
   this.shadow = [];
   // generate a solid wall.
   for (var row = 0; row < ROWS; row++) {
      // create row
      this.map.push([]);
      this.shadow.push([]);

      for (var col = 0; col < COLS; col++) {
         // create wall
         this.map[row].push(EMPTY_CODE);
         this.shadow[row].push(SHADOW_CODE);
      }
   }
}

Game.prototype.addBorder = function(room) {
   let start = {
      x:room.start.x -1,
      y:room.start.y -1
   };
   let end = {
      x:room.end.x + 1,
      y:room.end.y + 1
   };
   for (let x = start.x; x <= end.x; ++x) {

      this.map[start.y][x] = BORDER_CODE;
      this.map[end.y][x] = BORDER_CODE;
   }
   for (let y = start.y; y <= end.y; ++y) {

    this.map[y][start.x] = BORDER_CODE;
    this.map[y][end.x] = BORDER_CODE;
   }
}
Game.prototype.addRoom = function(room) {

   for (let y = room.start.y; y <= room.end.y; ++y) {
      for (let x = room.start.x; x <= room.end.x; ++x) {

         this.map[y][x] = FLOOR_CODE;
      }
   }

}




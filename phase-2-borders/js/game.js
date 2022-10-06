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

Game.prototype.addPathHoriz = function(path) {
   const y = path.start.y;

   // border
   for (let x = path.start.x-1; x <= path.end.x+1; ++x) {

      for (let dy of [y-1,y+path.width]) {
          if (game.map[dy][x] != FLOOR_CODE) {
             game.map[dy][x] = BORDER_CODE;
          }
      }
   }
   for (let x = path.start.x; x <= path.end.x; ++x) {

         for (let z = 0; z < path.width; ++z) {
            game.map[y+z][x] = FLOOR_CODE;
         }
   }
}

Game.prototype.addPathVert = function(path) {
   
   const x = path.start.x;
   // border
   for (let y = path.start.y; y <= path.end.y+1; ++y) {
      for (let dx of [x-1,x+path.width]) {
         if (game.map[y][dx] != FLOOR_CODE) {
            game.map[y][dx] = BORDER_CODE;
         }
      }
   }

   for (let z = 0; z < path.width; ++z) {

     for (let y = path.start.y; y <= path.end.y; ++y) {
           game.map[y][x+z] = FLOOR_CODE;
         }
         if (path.doorTop) {
               game.map[path.start.y][x+z] = DOOR_CODE; 
         }
         if (path.doorBot) {

              game.map[path.end.y][x+z] = DOOR_CODE;
              game.map[path.end.y+1][x+z] = DOOR_CODE;

         }
   }
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
Game.prototype.addTopWall = function(room) {

   let {start,end} = room;
   for (let x = start.x; x <= end.x; ++x) {
      this.map[start.y][x] = WALL_CODE;
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




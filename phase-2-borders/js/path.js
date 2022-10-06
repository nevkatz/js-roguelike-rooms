class Path {

   constructor(doorTop=false, doorBot=false) {

      this.start = {
         x: 0,
         y: 0,
         corner:0
      };

      this.end = {
         x: 0,
         y: 0,
         corner:0
      };
      this.doorTop = doorTop;
      this.doorBot = doorBot;

      this.floorSpan= 2;

      this.allowed = false;

   }
}
/**
 * @param {Number} testX
 */ 
Path.prototype.isAdjacentVert = function(testX) {
   
   const limit = 5;

   const x = testX || this.start.x;

   for (var diff of [-1, 1]) {

      let consecutive = 0;

      for (var y = this.start.y; y <= this.end.y; ++y) {

         const z = diff * this.floorSpan;
         if (game.map[y][x + z] == FLOOR_CODE) {
            consecutive++;

            if (consecutive == limit) {
               return true;
            }

         } else {
            consecutive = 0;
         }
      }

   }
   return false;
}

Path.prototype.isAdjacentHoriz = function(testY) {

   const limit = 5;

   const y = testY || this.start.y;

   for (let diff of [-1, 1]) {

      let consecutive = 0;

      for (var x = this.start.x; x <= this.end.x; ++x) {
         const z = diff*this.floorSpan;
         if (game.map[y + z] &&
            game.map[y + diff][x] == FLOOR_CODE) {
            consecutive++;

            if (consecutive == limit) {
               return true;
            }

         } else {
            consecutive = 0;
         }
      }
   }
   return false;
}

Path.prototype.addHoriz = function() {
   const y = this.start.y;

   this.addHorizBorder();
  
   for (let x = this.start.x; x <= this.end.x; ++x) {

         for (let z = 0; z < this.floorSpan; ++z) {
            game.map[y+z][x] = EMPTY_CODE;
         }
   }
}


Path.prototype.addVert = function() {
   
   const x = this.start.x;

   this.addVertBorder();

   for (let z = 0; z < this.floorSpan; ++z) {

     for (let y = this.start.y; y <= this.end.y; ++y) {
           game.map[y][x+z] = WALL_CODE;
         }
         if (this.doorTop) {
               game.map[this.start.y][x+z] = DOOR_CODE; 
         }
         if (this.doorBot) {

              game.map[this.end.y][x+z] = DOOR_CODE;
              game.map[this.end.y+1][x+z] = DOOR_CODE;

         }
   }
}
Path.prototype.addHorizBorder = function() {
   
   const {y} = this.start;

   for (let x = this.start.x; x <= this.end.x; ++x) {

      for (let dy of [y-1,y+this.floorSpan]) {
          if (game.map[dy][x] != FLOOR_CODE) {
             game.map[dy][x] = BORDER_CODE;
          }
      }
   }

   const top = this.start.y - 1;
   const bot = this.end.y + 1;
   const before = this.start.x - 1;
   const after = this.end.x + 1;


   // works
   if (this.start.corner == CORNER_TOP) {
       game.map[top][before]= BLOCK_CODE;
   }
   // does not work
   if (this.end.corner == CORNER_BOT) {
      game.map[bot][before] = WEAPON_CODE;
   }
   // works
   if (this.end.corner == CORNER_TOP) {
      game.map[top][after]= POTION_CODE;
   }
   // does not work
   if (this.end.corner == CORNER_BOT) {
      game.map[bot][after] = WALL_CODE;
   }

};
Path.prototype.addVertBorder = function() {

   const {x} = this.start;
   for (let y = this.start.y; y <= this.end.y; ++y) {
      for (let dx of [x-1, x+this.floorSpan]) {

         if (game.map[y][dx] != FLOOR_CODE) {
            game.map[y][dx] = KEY_CODE;
         }
      }
   }
   const left = this.start.x - 1;
   const right = this.end.x + 1;

   const before = this.start.y - 1;
   // this seems correct.
   const after = this.end.y;
  // const afterFar = this.end.y + this.floorSpan + 1;


   if (this.start.corner == CORNER_LEFT) {
      game.map[before][left] = RELIC_CODE;
   }
   // not working yet
   if (this.start.corner == CORNER_RIGHT) {
      game.map[before][right] = WEAPON_CODE;
   }
   // works
   if (this.end.corner == CORNER_LEFT) {
      game.map[after][left] = PLAYER_CODE;
   }
   // works but gets obscured by the floor code
   if (this.end.corner == CORNER_RIGHT) {
      game.map[after][right] = ENEMY_CODE;
   }

};
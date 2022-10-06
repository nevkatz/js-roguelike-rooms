class Path {

   constructor(doorTop=false, doorBot=false) {

      this.start = {
         x: 0,
         y: 0,
         corner:false
      };

      this.end = {
         x: 0,
         y: 0,
         corner:false
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
Path.prototype.addHorizBorder = function() {
   
   const {y} = this.start;

   for (let x = this.start.x; x <= this.end.x; ++x) {

      for (let dy of [y-1,y+this.floorSpan]) {
          if (game.map[dy][x] != FLOOR_CODE) {
             game.map[dy][x] = BORDER_CODE;
          }
      }
   }

};
Path.prototype.addHoriz = function() {
   const y = this.start.y;

   this.addHorizBorder();
  
   for (let x = this.start.x; x <= this.end.x; ++x) {

         for (let z = 0; z < this.floorSpan; ++z) {
            game.map[y+z][x] = FLOOR_CODE;
         }
   }
}

Path.prototype.addVertBorder = function() {

   const {x} = this.start;
   for (let y = this.start.y; y <= this.end.y; ++y) {
      for (let dx of [x-1,x+this.floorSpan]) {

         if (game.map[y][dx] != FLOOR_CODE) {
            game.map[y][dx] = BORDER_CODE;
         }
      }
   }

}
Path.prototype.addVert = function() {
   
   const x = this.start.x;
   // border
   this.addVertBorder();

   for (let z = 0; z < this.floorSpan; ++z) {

     for (let y = this.start.y; y <= this.end.y; ++y) {
           game.map[y][x+z] = FLOOR_CODE;
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
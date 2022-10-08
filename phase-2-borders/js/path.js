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
            game.map[y+z][x] = FLOOR_CODE;
         }
   }
}

Path.prototype.addDoor = function(x,y) {
   const doorHeight = 2;
   for (let i = 0; i < doorHeight; ++i) {
         game.map[y+i][x] = DOOR_CODE; 

   }
}
Path.prototype.addVert = function() {
   
   const x = this.start.x;

   this.addVertBorder();

   for (let z = 0; z < this.floorSpan; ++z) {

         for (let y = this.start.y; y <= this.end.y; ++y) {
           game.map[y][x+z] = FLOOR_CODE;
         }
         if (this.doorBot) {
            this.addDoor(x+z, this.end.y);
         }
         else if (this.doorTop) {
               this.addDoor(x+z,this.start.y)
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
   const beforeX = this.start.x - 1;
   const afterX = this.end.x + 1;


   if (this.start.corner == CORNER_TOP) {
       this.addBorder(beforeX,bot);
   }

   /***
    *    (*)-------(*)
    *    |
    *    |
    *   (*)
    */ 
  /* if (this.end.corner == CORNER_BOT) {
      game.map[bot][this.start.x] = ENEMY_CODE;
   }*/

   if (this.end.corner == CORNER_TOP) {
      this.addBorder(afterX,top);
   }
   /**
    *        |  |
    *        |  |
    *   -----*  |
    *           |
    *   -------(*)
    * 
    */ 
   if (this.end.corner == CORNER_BOT) {
      this.addBorder(afterX,bot);
   }

};
Path.prototype.addBorder = function(x,y) {

   let arr = [FLOOR_CODE,DOOR_CODE,WALL_CODE];

   if (!arr.includes(game.map[y][x])) {

        game.map[y][x] = BORDER_CODE;
   }
}
Path.prototype.addVertBorder = function() {

   const {x} = this.start;
   for (let y = this.start.y; y <= this.end.y; ++y) {
      for (let dx of [x-1, x+this.floorSpan]) {

         this.addBorder(dx,y);
      }
   }
   const left = this.start.x - 1;
   const right = this.end.x + 1;

   const before = this.start.y - 1;
   // this seems correct.
   const after = this.end.y;
  // const afterFar = this.end.y + this.floorSpan + 1;


   if (this.start.corner == CORNER_LEFT) {
      this.addBorder(left,before);
   }
   // not working yet
   if (this.start.corner == CORNER_RIGHT) {
      this.addBorder(right,before);
   }
   // works
   if (this.end.corner == CORNER_LEFT) {
      this.addBorder(left,after);
   }
   // works but gets obscured by the floor code
   if (this.end.corner == CORNER_RIGHT) {
      this.addBorder(right,after);
   }

};
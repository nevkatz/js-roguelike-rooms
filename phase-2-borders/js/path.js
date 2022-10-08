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

   const arr = [FLOOR_CODE,BORDER_CODE,DOOR_CODE];

   let left = x-2;
   let right = x+2;// x+this.floorSpan;
   for (var checkX of [left,right]) {

      let consecutive = 0;

      for (var y = this.start.y; y <= this.end.y; ++y) {

         const tileCode = game.map[y][checkX];
         if (arr.includes(tileCode)) {
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

   const limit = 4;

   const y = testY || this.start.y;

   const arr = [FLOOR_CODE,BORDER_CODE,DOOR_CODE];

   const top = y-2;
   const bot = y+2; //y+this.floorSpan;
   for (let checkY of [top,bot]) {

      let consecutive = 0;

      for (var x = this.start.x; x <= this.end.x; ++x) {
         
         if (game.map[checkY] &&
            !arr.includes(game.map[checkY][x])) {
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

Path.prototype.addHalfDoor = function(x,y,z) {
   const doorHeight = 2;

   if (game.map[y + z][x] != DOOR_CODE) {
     for (let i = 0; i < doorHeight; ++i) {
         game.map[y+i][x] = DOOR_CODE; 

     }
   }
   else {
      console.log('another door was in the way...');
   }
   /**
    * @TODO: Add door to game
    */ 
}
Path.prototype.addVert = function() {
   
   const x = this.start.x;

   this.addVertBorder();

   for (let z = 0; z < this.floorSpan; ++z) {
         const dx = x+z;
         for (let y = this.start.y; y <= this.end.y; ++y) {
           game.map[y][dx] = FLOOR_CODE;
         }
         // door logic...
         const {end,start} = this;
         if (this.doorBot) {
               const check = -1;
               this.addHalfDoor(dx, end.y,check);
    
         }
         if (this.doorTop) {
               const check = 2;
               this.addHalfDoor(dx, start.y,check);
         }
       
   }
}
Path.prototype.addHorizBorder = function() {
   
   const {y} = this.start;

   const arr = [DOOR_CODE, FLOOR_CODE, WALL_CODE,BORDER_CODE];

   for (let x = this.start.x; x <= this.end.x; ++x) {

      for (let dy of [y-1,y+this.floorSpan]) {

          if (game.map[dy]) {
            this.addBorder(x,dy);
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
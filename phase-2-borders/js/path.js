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

   //game.map[this.start.y][x] = ENEMY_CODE;

   const arr = [FLOOR_CODE,WALL_CODE,DOOR_CODE];

   let left = x - 1;
   let right = x + this.floorSpan;
   for (let checkX of [left, right]) {

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

   const limit = 5;

   const y = testY || this.start.y;

//   game.map[y][this.start.x] = RELIC_CODE;

   const arr = [FLOOR_CODE,WALL_CODE,DOOR_CODE,BORDER_CODE];

   const top = y-1;
   const bot = y+this.floorSpan;

   for (let checkY of [top,bot]) {

      let consecutive = 0;

      for (var x = this.start.x+1; x < this.end.x; ++x) {
         
       

         if (game.map[checkY] &&
            arr.includes(game.map[checkY][x])) {
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

Path.prototype.addHoriz = function(tileCode) {
   const y = this.start.y;

   this.addHorizBorder();
  
   for (let x = this.start.x; x <= this.end.x; ++x) {

         for (let z = 0; z < this.floorSpan; ++z) {
            game.map[y+z][x] = tileCode || FLOOR_CODE;
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
Path.prototype.addVert = function(tileCode) {
   
   const {x} = this.start;

   this.addVertBorder();

   for (let z = 0; z < this.floorSpan; ++z) {
         const dx = x+z;
         for (let y = this.start.y; y <= this.end.y; ++y) {
           game.map[y][dx] = tileCode || FLOOR_CODE;
         }
   }
   this.tryDoors(x);
}
Path.prototype.tryDoors = function(x) {
   const {end,start} = this;
   // check for door codes and wall codes
   const arr = [DOOR_CODE,WALL_CODE,FLOOR_CODE];

   const lt = game.map[start.y][start.x-1];
   const lb = game.map[start.y+1][start.x-1];
   const rt = game.map[start.y][end.x +1];
   const rb = game.map[start.y+1][end.x+1];

   const nearbyTiles = [lt,lb,rt,rb];

   const blocker = nearbyTiles.find(x => arr.includes(x));

   if (!blocker) { 

     for (let z = 0; z < this.floorSpan; ++z) {  
         const dx = x+z; 

         if (this.doorBot && game.map[end.y]) {
               const check = -1;
               this.addHalfDoor(dx, end.y,check);
    
         }
         if (this.doorTop) {
               const check = 2;
               this.addHalfDoor(dx, start.y,check);
         }
       
     }
   }
}
/**
 * @TODO: Add row of wall tiles
 */ 
Path.prototype.addHorizBorder = function() {
   
   const {y} = this.start;

   const arr = [DOOR_CODE, FLOOR_CODE, WALL_CODE,BORDER_CODE];

   for (let x = this.start.x; x <= this.end.x; ++x) {

      for (let dy of [y-2,y+this.floorSpan]) {
            this.addBorder(x,dy);
      }
      // add the wall
      this.addBorder(x,y-1,WALL_CODE);
   }

   const top = this.start.y - 2;
   const bot = this.end.y + 1;
   const beforeX = this.start.x - 1;
   const afterX = this.end.x + 1;

   if (this.start.corner == CORNER_TOP) {
       this.addBorder(beforeX,top);
   }
   // used? 
    if (this.start.corner == CORNER_BOT) {
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
Path.prototype.addBorder = function(x, y, tileCode) {

   let arr = [FLOOR_CODE,DOOR_CODE,WALL_CODE];

   if (game.map[y] && !arr.includes(game.map[y][x])) {

        game.map[y][x] = tileCode != undefined ? tileCode : BORDER_CODE;
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
   const after = this.end.y +1;
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
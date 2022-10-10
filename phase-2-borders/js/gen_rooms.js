function generateMapRooms() {

   game.resetMap();

   let maxRooms = 10;

   // partition coefficient
   let pc = 0.5;

   let xDiv = parseInt(COLS*pc);
   let yDiv = parseInt(ROWS*pc);


   const xMins = [0, xDiv-1];
   const yMins = [0, yDiv-1];
   const xMaxes = [xDiv,COLS];
   const yMaxes = [yDiv,ROWS];

   // vert
   debugLine(xDiv,0, xDiv,ROWS);
   //horiz
   debugLine(0,yDiv,COLS,yDiv);
   let counter = 0;
   while (game.rooms.length < maxRooms) {

    let quadrant = 0;
    for (y = 0; y < yMins.length; ++y) {
    
      for (x = 0; x < xMins.length; ++x) {

         const xMin = xMins[x];
         const yMin = yMins[y];
         const yMax = yMaxes[y];
         const xMax = xMaxes[x];
         createRoom(xMin, yMin, xMax, yMax,quadrant);
         quadrant++;
      }
      quadrant++;
    }
    counter++;
   }


 /*  for (var i = 0; i < maxRooms; ++i) {
      createRoom(0, 0);
   }*/
   let success = false;

   const min = 5;

   for (var room of game.rooms) {

      success = room.findFacingRooms(min);

      success = room.nearestNeighbor();
 
   }
   for (var myRoom of game.rooms) {

     let {numConnected, numDisc} = myRoom.connectRemaining();

     //console.log(`Room${myRoom.id} connected ${numConnected} out of ${numDisc} disconnected rooms`);
   }
   scanTiles();
}

/**
 * 
 * @param {Object} center
 * @param {Number} height
 * @param {Number} width
 * 
 */
function setRoomCoords(center, width, height) {


   let halfW = Math.round(width / 2);
   let halfH = Math.round(height / 2);

   let start = {
      x: center.x - halfW,
      y: center.y - halfH
   };

   let end = {
      x: center.x + halfW,
      y: center.y + halfH
   };

   return {
      start,
      end
   };
}
/**
 * Generates one room based on a center point.
 * @param {Object} center {x,y}
 */
function generateRoom(center, width, height,quadrant) {

   // get coordinates based on width and height
   let { start, end } = setRoomCoords(center, width, height);

   let room = new Room(center, start, end);

   room.id = game.curRoomId+'-'+quadrant;

   return room;

}
function createRoom(xMin, yMin, xMax, yMax, quadrant,c) {
  
   let {
      width,
      height
   } = genDim();

   let coords = c || {
      x: genCenterCoord(width, xMax, xMin),
      y: genCenterCoord(height, yMax, yMin)
   }
   // debug
   let {x,y} = coords;

   // end debug
   let room = generateRoom(coords, width, height,quadrant);

   for (var gameRoom of game.rooms) {

      const lim = 4;
      if (room.overlaps(gameRoom, 4)) {
         return null;
      }

   }
   // if room survives, augment room id.
   game.curRoomId++;


   game.addRoom(room);
   game.addBorder(room);
   room.addTopWall();

   game.rooms.push(room);
   return room;

}
function genCenterCoord (roomDim, maxCells, minCells=0) {

      let min = minCells || OUTER_LIMIT;

      // get limit on either side based on outer limit and a room dimension - width or height
      let minLimit = min + Math.ceil(roomDim / 2);
      let maxLimit = maxCells - OUTER_LIMIT - Math.round(roomDim/2);

      // get range based on cells in array - limit on either side.
      let range = maxLimit - minLimit;

      // get a random  number within 
      return minLimit + Math.round(Math.random() * range);
}
/**
 * Randomly generates a set of dimensions.
 * 
 */
function genDim() {
   const BASE_DIM = 4;
   const EXTRA = 10;

   let width, height;

   width = height = BASE_DIM;

   let additional = {
      w:Math.round(Math.random() * EXTRA),
      h:Math.round(Math.random() * EXTRA)
   };


   height += additional.w;

   width += additional.h;
   
   return {
      width,
      height
   };
};

function scanTiles() {
   for (let y = OUTER_LIMIT; y < ROWS - OUTER_LIMIT; ++y) {
      for (let x = OUTER_LIMIT; x < COLS - OUTER_LIMIT; ++x) {

          checkEnclosed(x,y);
          checkTopBorder(x,y);

      } // end inner loop
   } // end outer loop
   //fillMore(OUTER_LIMIT,OUTER_LIMIT,BORDER_CODE,EMPTY_CODE);
}
function checkTopBorder(x,y) {

   const arr = [DOOR_CODE,WALL_CODE];

   if (game.map && arr.includes(game.map[y][x]) &&
      game.map[y-1][x] == FLOOR_CODE &&
      game.map[y+1][x] == FLOOR_CODE) {

      console.log('replacing door code or wall code with floor code')

      game.map[y][x] = FLOOR_CODE;
   }
}
function checkEnclosed(x,y) {
   if (game.map[y][x] == EMPTY_CODE &&
         isEnclosed({x,y})) {

         const tileAbove = game.map[y-1][x];
         const tileLeft = game.map[y][x-1];
            // if no neighboring tiles are empty...
         if (tileAbove != EMPTY_CODE &&
                 tileLeft != EMPTY_CODE) {

                 game.map[y][x] = SOLID_CODE; //(tileAbove == BORDER_CODE) ? WALL_CODE : FLOOR_CODE;
         }
         else {
              backFillEmpty(x,y);
         }
          
   }
}
function backFillEmpty(x,y) {

   if (game.map[y-1][x] == EMPTY_CODE) {
         fillEmpty(x,y-1)
   }
   if (game.map[y][x-1] == EMPTY_CODE) {
         fillEmpty(x-1,y);
   }
}
function fill(x,y,oldCodes,newCode) {

   game.map[y][x] = newCode;

   let left = {x:x-1,y};

   let top = {x,y:y-1};

   let right = {x:x+1,y};

   let bot = {x,y:y+1};

   let arr = [bot,right,top,left];

   for (let point of arr) {
         const {x,y} = point;
         let tileCode = game.map[y][x];

         if (oldCodes.includes(tileCode)) {
            fill(x,y,oldCodes,newCode);
            //debugTile(x,y,WEAPON_CODE);
         }
     
   }
}
function fillEmpty(x,y) {

   const oldCodes = [FLOOR_CODE,WALL_CODE,SOLID_CODE]
   game.map[y][x] = EMPTY_CODE;

   let left = {x:x-1,y};

   let top = {x,y:y-1};

   let right = {x:x+1,y};

   let bot = {x,y:y+1};

   let arr = [bot,right,top,left];

   for (let point of arr) {
         const {x,y} = point;
         let tileCode = game.map[y][x];

         if (oldCodes.includes(tileCode)) {
            fillEmpty(x,y);
            //debugTile(x,y,WEAPON_CODE);
         }
     
   }
}
function isEnclosed(p){

   let rightBorderX = null;

   if (game.map[p.y][p.x] == EMPTY_CODE) {

        const borderLeft = (x,y)=>{
         //console.log(`[borderLeft] x: ${x} y: ${y}`);
         if (x > game.map[y].indexOf(BORDER_CODE)) {
             let tileCode = game.map[y][x];

             for (dx = x-1; dx > OUTER_LIMIT; --dx) {
               if (game.map[y][dx] == BORDER_CODE) {
                  return true;
               }
               else if (game.map[y][dx] != FLOOR_CODE) {
                  return false;
               }
             }
         }
         return false;

        
        }
        // is there a border tile directly above? 
        const hasBorderAtX = (row,x) => {
            return row[x] == BORDER_CODE;
        }
        const borderAbove =(x,y) => {
         let idx = game.map.findIndex(row => hasBorderAtX(row,x));
         return y > idx;
        }
        const borderRight = (x,y) =>{
          for (let dx = x+1; dx < COLS - OUTER_LIMIT; ++dx) {

             if (game.map[y][dx]==BORDER_CODE) {
               rightBorderX = dx;
               return true;
             }
          }
          return false;
        }
        const borderBelow=(x,y) => {
         for (let dy = y+1; dy < ROWS - OUTER_LIMIT; ++dy) {
            if (game.map[dy][x] == BORDER_CODE) {
               return true; //rightBelowConnect(x,dy);
            }
         }

         return false;

        }
        const checkRight = () => {
          for (let x = p.x+1; x < COLS - OUTER_LIMIT; ++x) {

             if (borderAbove(x, p.y) &&
                 borderBelow(x, p.y)) {

                 if (game.map[p.y][x] == BORDER_CODE) {
                    return true;
                 }

             }
          } // end loop
           return false;
        };
       const checkLeft = () => {
          for (let x = p.x-1; x >= OUTER_LIMIT; --x) {

             if (borderAbove(x, p.y) &&
                 borderBelow(x, p.y)) {

                 if (game.map[p.y][x] == BORDER_CODE) {
                    // game.map[p.y][x] = ENEMY_CODE;
                    return true;
                 }

             }
          } // end loop
 
         return false;
        };
        const checkAbove = () => {
          for (let y = p.y-1; y >=OUTER_LIMIT; --y) {

             if (borderLeft(p.x, y) &&
                 borderRight(p.x, y)) {

                 if (game.map[y][p.x] == BORDER_CODE) {
                    return true;
                 }
             }
            
          } // end loop
 
          return false;
        };
    

         const checkBelow = () => {
          for (let y = p.y+1; y <= ROWS - OUTER_LIMIT; ++y) {

             if (borderLeft(p.x, y) &&
                 borderRight(p.x, y)) {

                 if (game.map[y][p.x] == BORDER_CODE) {
                    return true;
                 }
             }
          } // end loop
  
          return false;
        };
        const tryErase =(p) => {
          eraseCheck(p.x-1,p.y, ENEMY_CODE);
          eraseCheck(p.x+1,p.y, ENEMY_CODE);
          eraseCheck(p.x,p.y-1, RELIC_CODE);
          eraseCheck(p.x,p.y+1, RELIC_CODE);

        }
        const eraseCheck =(x,y,tileCode) => {
       
         const oldCodes = [FLOOR_CODE,WALL_CODE,SOLID_CODE]
          if (oldCodes.includes(game.map[y][x])) {
            // console.log('about to start fill process');
             fillEmpty(x,y);

            // debugTile(x,y,tileCode);
          }
        }

        let clear = checkLeft() && 
               checkRight() && 
               checkBelow() && 
               checkAbove();

        if (!clear) {
         //  debugTile(p.x,p.y,KEY_CODE);
           tryErase(p);
        }
        else {
         // debugTile(p.x,p.y,POTION_CODE);
        }
        return clear;

   }
 
   return false;

}
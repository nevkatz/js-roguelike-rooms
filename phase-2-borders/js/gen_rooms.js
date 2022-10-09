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

     console.log(`Room${myRoom.id} connected ${numConnected} out of ${numDisc} disconnected rooms`);
   }
   fillEnclosed();
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

function fillEnclosed() {
   for (let y = 0; y < ROWS; ++y) {
      for (let x = 0; x < COLS; ++x) {

         if (game.map[y][x] == EMPTY_CODE &&
             isEnclosed({x,y})) {

            game.map[y][x] = WALL_CODE;
         }
      }
   }
}
function isEnclosed(p){

   let rightBorderX = null;

   if (game.map[p.y][p.x] == EMPTY_CODE) {
        const borderLeft = (x,y)=>{
         return x > game.map[y].indexOf(BORDER_CODE);
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
          for (let dx = x+1; dx < COLS; ++dx) {

             if (game.map[y][dx]==BORDER_CODE) {
               rightBorderX = dx;
               return true;
             }
          }
          return false;
        }
        const borderBelow=(x,y) => {
         for (let dy = y+1; dy < ROWS; ++dy) {
            if (game.map[dy][x] == BORDER_CODE) {
               return true; //rightBelowConnect(x,dy);
            }
         }

         return false;

        }
        const checkRight = () => {
          for (let x = p.x+1; x < COLS; ++x) {

             if (borderAbove(x, p.y) &&
                 borderBelow(x, p.y)) {

                 if (game.map[p.y][x] == BORDER_CODE) {
                    return true;
                 }

             }
             else {
               return false;
             }
          } // end loop
           return false;
        };
       const checkLeft = () => {
          for (let x = p.x-1; x >=0; --x) {

             if (borderAbove(x, p.y) &&
                 borderBelow(x, p.y)) {

                 if (game.map[p.y][x] == BORDER_CODE) {
                    // game.map[p.y][x] = ENEMY_CODE;
                    return true;
                 }

             }
             else {
               return false;
             }
          } // end loop
           return false;
        };
        const checkAbove = () => {
          for (let y = p.y-1; y >=0; --y) {

             if (borderLeft(p.x, y) &&
                 borderRight(p.x, y)) {

                 if (game.map[y][p.x] == BORDER_CODE) {
                    return true;
                 }
             }
             else {
               return false;
             }
          } // end loop
          return false;
        };
         const checkBelow = () => {
          for (let y = p.y+1; y <= ROWS; ++y) {

             if (borderLeft(p.x, y) &&
                 borderRight(p.x, y)) {

                 if (game.map[y][p.x] == BORDER_CODE) {
                    return true;
                 }
             }
             else {
               return false;
             }
          } // end loop
          return false;
        };

        return checkLeft() && 
               checkRight() && 
               checkBelow() && 
               checkAbove();

   }
 
   return false;

}
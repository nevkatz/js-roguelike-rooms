/**
 * Rooms
 * 
 */

class Room {
   constructor(center, start, end) {

      this.center = center;
      // upper left
      this.start = start;
      // bottom right
      this.end = end;

      this.id = null;

      this.neighbors = [];
   }
}

/**
 * @param {Object} room
 * @param {String} coord - x or y
 * @param {Number} min - the minimum number of coords/tiles that should be shared.
 * 
 */ 
Room.prototype.sharesCoordsWith = function(room, coord, min=1) {

   return room.end[coord] - this.start[coord] >= min &&
           this.end[coord] - room.start[coord] >= min;


}

/**
 *  The overlapsHoriz, overlapsVert, and overlaps methods are covered in
 *  https://javascript.plainenglish.io/rendering-roguelike-rooms-with-javascript-8a2dc58f3b63
 */ 

/**
 * @param {Object} room - the other other room
 * @param {Number} wall - the minimum thickness of the wall between rooms
 */ 
Room.prototype.overlaps = function(room, wall=0) {
   return this.overlapsHoriz(room, wall) && 
   this.overlapsVert(room, wall);
}
Room.prototype.overlapsHoriz = function(room, wall=0) {

   return this.start.x - wall <= room.end.x &&
           this.end.x + wall >= room.start.x;
}
Room.prototype.overlapsVert = function(room, wall=0) {

   return this.start.y - wall <= room.end.y &&
          this.end.y + wall >= room.start.y;
}

Room.prototype.alignedVert = function(room) {
   return this.center.y = room.center.y;
}
Room.prototype.alignedHoriz = function(room) {
   return this.center.x = room.center.x;
}

 

/**
 * @param {Number} min - the minimum number of x or y coordinates facing rooms should share.
 * @param {Number} maxRooms - the maximum # of ooms a room should connect with.
 */ 
Room.prototype.findFacingRooms = function(min=1, maxRooms=1) {

   let success = false;
   
   let rooms = this.findPotentialRooms();

   for (var room of rooms) {

      if (!this.roomBetween(room) && 

         (this.sharesCoordsWith(room,'x', min) || 
          this.sharesCoordsWith(room,'y', min))) {

          success = this.connectRoom(room, min);

      }
      if (this.neighbors.length >= maxRooms) {
         break;
      }
   }
 
   return success;
}
/**
 * 
 * @TODO: Write a recursive function that populates an array
 *        with the current room's neighbors and then calls itself on each neighbor, 
 *        adding the resulting ones to the array.
 * 
 * @param {Array} reachable - rooms that are already reachable 
 *                            by the room that originally called the method
 */ 
Room.prototype.searchNeighbors = function(reachable=[]) {

}
 /**
  * @TODO: Write logic that connects the remaining rooms in the network.
  */ 
Room.prototype.connectRemaining = function() {

  
}




Room.prototype.contains = function(c, prop) {
   return c >= this.start[prop] && c <= this.end[prop];
}
Room.prototype.encloses = function(x,y) {
   return this.contains(x,'x') && this.contains(y,'y');
}
Room.prototype.betweenHoriz = function(room1,room2) {

  return this.sharesCoordsWith(room1,'y') && 
         this.sharesCoordsWith(room2,'y') &&
         room1.sharesCoordsWith(room2,'y') &&

          ((this.center.x > room1.center.x && this.center.x < room2.center.x) ||
          (this.center.x > room2.center.x && this.center.x < room1.center.x));
}
Room.prototype.betweenVert = function(room1,room2) {

   return this.sharesCoordsWith(room1,'x') && 
           this.sharesCoordsWith(room2,'x') &&
           room1.sharesCoordsWith(room2,'x') &&
         ((this.center.y > room1.center.y && this.center.y < room2.center.y) ||
          (this.center.y > room2.center.y && this.center.y < room1.center.y));

}

Room.prototype.roomBetween = function(room) {
   let testRooms = game.rooms.filter(x => x.id != this.id && x.id != room.id);
   for (var testRoom of testRooms) {

      if (testRoom.betweenVert(this,room) || 
          testRoom.betweenHoriz(this,room)) {

         return true;
      }
   } 
   return false;
}
Room.prototype.addNeighbor = function(room) {
   this.neighbors.push(room);
   room.neighbors.push(this);
}
/**
 * 
 * @param {Number} room - the other room object
 * 
 * @param {Number} min - the minimum number of common coordinates
 */ 
Room.prototype.connectRoom = function(room, min=3) {

   let success = false;

   if (this.sharesCoordsWith(room, 'x', min) || 
       this.sharesCoordsWith(room, 'y', min)) {

      success = this.directConnect(room, min);

   }
   
   if (!success) {
      // if we add doorTiles logic we need to mix in the inRoom
      // so it can'b be adjacent and it can't be in a room.
      let vertCorner = {x:this.center.x,y:room.center.y};

      let horizCorner = {x:room.center.x, y:this.center.y};

      let vert = Math.random() < 0.5;

      if ((vert || game.inRoom(horizCorner)) && !game.inRoom(vertCorner)) {
         success = this.cornerVert(room, vertCorner);
      }
      if (!success && !game.inRoom(horizCorner)) {
         success = this.cornerHoriz(room, horizCorner);
      }
      
   }

   return success;
}

Room.prototype.cornerVert = function(room, corner) {

   let vert = new Path(), horiz = new Path();

      /** If this is above
       * 
       *        this
       *         |
       *         |
       * room ---*--- room 
       */
 
      if (this.end.y < room.center.y) {

           // draw downwards from MC room's bottom
           vert.start = {
            x:this.center.x, 
            y:this.end.y + 1
           };

           vert.doorTop = true;

           // end at the corner
           vert.end = {
            x:corner.x + vert.floorSpan - 1,
            y:corner.y,
            corner:true
         }
      }
      /**  
       * else if this is below
       * 
       *  room ---*----room
       *          |
       *         this
       */
      else if (this.start.y > room.center.y)  {
          // Drawing downwards from the other room's vertical center
          vert.start = corner;
          vert.start.corner = true;
          // to this room's top edge and horizontal center.
          vert.end = {
            x:this.center.x + vert.floorSpan - 1,
            y:this.start.y - 1
         };
          vert.doorBot = true;
      }
      else {
          console.log(`Target room${room.id} center x is between MC Room${this.id} start and end; corner connect failed`);
          return false;
      }
       /**  
       * 
       * If this is on left
       * 
       *      *--room
       *      |
       *    this
       *      | 
       *      *---room
       * 
       */

      if (this.center.x < room.start.x) {

         // start horizontal path from corner 
         horiz.start = corner;
         horiz.start.corner = true;

         // end when you get to start of other room
         horiz.end = {
            x:room.start.x - 1, 
            y:room.center.y + horiz.floorSpan -1
         };
 
      }
      /**  
       * 
       * If this is on right
       * 
       *        this
       *          |
       *  room ---*
       *          |
       *         this
       */
      else if (this.center.x > room.end.x) {

           // Start horizontal path from the room on left.
           horiz.start = {x:room.end.x + 1, y:room.center.y};

           // End the horizontal path at this room's center.
           horiz.end = {
              x:corner.x,
              y:corner.y + horiz.floorSpan -1,
              corner:true
           }
     
      }
      else {
           console.log(`Target room${room.id} center x is between MC Room${this.id} start and end; corner connect failed`);
      }

      if (!vert.isAdjacentVert() && 
          !horiz.isAdjacentHoriz()) {

           vert.addVert();
           horiz.addHoriz();

           this.addNeighbor(room);
      }
    
  return this.neighbors.includes(room);
}

Room.prototype.cornerHoriz = function(room, corner) {

   let horiz = new Path(), vert = new Path();
   
      /**  
       * 
       * ON LEFT
       * 
       *  this  ----*
       *            |
       *            |
       *          room
       *            |
       *            |
       *  this -----*
       */
      // on left
      if (room.center.x > this.end.x) {
         horiz.start = {
            x:this.end.x + 1,
            y:this.center.y
         };
          horiz.end = {
            x:corner.x,
            y:corner.y + horiz.floorSpan - 1,
            corner:true
         };
      }
      /**
       * 
       * ON RIGHT
       * 
       *  *--- this (onRight)
       *  |
       *  |
       * room
       *  |
       *  |
       *  *--- this (onRight)
       */
      else if (room.center.x < this.start.x) {
         horiz.start = corner;
         horiz.start.corner = true;
         /**
          * @TODO: Change end coordinates
          */ 
         horiz.end = {
            x:this.start.x - 1,
            y:this.center.y + horiz.floorSpan - 1
         }
      }
      else {
         console.log(`Target room${room.id} center x is between MC Room${this.id} start and end; corner connect failed`);
         return false;
      }
    
      /**
       * ABOVE
       *    this---*---this
       *           |
       *          room
       * 
       */ 
      if (this.center.y < room.start.y) {
           vert.start = corner;
           vert.start.corner = true;
             // end at top center of other room
           vert.end = {
            x:room.center.x + vert.floorSpan - 1, 
            y:room.start.y - 1
           };
           vert.doorBot = true;
    
      }
      /**
       * else if THIS IS BELOW
       *          room
       *            |
       *            |
       * this-------*-------this
       *           corner
       */
      else if (this.center.y > room.end.y) {
          vert.start = {
            x:room.center.x,
            y:room.end.y + 1
          };
         
          vert.end = {
            x:corner.x + vert.floorSpan - 1,
            y:corner.y,
            corner:true
          };
          vert.doorTop = true;
      }
      else {
         console.log(`MC Room${this.id} center y is between Target Room${room.id} start and end; corner connect failed`);
         return false;
      }

      if (!vert.isAdjacentVert() && 
          !horiz.isAdjacentHoriz()) {

           vert.addVert();
           horiz.addHoriz();

           this.addNeighbor(room);
      }
      return this.neighbors.includes(room);
}
/**
 * @param {Object} room
 * @param {string} axis - x or y
 * 
 */ 
Room.prototype.alignedEdge = function(room,axis) {
   return this.start[axis] == room.start[axis] ||
          this.end[axis] == room.end[axis];
     
}
/**
 * @param {Object} room
 * @param {string} axis - x or y
 * 
 */ 
Room.prototype.alignedEdges = function(room,axis) {
   return this.start[axis] == room.start[axis] &&
          this.end[axis] == room.end[axis];
     
}
/**
 * @param {Object} room
 * @param {string} axis - x or y
 * 
 */ 
Room.prototype.alignedCenters = function(room,axis) {
   return this.center[axis] == room.centers[axis];
}
Room.prototype.possibleExits = function(room,axis,wall) {
 
   let start = Math.max(this.start[axis] + wall, room.start[axis] + wall);

   let end = Math.min(this.end[axis] - wall, room.end[axis] - wall);

   return {start, end};

}
Room.prototype.placePathX = function(room,path,wall) {
   
   let {start, end} = this.possibleExits(room,'x',wall);

   for (var x = start; x <= end; ++x) {

         // add inRoom logic for corners? 
         if (!path.isAdjacentVert(x)) {
               path.allowed = true;
               path.start.x = x;
               path.end.x = path.start.x + path.floorSpan - 1;
               break;
         }
   }
   return path;
}
Room.prototype.placePath = function(room,path,wall,axis) {
   
   let {start, end} = this.possibleExits(room, axis, wall);

   path.start[axis] = path.end[axis] = Math.round((start+end)/2);

   path.allowed = true;

   return path;
}
Room.prototype.placePathY = function(room,path,wall) {
   
   let {start, end} = this.possibleExits(room,'y', wall);

   for (var y = start; y <= end; ++y) {

         if (!path.isAdjacentHoriz(y)) {
               path.allowed = true;
               path.start.y = y;
               path.end.y = path.start.y + path.floorSpan - 1;
               break;
         
         }
   }

   return path;
}
Room.prototype.addVertPath = function(room, path, wall) {

   path.start.y = Math.min(this.end.y,room.end.y) + 1;

   path.end.y = Math.max(this.start.y,room.start.y) - 1;

   path = this.placePathX(room,path,wall);
 
   if (path.allowed) {
         
          path.addVert();

          this.addNeighbor(room);
   }
   return path;

}
Room.prototype.addHorizPath = function(room, path, wall) {

   // the preference is to use the center.
   // this could be taken out if we want to simplify the tutorial.
   // we can add this in a different article on prioritizing center doors.

   path.start.x = Math.min(this.end.x,room.end.x) + 1;

   // use the left side of whatever room is on the right
   path.end.x = Math.max(this.start.x,room.start.x) - 1;

   path = this.placePathY(room,path,wall);
  
   if (path.allowed) {

          path.addHoriz();

          this.addNeighbor(room);
   }
   return path;

}
Room.prototype.directConnect = function(room, min) {

 let path = new Path(true,true);
 
 const wall = parseInt((min-1)/2);

 if (this.sharesCoordsWith(room, 'x', min)) {
   

      path = this.addVertPath(room,path,wall);  
 }
 else {
      path = this.addHorizPath(room,path,wall);
 }

  return path.allowed;
}
Room.prototype.findPotentialRooms = function() {
   let rooms = game.rooms.filter(x => x.id != this.id);
   
   if (this.neighbors.length > 0) {
        rooms = rooms.filter(x => !this.neighbors.includes(x));
   }
   return rooms;
}

/**
 * Find the first room in the list you can connect with.
 */ 
Room.prototype.findNearbyRoom = function(myRoom, rooms) {
   let shortest = null;
   let nearestRoom = null;

   for (var room of rooms) {
      
      if (!myRoom.roomBetween(room)) {
        
         let success = myRoom.connectRoom(room);
         
         if (success) {
            return true;
         }

      }
   }
   return false;
}
Room.prototype.nearestNeighbor = function(rooms) {

   let success = false;

   rooms = rooms || this.findPotentialRooms();

   rooms = rooms.filter(x => !this.roomBetween(x));

   const distanceTo = (room) => {
      let diffX = this.center.x - room.center.x;
      let diffY = this.center.y - room.center.y;

      let x = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

      return x;
   };
   const compareDist = (room1,room2) => {
      return distanceTo(room1) - distanceTo(room2);
   };

   let sorted = rooms.sort(compareDist);

   for (let room of sorted) {

      success = this.connectRoom(room);

      if (success) { 
         break;
       }
   }
   return success;
}
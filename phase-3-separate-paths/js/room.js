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

/**
 * 
 * @TODO: Determine whether an x or y coordinate is between a room's
 *        start and end coordinates
 * 
 * @param {Number} c - the x or y coordinate
 * @param {String} prop - either 'x' or 'y'
 */ 
Room.prototype.contains = function(c, prop) {

}
/**
 * @TODO: Determine whether a point with coordinates (x,y)
 *        is inside the room
 * 
 * @return {Boolean} if point is in room, true; else, false
 */ 
Room.prototype.encloses = function(x,y) {

}

/**
 * @Tasks start here
 * 
 * Phase 1: Find Facing Rooms
 * 
 */ 


/**
 * 
 * Covered in https://javascript.plainenglish.io/connecting-rooms-in-a-javascript-roguelike-8e6212c54c9
 * 
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
 *  Finds potential rooms that do not include 
 *  the method-calling room or current neighbors.
 */ 
Room.prototype.findPotentialRooms = function() {
   let rooms = game.rooms.filter(x => x.id != this.id);
   
   if (this.neighbors.length > 0) {
        rooms = rooms.filter(x => !this.neighbors.includes(x));
   }
   return rooms;
}
/**
 * Covered in 
 * https://javascript.plainenglish.io/connecting-rooms-in-a-javascript-roguelike-8e6212c54c9
 * 
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
 * Finds rooms in between
 * 
 * Covered in 
 * https://javascript.plainenglish.io/connecting-rooms-in-a-javascript-roguelike-8e6212c54c9
 * 
 * @param {Object} room1
 * @param {Object} room2
 */ 

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
/** 
 *  Covered in
 *  https://javascript.plainenglish.io/connecting-rooms-in-a-javascript-roguelike-8e6212c54c9
 * 
 *  @param {Object} room
 */ 
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


/**
 *  Phase 2: Connect rooms with a straight line
 *  
 *  Note: all of Phase 2 was covered in 
 *  https://javascript.plainenglish.io/connecting-rooms-in-a-javascript-roguelike-8e6212c54c9
 * 
 */ 


/**
 * @param {Object} room - the other room
 */ 
Room.prototype.addNeighbor = function(room) {
   this.neighbors.push(room);
   room.neighbors.push(this);
}
Room.prototype.possibleExits = function(room,axis,wall) {
 
   let start = Math.max(this.start[axis] + wall, room.start[axis] + wall);

   let end = Math.min(this.end[axis] - wall, room.end[axis] - wall);

   return {start, end};

}
/**
 * @TODO: Write logic that sets the X coordinate of a path while avoiding adjacent paths.
 */ 
Room.prototype.placePathX = function(room,path,wall) {
   
   return path;
}
/**
 * @TODO: Write logic that sets the X coordinate of a path avoiding adjacent paths.
 */ 
Room.prototype.placePathY = function(room,path,wall) {
   
   return path;
}
Room.prototype.placePath = function(room,path,wall,axis) {
   
   let {start, end} = this.possibleExits(room, axis, wall);

   path.start[axis] = path.end[axis] = Math.round((start+end)/2);

   path.allowed = true;

   return path;
}

Room.prototype.addVertPath = function(room, path, wall) {

   path.start.y = Math.min(this.end.y,room.end.y) + 1;

   path.end.y = Math.max(this.start.y,room.start.y) - 1;

   path = this.placePath(room,path,wall,'x');
 
   if (path.allowed) {
       

          game.addPath(path);

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

   path = this.placePath(room,path,wall,'y');;
  
   if (path.allowed) {

          game.addPath(path);

          this.addNeighbor(room);
   }
   return path;

}
Room.prototype.directConnect = function(room, min) {

 let path = new Path();
 
 const wall = parseInt((min-1)/2);

 if (this.sharesCoordsWith(room, 'x', min)) {

      path = this.addVertPath(room,path,wall);  
 }
 else {
      path = this.addHorizPath(room,path,wall);
 }

  return path.allowed;
}





/**
 *  End Phase 2; current work starts here.
 * 
 */

/**
 * 
 * @TODO: Write logic for connecting rooms with corners.
 *        Helpers: contains, encloses, cornerVert, cornerHoriz
 * 
 * 
 * @param {Number} room - the other room object
 * @param {Number} min - the minimum number of common coordinates
 */ 
Room.prototype.connectRoom = function(room, min=3) {

   let success = false;

   if (this.sharesCoordsWith(room, 'x', min) || 
       this.sharesCoordsWith(room, 'y', min)) {

      success = this.directConnect(room, min);

   }
   
   // add corner logic here.

   return success;
}

/**
 *   Phase 3: Corner Logic
 */ 

Room.prototype.nearestNeighbor = function() {

   /**
    * @TODO: Write a function that tries to find a nearby room using the 
    *        distance formula.
    */ 
}
/**
 *  @TODO: Write logic for creating two paths that meet at a corner
 * 
 *         The vertical path connects to the top or bottom 
 *         of the method-calling room
 * 
 * @param {Object} room 
 * @param {object} corner {x,y}
 */ 
Room.prototype.cornerVert = function(room, corner) {

  
}
/**
 *  @TODO: Write logic for creating two paths that meet at a corner
 * 
 *         The horizontal path connects to the right or left side
 *         of the method-calling room
 * 
 * @param {Object} room 
 * @param {object} corner {x,y}
 * 
 */ 
Room.prototype.cornerHoriz = function(room, corner) {

 
}

/**
 *  Phase 4: Recursion
 * 
 *  Below is work you can complete for the recursion tutorial
 */ 

/**
 * 
 * @LATER: Write a recursive function that populates an array
 *        with the current room's neighbors and then calls itself on each neighbor, 
 *        adding the resulting ones to the array.
 * 
 * @param {Object} room
 * @param {Array} arr
 */ 

Room.prototype.searchNeighbors = function(room, arr) {
 

}
 /**
  * @LATER: Write logic that connects the remaining rooms in the network.
  */ 
Room.prototype.connectRemaining = function() {

  
}

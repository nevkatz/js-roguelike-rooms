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

Room.prototype.overlaps = function(room, wall=0) {
   return this.overlapsHoriz(room, wall) && 
   this.overlapsVert(room, wall);
}

/**
 *  Horiz overlap
 */ 
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
   return this.contains(x,'x') && this.contains(y,'y');
}

/**
 * @Tasks start here
 * 
 * Phase 1: Find Facing Rooms
 * 
 */ 


/**
 * 
 * @TODO: Determine whether the number of x or y coords shared by two 
 *        rooms are greater than or equal to the minimum amount.
 *        Return TRUE if enough coords are shared, FALSE if not
 * 
 * @param {Object} room
 * @param {String} coord - x or y
 * @param {Number} min - the minimum number of coords/tiles that should be shared.
 * 
 */ 
Room.prototype.sharesCoordsWith = function(room, coord, min=1) {



}
/**
 * @TODO: Find potential rooms that do not include 
 *        the method-calling room or current neighbors.
 */ 
Room.prototype.findPotentialRooms = function() {
 
}
/**
 * @TODO: Write logic for connecting to one room that is facing the current
 * room. For a room to be facing, it should be sharing {min} x or y coordinates
 * and there should be no rooms in between.
 * 
 * @param {Number} min - the minimum number of x or y coordinates facing rooms should share.
 * @param {Number} maxRooms - the maximum # of ooms a room should connect with.
 */ 
Room.prototype.findFacingRooms = function(min=1, maxRooms=1) {
  
   let success = false;
   let rooms = this.findPotentialRooms();
  
   for (var room of rooms) {   
     
        // try to connect with potential rooms
        // break out of the loop when neighbors >= maxRooms
     
   }
   return success;
}



/**
 *  @TODO: Determine whether method-calling room is
 *         horizontally between room1 and room2
 * 
 * @param {Object} room1
 * @param {Object} room2
 */ 

Room.prototype.betweenHoriz = function(room1,room2) {

}
/**
 *  @TODO: Determine whether method-calling room is
 *         vertically between room1 and room2
 * 
 * @param {Object} room1
 * @param {Object} room2
 */ 
Room.prototype.betweenVert = function(room1,room2) {


}
/** 
 *  @TODO: Test whether there are any rooms 
 *         that are between method-calling room and the passed-in room
 * 
 *  @param {Object} room
 */ 
Room.prototype.roomBetween = function(room) {

}



/**
 *  Phase 2: Connect Rooms with a straight line
 * 
 */ 

 /**
  * @TODO: Write logic for getting possible tiles for the exit
  * 
  * @param {Object} room
  * @param {String} axis - x or y
  * @param {Number} wall
  * 
  */ 
Room.prototype.possibleExits = function(room,axis,wall) {
  

}
 /**
  * @TODO: Find a valid x-coordinate for room exit
  * 
  * @param {Object} room
  * @param {String} axis - x or y
  * @param {Number} wall
  * 
  */
Room.prototype.placePathX = function(room,path,wall) {
   

}
 /**
  * @TODO: Find a valid y-coordinate for room exit
  * 
  * @param {Object} room
  * @param {String} axis - x or y
  * @param {Number} wall
  * 
  */
Room.prototype.placePathY = function(room,path,wall) {
 
}
 /**
   *  @TODO: Add vertical path between rooms.
   */ 

Room.prototype.addVertPath = function(room, path, wall) {

  
}
/**
 * @TODO: Add a horizontal path between rooms.
 */ 
Room.prototype.addHorizPath = function(room, path, wall) {

  
}
/**
  * @TODO: Connect to a room with a straight line.
  */ 
Room.prototype.directConnect = function(room, min) {

 
}
/**
 * @TODO: Write logic so that both rooms add each 
 *        other to their respective neighbors arrays
 * 
 * @param {Object} room
 */ 
Room.prototype.addNeighbor = function(room) {
 
}
/**
 * 
 * @TODO: Write logic for connecting one room to another with a straight 
 *        line.  If connection is successful, return TRUE.
 * 
 *        Constraint: The line cannot be adjacent to other lines.
 *        If an adjacent line cannot be found, don't connect and 
 *        return FALSE. 
 * 
 * @param {Number} room - the other room object
 * @param {Number} min - the minimum number of common coordinates
 */ 
Room.prototype.connectRoom = function(room, min=3) {


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
 * @TODO: Write a function that finds the first room in the 
 *        list that's available to connect.
 * 
 * @param {Object} myRoom
 * @param {Array} rooms
 */ 
Room.prototype.findNearbyRoom = function(myRoom, rooms) {
 
}


/**
 *  Phase 4: Recursion
 */ 

/**
 * 
 * @TODO: Write a recursive function that populates an array
 *        with the current room's neighbors and then calls itself on each neighbor, 
 *        adding the resulting ones to the array.
 * 
 * @param {Object} room
 * @param {Array} arr
 */ 

Room.prototype.searchNeighbors = function(room, arr) {
 

}
 /**
  * @TODO: Write logic that connects the remaining rooms in the network.
  */ 
Room.prototype.connectRemaining = function() {

  
}

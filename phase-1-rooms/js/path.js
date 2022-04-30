class Path {

   constructor(points = {}) {

      this.start = points.start || {
         x: 0,
         y: 0
      };

      this.end = points.end || {
         x: 0,
         y: 0
      };

      this.allowed = false;

   }
}
/**
 * 
 * @LATER: Write logic for testing whether five consecutive tiles in a
 *        vertical path is adjacent to another vertical path. 
 *        The x coordinate can either be the path's actual 
 *        one or a hypothetical passed-in value.
 * 
 * @param {Number} testX - optional x value
 */ 
Path.prototype.isAdjacentVert = function(testX) {

}

/**
 * 
 * @LATER: Write logic for testing whether five consecutive tiles in a
 *        horizontal path is adjacent to another horizontal path. 
 *        The y coordinate can either be the path's actual one or a
 *         hypothetical passed-in value
 * 
 * @param {Number} testY - optional y value
 */ 

Path.prototype.isAdjacentHoriz = function(testY) {

}
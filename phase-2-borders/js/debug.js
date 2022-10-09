/**
 * Generates a series of map rooms
 * 
 */

function debugLine(x1,y1,x2,y2) {
 var c = document.getElementById("debug");
 var ctx = c.getContext("2d");
 ctx.beginPath();
 ctx.strokeStyle = 'red';
 ctx.moveTo(x1*TILE_DIM, y1*TILE_DIM);
 ctx.lineTo(x2*TILE_DIM, y2*TILE_DIM);

 ctx.stroke(); 
}
function printNeighbors() {
   for (var room of game.rooms) {
      let ids = room.neighbors.map(x => x.id);

   }
}
function labelRooms() {
   let ctx = game.debugContext;
   ctx.fillStyle ='black';
   ctx.font = '15px Arial';
   game.rooms.forEach(function(room) {

      let txt = `r${room.id} (${room.start.x},${room.start.y})`;

      ctx.fillText(txt, (room.start.x+1)*TILE_DIM, room.center.y*TILE_DIM);
   });
}
   
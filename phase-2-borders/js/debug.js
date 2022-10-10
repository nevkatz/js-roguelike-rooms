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

function labelPaths() {
   let ctx = game.debugContext;
   ctx.fillStyle ='blue';
   ctx.font = '15px Arial';
   game.paths.forEach(function(path) {
      const x = TILE_DIM*Math.round(path.start.x + path.end.x)/2;
      const y = TILE_DIM*Math.round(path.start.y + path.end.y)/2;

      let txt = `p${path.id}`;

      ctx.fillText(txt, x,y);
   });
}

   
function debugTile(x, y, c_idx) {
    let color = TILE_COLORS[c_idx]
    let ctx = game.debugContext;
   //  game.context.clearRect(x * 10, y * 10, 10, 10);
   ctx.beginPath();
   ctx.rect(x * TILE_DIM, y * TILE_DIM, TILE_DIM, TILE_DIM);
   ctx.fillStyle = color;
   ctx.fill();
}
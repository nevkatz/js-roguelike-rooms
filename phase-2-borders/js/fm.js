var utils = utils || {};

utils.fm = {

    downloadFile: function(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    },
    exportMap:function() {

        let filename = 'map.txt';

        let {map,rooms,paths} = game;

        for (let i = 0; i < rooms.length; ++i) {
            let room = rooms[i];
            room.neighbors = room.neighbors.map(x => x.id);
            room.paths = room.paths.map(x => x.id);
            rooms[i] = room;
        }
        let pckg = {
            map,
            rooms,
            paths
        };

        let text = JSON.stringify(pckg);
        
        utils.fm.downloadFile(filename,text);
    },
    restoreMap:function() {
        /* this.numRows = this.map.grid.length;
         this.numCols = this.map.grid[0].length;
         let delay = 1;
         window.setTimeout(this.setMap, delay);*/

     }
};
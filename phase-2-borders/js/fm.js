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

    importContents:function(str) {
        console.log('str: ' + str);
        let obj = JSON.parse(str);
        game.reset();
        startGame(obj);
    },
    importMap:function(e) {
        var file = e.target.files[0];
        if (!file) {
                console.log('returning');
                return;
        }
        console.log('listen for load');
        var reader = new FileReader();
          
        reader.onload = function(e) {
        var contents = e.target.result;
        utils.fm.importContents(contents);
        console.log(contents);

        };
        reader.readAsText(file);
    },

    restoreMap:function() {
        /* this.numRows = this.map.grid.length;
         this.numCols = this.map.grid[0].length;
         let delay = 1;
         window.setTimeout(this.setMap, delay);*/

     }
};
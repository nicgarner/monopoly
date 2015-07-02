require.config({
    paths : {
        json: 'lib/json'
    }
});

define(['json!../data/board.json', 'Game', 'Canvas'], function(board, Game, Canvas){
        var game = new Game();
        game.addPlayer("nic", "hat");
        game.addPlayer("fran", "battleship");

        var canvas = new Canvas(game);
        canvas.makeCanvas();
        canvas.draw();

        var addEvent = function(elem, type, eventHandle) {
            if (elem == null || typeof(elem) == 'undefined') return;
            if (elem.addEventListener) {
                elem.addEventListener(type, eventHandle, false);
            } else if (elem.attachEvent) {
                elem.attachEvent("on" + type, eventHandle);
            } else {
                elem["on" + type] = eventHandle;
            }
        };

        var addBehaviour = function() {
            var rollButton = document.getElementById("rollButton");
            addEvent(rollButton, "click", function () {
                game.roll();
            });
            var rollDoublesButton = document.getElementById("rollDoublesButton");
            addEvent(rollDoublesButton, "click", function () {
                game.roll("doubles");
            });
            addEvent(window, "resize", canvas.resizeCanvas.bind(canvas));
        };

        addBehaviour();

        game.addCanvas(canvas);
    }
);
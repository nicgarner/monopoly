define("Game", ['Player', 'json!../data/board.json'], function(Player, board) {
    function Game() {
    }
    Game.prototype.addPlayer = function(name, token) {
        // create the new player
        var newPlayer = new Player(name, token);

        // add the player to the list of players
        if (!this.players) {
            this.players = [];
            this.currentPlayer = 0;
        }
        this.players.push(newPlayer);

        // add the player to the first space
        if (!board['spaces'][0]['players']) {
            board['spaces'][0]['players'] = [];
        }
        board['spaces'][0]['players'].push(newPlayer);
    };
    Game.prototype.swapPlayer = function() {
        this.currentPlayer++;
        if (this.currentPlayer == this.players.length) {
            this.currentPlayer = 0;
        }
        console.log("current player: ", this.players[this.currentPlayer]);
    };
    Game.prototype.showDialog = function() {
        this.dialog = {
            "message": "You landed on {space}. Buy it?",
            "options": [
                {
                    "text": "Yes",
                    "action": "buy the property"
                },
                {
                    "text": "No",
                    "action": "don't buy the property"
                }
            ]
        };
        this.canvas.draw();
    };
    Game.prototype.moveToken = function() {
        // get current player's space
        var player = this.players[this.currentPlayer];
        var currentSpace = player['space'];
        // remove current player from current space
        var index = board['spaces'][currentSpace]['players'].indexOf(player);
        board['spaces'][currentSpace]['players'].splice(index, 1);
        // add current player to next space
        var nextSpace = currentSpace + 1;
        if (nextSpace > 39) {
            nextSpace = 0;
        }
        if (!board['spaces'][nextSpace]['players']) {
            board['spaces'][nextSpace]['players'] = [];
        }
        board['spaces'][nextSpace]['players'].push(player);
        // update player's space
        player['space'] = nextSpace;
        // draw
        this.canvas.draw();
    };
    Game.prototype.roll = function(fixMethod) {
        var dialog = document.getElementById('dialog');
        if (dialog) {
            document.body.removeChild(dialog);
        }

        this.die1 = Math.floor((Math.random() * 6) + 1);
        if (fixMethod == "doubles") {
            this.die2 = this.die1;
        }
        else {
            this.die2 = Math.floor((Math.random() * 6) + 1);
        }
        var total = this.die1 + this.die2;

        var _this = this;
        var moves = 0;
        var int = setInterval(function() {
            _this.moveToken();
            moves++;
            if (moves >= total) {
                window.clearInterval(int);
                if (board['spaces'][_this.players[_this.currentPlayer]['space']]['type'] == "property") {
                    console.log('you landed on a property! buy it?');
                    _this.showDialog();
                }
                if (_this.die1 != _this.die2) {
                    _this.swapPlayer();
                }
            }
        }, 400);
    };
    Game.prototype.addCanvas = function(canvas) {
        this.canvas = canvas;
    };

    return Game;
});
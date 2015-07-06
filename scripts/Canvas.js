define("Canvas", ['json!../data/board.json'], function(board) {

    // helper functions
    function viewportWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    function viewportHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    function Canvas(game) {
        this.game = game;
    }
    Canvas.prototype.drawSky = function() {
        var skyGradient = this.context.createLinearGradient(0, viewportHeight(), 0, 0);
        skyGradient.addColorStop(0, '#CBE5F8');
        skyGradient.addColorStop(1, '#7EC0EE');
        this.context.fillStyle = skyGradient;
        this.context.fillRect(0, 0, viewportWidth(), viewportHeight());
    };
    Canvas.prototype.drawCornerSpace = function(x, y) {
        this.context.beginPath();
        this.context.lineTo(x + this.spaceSize * 2, y);
        this.context.lineTo(x + this.spaceSize * 2, y + this.spaceSize * 2);
        this.context.lineTo(x, y + this.spaceSize * 2);
        this.context.lineTo(x, y);
        this.context.closePath();
        this.context.stroke();

        var _this = this;
        if (board['spaces'][this.space]['players']) {
            board['spaces'][this.space]['players'].forEach(function (player) {
                var tokenImage = document.getElementById("token-" + player['token']);
                _this.context.drawImage(tokenImage,
                    x + _this.spaceSize / 1.15, y + _this.spaceSize / 1.15,
                    _this.spaceSize * 0.8, _this.spaceSize * 0.8);
            })
        }

        this.space++;
    };
    Canvas.prototype.drawRow = function(x, y, size) {
        this.drawCornerSpace(x + size - 2 * this.spaceSize, y + size - 2 * this.spaceSize);

        for (var i = 8; i >= 0; i--) {

            // draw a space
            this.context.beginPath();
            this.context.moveTo(x + this.spaceSize * 2 + this.spaceSize * i, y + this.spaceSize * 11);
            this.context.lineTo(x + this.spaceSize * 2 + this.spaceSize * (i + 1), y + this.spaceSize * 11);
            this.context.lineTo(x + this.spaceSize * 2 + this.spaceSize * (i + 1), y + this.spaceSize * 11 + this.spaceSize * 2);
            this.context.lineTo(x + this.spaceSize * 2 + this.spaceSize * i, y + this.spaceSize * 11 + this.spaceSize * 2);
            this.context.closePath();
            this.context.stroke();

            if (board['spaces'][this.space]['type'] == "property") {
                this.context.beginPath();
                this.context.moveTo(x + this.spaceSize * 2 + this.spaceSize * i, y + this.spaceSize * 11);
                this.context.lineTo(x + this.spaceSize * 2 + this.spaceSize * (i + 1), y + this.spaceSize * 11);
                this.context.lineTo(x + this.spaceSize * 2 + this.spaceSize * (i + 1), y + this.spaceSize * 11 + this.spaceSize / 2.4);
                this.context.lineTo(x + this.spaceSize * 2 + this.spaceSize * i, y + this.spaceSize * 11 + this.spaceSize / 2.4);
                this.context.closePath();

                this.context.fillStyle = board['sets'][board['spaces'][this.space]['set']]['colour'];
                this.context.fill();
                this.context.stroke();
            }

            this.context.fillStyle = '#333';
            var textLines = board['spaces'][this.space]['name'].split('\n');
            for (var t = 0; t < textLines.length; t++) {
                this.context.fillText(textLines[t], x + this.spaceSize * 2 + this.spaceSize * i + this.spaceSize / 2, y + this.spaceSize * 11.65 + this.lineHeight * t);
            }
            if (board['spaces'][this.space]['value']) {
                this.context.fillText('\u00A3' + board['spaces'][this.space]['value'], x + this.spaceSize * 2 + this.spaceSize * i + this.spaceSize / 2, y + this.spaceSize * 12.85);
            }

            var _this = this;
            if (board['spaces'][this.space]['players']) {
                board['spaces'][this.space]['players'].forEach(function (player) {
                    var tokenImage = document.getElementById("token-" + player['token']);
                    _this.context.drawImage(tokenImage,
                        x + _this.spaceSize * 2 + _this.spaceSize * i + _this.spaceSize / 10, y + _this.spaceSize * 11 + _this.spaceSize / 1.15,
                        _this.spaceSize * 0.8, _this.spaceSize * 0.8);
                })
            }

            this.space++;
        }
    };
    Canvas.prototype.drawBoard = function() {
        var x = 5.5;
        var y = 5.5;
        this.boardSize = this.canvas.width - 2*x;
        this.spaceSize = this.boardSize / 13;
        this.space = 0;

        this.context.lineWidth = 2.5;
        this.context.strokeStyle = '#333';

        this.fontSize = this.boardSize / 95;
        this.lineHeight = this.boardSize / 75;
        this.context.font = "bold " + this.fontSize + "px Arial";
        this.context.textAlign = 'center';

        // board
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x + this.boardSize, y);
        this.context.lineTo(x + this.boardSize, y + this.boardSize);
        this.context.lineTo(x, y + this.boardSize);
        this.context.lineTo(x, y);
        this.context.closePath();
        this.context.fillStyle = 'ivory';
        this.context.fill();
        this.context.stroke();

        // spaces
        this.context.save();
        this.drawRow(x, y, this.boardSize);
        this.context.translate(this.boardSize + 2 * x, 0);
        this.context.rotate(Math.PI / 2);
        this.drawRow(x, y, this.boardSize);
        this.context.translate(this.boardSize + 2 * x, 0);
        this.context.rotate(Math.PI / 2);
        this.drawRow(x, y, this.boardSize);
        this.context.translate(this.boardSize + 2 * x, 0);
        this.context.rotate(Math.PI / 2);
        this.drawRow(x, y, this.boardSize);
        this.context.restore();

        // dice
        if (this.game.die1 && this.game.die2) {
            var dieImage1 = document.getElementById("die-" + this.game.die1);
            var dieImage2 = document.getElementById("die-" + this.game.die2);
            this.context.drawImage(dieImage1, this.boardSize / 2, this.boardSize / 5, this.boardSize / 16, this.boardSize / 16);
            this.context.drawImage(dieImage2, this.boardSize / 2 + this.boardSize / 20, this.boardSize / 5 + this.boardSize / 20, this.boardSize / 16, this.boardSize / 16);
        }

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

        //dialog
        if (this.game.dialog) {
            var dialog = document.getElementById('dialog');
            if (!dialog) {
                dialog = document.createElement('div');
                dialog.className = "dialog";
                dialog.id = 'dialog';

                var paragraph = document.createElement('p');
                var unprocessedText = this.game.dialog.message;
                var space = board['spaces'][this.game.players[this.game.currentPlayer].space];
                paragraph.innerHTML = unprocessedText.replace('{space}', space.name);
                dialog.appendChild(paragraph);

                this.game.dialog['options'].forEach(function (option) {
                    var button = document.createElement('div');
                    button.className = "option";
                    button.innerHTML = option.text;
                    addEvent(button, "click", function () {
                        console.log(option.action)
                    });
                    dialog.appendChild(button);
                });

                document.body.appendChild(dialog);
            }
        }


    };

    Canvas.prototype.draw = function() {
        this.context.width = viewportWidth();
        //this.drawSky();
        this.drawBoard();
    };

    Canvas.prototype.resizeCanvas = function() {
        var canvasSize = this.canvas.offsetHeight;
        this.canvas.setAttribute('style', 'width: '+canvasSize+'px;');
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;
        this.draw();
    };

    Canvas.prototype.makeCanvas = function() {
        this.canvas = document.getElementById('board');
        this.context = this.canvas.getContext('2d');
        var canvasSize = this.canvas.offsetHeight;
        this.canvas.setAttribute('style', 'width: '+canvasSize+'px;');
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;
    };

    return Canvas;

});
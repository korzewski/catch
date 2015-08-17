'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var gridSize = 6;
var enemies = [];
var fieldManager;

var Game = (function () {
    function Game() {
        _classCallCheck(this, Game);

        game = this;
        canvas = document.getElementById('game');
        ctx = canvas.getContext('2d');

        this.player = new Player(0, 0);
        fieldManager = new FieldManager();
        enemies.push(new Enemy(20, 50));

        frame(); // start the first frame
    }

    _createClass(Game, [{
        key: 'render',
        value: function render(ctx, dt) {
            //console.log('game render dt: ', dt);
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            fieldManager.render(ctx);
            this.player.render(ctx);

            for (var i = 0; i < enemies.length; i++) {
                enemies[i].render(ctx);
            }
        }
    }, {
        key: 'update',
        value: function update(dt) {
            //console.log('game update: ', dt);
            this.player.update(dt);
        }
    }]);

    return Game;
})();

var Player = (function () {
    function Player(posX, posY) {
        var _this = this;

        _classCallCheck(this, Player);

        this.x = posX;
        this.y = posY;

        this.size = 5;
        this.speed = 2;
        this.direction = {
            x: 0,
            y: 0
        };
        this.color = '#333';
        this.color2 = '#f00';
        this.isDrawing = false;
        this.isMoving = false;

        this.currentRect = [];

        document.addEventListener('keydown', function (ev) {
            return _this.keyDown(ev.keyCode);
        }, false);
    }

    _createClass(Player, [{
        key: 'addNewPosition',
        value: function addNewPosition() {
            this.currentRect.push({ x: this.x, y: this.y });
            //console.log('currentRect: ', this.currentRect);
        }
    }, {
        key: 'resetCurrentPosition',
        value: function resetCurrentPosition() {
            this.currentRect = [];
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.direction.x = 0;
            this.direction.y = 0;

            if (this.isDrawing) {
                this.addNewPosition();
                fieldManager.addNewField(this.currentRect);
                this.resetCurrentPosition();

                if (this.x < this.size + 1) {
                    this.x = 0;
                } else if (this.x > canvas.clientWidth - this.size - gridSize - 1) {
                    this.x = canvas.clientWidth - this.size;
                } else if (this.y < this.size + 1) {
                    this.y = 0;
                } else if (this.y > canvas.clientHeight - this.size - gridSize - 1) {
                    this.y = canvas.clientHeight - this.size;
                }
            }

            this.isDrawing = false;
            this.isMoving = false;
        }
    }, {
        key: 'move',
        value: function move(dir) {
            this.isMoving = true;
            this.direction = dir;

            if (this.isDrawing) {
                this.addNewPosition();
            }
        }
    }, {
        key: 'keyDown',
        value: function keyDown(keyCode) {
            if (keyCode == 37) {
                this.move({ x: -1, y: 0 });
            } else if (keyCode == 38) {
                this.move({ x: 0, y: -1 });
            } else if (keyCode == 39) {
                this.move({ x: 1, y: 0 });
            } else if (keyCode == 40) {
                this.move({ x: 0, y: 1 });
            } else if (keyCode == 32) {
                if (!this.isDrawing) {
                    this.stop();
                }
            }
        }
    }, {
        key: 'render',
        value: function render(ctx) {
            if (this.isDrawing) {
                ctx.fillStyle = this.color2;
            } else {
                ctx.fillStyle = this.color;
            }
            ctx.fillRect(this.x, this.y, this.size, this.size);

            for (var i = 0; i < this.currentRect.length; i++) {
                ctx.fillRect(this.currentRect[i].x, this.currentRect[i].y, gridSize, gridSize);
            }
        }
    }, {
        key: 'update',
        value: function update(dt) {
            this.x += this.speed * this.direction.x;
            this.y += this.speed * this.direction.y;

            if (this.x > canvas.clientWidth - this.size / 2) {
                this.x = -this.size / 2;
            } else if (this.x < -this.size / 2) {
                this.x = canvas.clientWidth - this.size / 2;
            }

            if (this.y > canvas.clientHeight - this.size / 2) {
                this.y = -this.size / 2;
            } else if (this.y < -this.size / 2) {
                this.y = canvas.clientHeight - this.size / 2;
            }

            var isOvelap = false;
            for (var i = 0; i < fieldManager.rectangles.length; i++) {
                var x1 = fieldManager.rectangles[i][0];
                var y1 = fieldManager.rectangles[i][1];
                var x2 = x1 + fieldManager.rectangles[i][2];
                var y2 = y1 + fieldManager.rectangles[i][3];

                if (x1 - gridSize < this.x && x2 > this.x && y1 - gridSize < this.y && y2 > this.y) {
                    isOvelap = true;
                }
            }

            if (isOvelap) {
                //console.log('player overlap!');

                if (this.isDrawing) {
                    this.stop();
                }
            } else {
                if (this.isMoving) {
                    this.isDrawing = true;
                    if (this.currentRect.length == 0) {
                        this.addNewPosition();
                    }
                    //console.log('isDrawing!');
                }
            }
        }
    }]);

    return Player;
})();

var FieldManager = (function () {
    function FieldManager() {
        _classCallCheck(this, FieldManager);

        this.rectangles = [];
        this.rectangles.push([0, 0, canvas.clientWidth, gridSize], [canvas.clientWidth - gridSize, 0, gridSize, canvas.clientHeight], [0, canvas.clientHeight - gridSize, canvas.clientWidth, gridSize], [0, 0, gridSize, canvas.clientHeight]);
        this.color = '#888';

        this.currentRect = [];
    }

    _createClass(FieldManager, [{
        key: 'addNewField',
        value: function addNewField(array) {
            console.log('addNewField: ', array);
        }
    }, {
        key: 'render',
        value: function render(ctx) {
            ctx.fillStyle = this.color;

            for (var i = 0; i < this.rectangles.length; i++) {
                var x = this.rectangles[i][0];
                var y = this.rectangles[i][1];
                var width = this.rectangles[i][2];
                var height = this.rectangles[i][3];

                ctx.fillRect(x, y, width, height);
            }
        }
    }]);

    return FieldManager;
})();

var Enemy = (function () {
    function Enemy(x, y) {
        _classCallCheck(this, Enemy);

        this.x = x;
        this.y = y;
    }

    _createClass(Enemy, [{
        key: 'render',
        value: function render(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, gridSize / 2, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'blue';
            ctx.fill();
            //ctx.lineWidth = 1;
            //ctx.strokeStyle = '#003300';
            //ctx.stroke();
        }
    }]);

    return Enemy;
})();

//# sourceMappingURL=Game-compiled.js.map
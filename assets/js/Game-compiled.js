'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var canvas, ctx, game;

var fps = 60,
    step = 1 / fps,
    dt = 0,
    now,
    last = timestamp();

function timestamp() {
    if (window.performance && window.performance.now) return window.performance.now();else return new Date().getTime();
}

function frame() {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while (dt > step) {
        dt = dt - step;
        game.update(step);
    }
    game.render(ctx, dt);
    last = now;
    requestAnimationFrame(frame, canvas);
}

var Game = (function () {
    function Game() {
        _classCallCheck(this, Game);

        game = this;
        canvas = document.getElementById('game');
        ctx = canvas.getContext('2d');

        frame(); // start the first frame

        //ctx.fillStyle = '#f00';
        this.x = 100;
        this.y = 100;
        this.speed = 1;
    }

    _createClass(Game, [{
        key: 'render',
        value: function render(ctx, dt) {
            //console.log('game render dt: ', dt);

            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            ctx.fillRect(this.x, this.y, 5, 5);
        }
    }, {
        key: 'update',
        value: function update(dt) {
            //console.log('game update: ', dt);
            if (this.x > canvas.clientWidth) {
                this.x = 0;
            } else {
                this.x++;
            }
        }
    }]);

    return Game;
})();

//# sourceMappingURL=Game-compiled.js.map
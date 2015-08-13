var canvas, ctx, game;

var fps  = 60,
    step = 1/fps,
    dt   = 0,
    now, last = timestamp();

function timestamp() {
    if (window.performance && window.performance.now)
        return window.performance.now();
    else
        return new Date().getTime();
}

function frame() {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > step) {
        dt = dt - step;
        game.update(step);
    }
    game.render(ctx, dt);
    last = now;
    requestAnimationFrame(frame, canvas);
}

class Game {
    constructor(){
        game = this;
        canvas = document.getElementById('game');
        ctx = canvas.getContext('2d');

        frame(); // start the first frame

        //ctx.fillStyle = '#f00';
        this.x = 100;
        this.y = 100;
        this.speed = 1;

    }

    render(ctx, dt){
        //console.log('game render dt: ', dt);

        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.fillRect(this.x, this.y, 5, 5);
    }

    update(dt){
        //console.log('game update: ', dt);
        if(this.x > canvas.clientWidth){
            this.x = 0;
        } else {
            this.x++;
        }
    }
}
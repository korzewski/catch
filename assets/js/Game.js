var gridSize = 6;
var enemies = [];
var fieldManager;

class Game {
    constructor(){
        game = this;
        canvas = document.getElementById('game');
        ctx = canvas.getContext('2d');

        this.player = new Player(0, 0);
        fieldManager = new FieldManager();
        enemies.push(new Enemy(20, 50));

        frame(); // start the first frame
    }

    render(ctx, dt){
        //console.log('game render dt: ', dt);
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        fieldManager.render(ctx);
        this.player.render(ctx);

        for(var i = 0; i < enemies.length; i++){
            enemies[i].render(ctx);
        }
    }

    update(dt){
        //console.log('game update: ', dt);
        this.player.update(dt);
    }
}

class Player{
    constructor(posX, posY){
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

        document.addEventListener('keydown', (ev) => { return this.keyDown(ev.keyCode);  }, false);
    }

    addNewPosition(){
        this.currentRect.push({ x: this.x, y: this.y });
        //console.log('currentRect: ', this.currentRect);
    }

    resetCurrentPosition(){
        this.currentRect = [];
    }

    stop(){
        this.direction.x = 0;
        this.direction.y = 0;

        if(this.isDrawing){
            this.addNewPosition();
            fieldManager.addNewPoly(this.currentRect);
            this.resetCurrentPosition();

            if(this.x < this.size + 1){
                this.x = 0;
            } else if(this.x > canvas.clientWidth - this.size - gridSize - 1){
                this.x = canvas.clientWidth - this.size;
            } else if(this.y < this.size + 1){
                this.y = 0
            } else if(this.y > canvas.clientHeight - this.size - gridSize - 1){
                this.y = canvas.clientHeight - this.size;
            }
        }

        this.isDrawing = false;
        this.isMoving = false;
    }

    move(dir){
        this.isMoving = true;
        this.direction = dir;

        if(this.isDrawing){
            this.addNewPosition();
        }
    }

    keyDown(keyCode) {
        if(keyCode == 37){
            this.move({ x: -1, y: 0 })
        }else if(keyCode == 38){
            this.move({ x: 0, y: -1 })
        } else if(keyCode == 39){
            this.move({ x: 1, y: 0 })
        } else if(keyCode == 40){
            this.move({ x: 0, y: 1 })
        } else if(keyCode == 32){
            if(!this.isDrawing){
                this.stop();
            }
        }
    }

    render(ctx){
        if(this.isDrawing){
            ctx.fillStyle = this.color2;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(this.x, this.y, this.size, this.size);

        for(var i = 0; i < this.currentRect.length; i++){
            ctx.fillRect(this.currentRect[i].x, this.currentRect[i].y, gridSize, gridSize);
        }
    }

    update(dt){
        this.x += this.speed * this.direction.x;
        this.y += this.speed * this.direction.y;

        if(this.x > canvas.clientWidth - this.size/2){
            this.x = -this.size/2;
        } else if(this.x < -this.size/2){
            this.x = canvas.clientWidth - this.size/2;
        }

        if(this.y > canvas.clientHeight - this.size/2){
            this.y = -this.size/2;
        } else if(this.y < -this.size/2){
            this.y = canvas.clientHeight - this.size/2;
        }

        var isOvelap = false;
        for(let i = 0; i < fieldManager.rectangles.length; i++){
            let x1 = fieldManager.rectangles[i][0];
            let y1 = fieldManager.rectangles[i][1];
            let x2 = x1 + fieldManager.rectangles[i][2];
            let y2 = y1 + fieldManager.rectangles[i][3];

            if(x1 - gridSize < this.x && x2 > this.x && y1 - gridSize < this.y && y2 > this.y){
                isOvelap = true;
            }
        }

        if(isOvelap){
            //console.log('player overlap!');

            if(this.isDrawing){
                this.stop();
            }

        } else {
            if(this.isMoving){
                this.isDrawing = true;
                if(this.currentRect.length == 0){
                    this.addNewPosition();
                }
                //console.log('isDrawing!');
            }
        }
    }

}


class FieldManager{
    constructor(){
        this.rectangles = [];
        this.rectangles.push(
            [0, 0, canvas.clientWidth, gridSize],
            [canvas.clientWidth - gridSize, 0, gridSize, canvas.clientHeight],
            [0, canvas.clientHeight - gridSize, canvas.clientWidth, gridSize],
            [0, 0, gridSize, canvas.clientHeight]
        );
        this.color = '#888';

        this.polyArray = [];
    }

    addNewPoly(array){
        for(var i = 0; i < array.length; i++){
            var moduloX = array[i].x % gridSize;
            var moduloY = array[i].y % gridSize;
            if(moduloX){
                array[i].x -= moduloX;
            }

            if(moduloY){
                array[i].y -= moduloY;
            }

            if(array[i].x == gridSize){
                array[i].x = 0;
            } else if(array[i].x == canvas.clientWidth - gridSize*2 || array[i].x == canvas.clientWidth - gridSize*3){
                array[i].x = canvas.clientWidth;
            }


            if(array[i].y == gridSize){
                array[i].y = 0;
            } else if(array[i].y == canvas.clientHeight - gridSize*2 || array[i].y == canvas.clientHeight - gridSize*3){
                array[i].y = canvas.clientHeight;
            }

        }

        if((array[0].x == 0 && array[array.length - 1].y == 0) || (array[0].y == 0 && array[array.length - 1].x == 0)){
            array.push({ x: 0, y: 0 });
        } else if((array[0].x == canvas.clientWidth && array[array.length - 1].y == 0) || (array[0].y == 0 && array[array.length - 1].x == canvas.clientWidth)){
            array.push({ x: canvas.clientWidth, y: 0 });
        } else if((array[0].x == canvas.clientWidth && array[array.length - 1].y == canvas.clientHeight) || (array[0].y == canvas.clientHeight && array[array.length - 1].x == canvas.clientWidth)){
            array.push({ x: canvas.clientWidth, y: canvas.clientHeight });
        } if((array[0].x == 0 && array[array.length - 1].y == canvas.clientHeight) || (array[0].y == canvas.clientHeight && array[array.length - 1].x == 0)){
            array.push({ x: 0, y: canvas.clientHeight });
        }

        this.polyArray.push(array);

        console.log('addNewPoly: ' , array);

    }

    render(ctx){
        ctx.fillStyle = '#0f0';

        for(var i = 0; i < this.polyArray.length; i++){
            ctx.beginPath();
            for(var j = 0; j < this.polyArray[i].length; j++){
                if(j == 0){
                    ctx.moveTo(this.polyArray[i][j].x, this.polyArray[i][j].y);
                } else {
                    ctx.lineTo(this.polyArray[i][j].x, this.polyArray[i][j].y);
                }
            }
            ctx.closePath();
            ctx.fill();
        }

        ctx.fillStyle = this.color;
        for(let i = 0; i < this.rectangles.length; i++){
            let x = this.rectangles[i][0];
            let y = this.rectangles[i][1];
            let width = this.rectangles[i][2];
            let height = this.rectangles[i][3];

            ctx.fillRect(x, y, width, height);
        }

    }
}

class Enemy{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    render(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, gridSize/2, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
        //ctx.lineWidth = 1;
        //ctx.strokeStyle = '#003300';
        //ctx.stroke();
    }
}
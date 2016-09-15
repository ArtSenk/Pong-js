"use strict";

function Area() {
    var canvas = document.getElementById("area");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "#BD0F0F";
    this.context.font="20px Georgia";
    this.img = new Image();
    this.img.src = "smiley.gif";

    this.key = new Key();

    this.paddle1 = new Paddle(5, 155);
    this.paddle2 = new Paddle(this.width-20, 155);
    this.paddle1.speed = 4;
    this.paddle2.speed = 4;

    this.display1 = new Display(this.width/4, 20);
    this.display2 = new Display(this.width*3/4, 20);

    this.ball = new Ball();
    this.ball.x = this.width/2;
    this.ball.y = this.height/2;
    this.ball.sY = Math.floor(Math.random()*14 - 6);
    this.ball.sX = 8 - Math.abs(this.ball.sY);
}

Area.prototype.draw = function () {
    this.context.clearRect(0, 0, this.width, this.height);

    this.context.drawImage(this.img, this.ball.x, this.ball.y, this.ball.width, this.ball.height);

    this.paddle1.draw(this.context);
    this.paddle2.draw(this.context);

    this.display1.draw(this.context);
    this.display2.draw(this.context);
};

Area.prototype.update = function () {
    if (this.key.isPressed(40)) {
        this.paddle2.y = Math.min(this.height - this.paddle2.height, this.paddle2.y + this.paddle2.speed);
    } else if (this.key.isPressed(38)) {
        this.paddle2.y = Math.max(0, this.paddle2.y - this.paddle2.speed);
    }

    if (this.ball.y < this.paddle1.y + this.paddle1.height/2) {
        this.paddle1.y = Math.max(0, this.paddle1.y - this.paddle1.speed);
    }
    if (this.ball.y > this.paddle1.y + this.paddle1.height/2) {
        this.paddle1.y = Math.min(this.height - this.paddle1.height, this.paddle1.y + this.paddle1.speed);
    }

    this.ball.update();
    if (this.ball.x > this.width - this.ball.width || this.ball.x < 0) {
        this.ball.sX = -this.ball.sX;
    } else if (this.ball.y > this.height - this.ball.height || this.ball.y < 0) {
        this.ball.sY = -this.ball.sY;
    }

    if (interaction(this.paddle1, this.ball) && this.ball.sX < 0) {
        this.ball.sX = -this.ball.sX;
        this.ball.sY += Math.floor(Math.random()*14 - 6);
    } else if (interaction(this.paddle2, this.ball) && this.ball.sX > 0) {
        this.ball.sX = -this.ball.sX;
        this.ball.sY = Math.floor(Math.random()*14 - 6);
    }

    if (this.ball.x + this.ball.width >= this.width) {
        this.score(this.paddle1);
    } else if (this.ball.x <= 0) {
        this.score(this.paddle2);
    }

    this.display1.value = this.paddle1.score;
    this.display2.value = this.paddle2.score;
};

Area.prototype.score = function (paddle_) {
    paddle_.score++;

    var paddleX = paddle_;
    if (paddleX == this.paddle1) { paddleX = 0; } else { paddleX = 1; }

    this.ball.x = this.width/2;
    this.ball.y = this.height/2;
    this.ball.sY = Math.floor(Math.random()*12 - 6);
    this.ball.sX = 7 - Math.abs(this.ball.sY);
    if (paddleX == 1) { this.ball.sX *= -1; }
};


function Paddle(x, y) {
    this.x = x;
    this.y = y;
    this.width = 15;
    this.height = 90;
    this.score = 0;
}

Paddle.prototype.draw = function (paddle) {
    paddle.fillRect(this.x, this.y, this.width, this.height);
};


function Ball() {
    this.x = 0;
    this.y = 0;
    this.sX = 0;
    this.sY = 0;
    this.width = 21;
    this.height = 21;
}

Ball.prototype.update = function() {
    this.x += this.sX;
    this.y += this.sY;
};


function Key() {
    this.keystrokes = [];

    this.keydown = function(e) {
        this.keystrokes[e.keyCode] = true;
    };

    this.keyup = function(e) {
        this.keystrokes[e.keyCode] = false;
    };

    document.addEventListener("keydown", this.keydown.bind(this));
    document.addEventListener("keyup", this.keyup.bind(this));
}

Key.prototype.isPressed = function(key) {
    return this.keystrokes[key] ? true : false;
};

Key.prototype.addKeyPressListener = function(keyCode, callback) {
    document.addEventListener("keypress", function(e) {
        if (e.keyCode == keyCode)
            callback(e);
    });
};


function Display(x, y) {
    this.x = x;
    this.y = y;
    this.value = 0;
}

Display.prototype.draw = function(ctx) {
    ctx.fillText(this.value, this.x, this.y);
};

function interaction(paddle, ball) {
    if (paddle.y < ball.y + ball.height && paddle.x < ball.x + ball.width &&
        ball.y < paddle.y + paddle.height && ball.x < paddle.x + paddle.width) {
        return true;
    } else {
        return false;
    }
}


var area = new Area();
function Start() {
    area.update();
    area.draw();

    setTimeout(Start, 20);
}
Start();
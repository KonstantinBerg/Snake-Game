class GameField {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.getElementById('gameField');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.width * 20;
        this.canvas.height = this.height * 20;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCell(x, y, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x * 20, y * 20, 20, 20);
    }
}

class Snake {
    constructor(gameField) {
        this.gameField = gameField;
        this.reset();
        this.direction = { x: 1, y: 0 };
    }

    reset() {
        this.body = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
    }

    control(event) {
        switch (event.key) {
            case 'ArrowUp':
                if (this.direction.y === 0) this.direction = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                if (this.direction.y === 0) this.direction = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                if (this.direction.x === 0) this.direction = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                if (this.direction.x === 0) this.direction = { x: 1, y: 0 };
                break;
        }
    }

    update() {
        const newHead = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        };

        if (this.checkCollision(newHead)) {
            return false;
        }

        this.body.unshift(newHead);
        this.body.pop();
        return true;
    }

    draw() {
        this.body.forEach(segment => this.gameField.drawCell(segment.x, segment.y, 'green'));
    }

    grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push(tail);
    }

    checkCollision(position) {
        if (position.x < 0 || position.x >= this.gameField.width || position.y < 0 || position.y >= this.gameField.height) {
            return true;
        }
        return this.body.some(segment => segment.x === position.x && segment.y === position.y);
    }
}

class Apple {
    constructor(gameField) {
        this.gameField = gameField;
        this.position = { x: 0, y: 0 };
        this.placeApple();
    }

    draw() {
        this.gameField.drawCell(this.position.x, this.position.y, 'red');
    }

    placeApple() {
        this.position = {
            x: Math.floor(Math.random() * this.gameField.width),
            y: Math.floor(Math.random() * this.gameField.height)
        };
    }

    getPosition() {
        return this.position;
    }
}

class Score {
    constructor(score) {
        this._score = score;
        this.scoreElement = document.getElementById('score');
    }

    draw() {
        this.scoreElement.innerText = `Score: ${this._score}`;
    }

    increase() {
        this._score += 1;
        this.draw();
    }

    reset() {
        this._score = 0;
        this.draw();
    }
}

class Main {
    constructor() {
        this.gameField = new GameField(20, 20);
        this.snake = new Snake(this.gameField);
        this.apple = new Apple(this.gameField);
        this.score = new Score(0);
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.snake.control(e));
        this.gameLoop = setInterval(() => this.update(), 100);
    }

    update() {
        if (this.snake.update()) {
            if (this.snake.checkCollision(this.apple.getPosition())) {
                this.snake.grow();
                this.apple.placeApple();
                this.score.increase();
            }
            this.draw();
        } else {
            this.gameOver();
        }
    }

    draw() {
        this.gameField.clear();
        this.apple.draw();
        this.snake.draw();
        this.score.draw();
    }

    gameOver() {
        clearInterval(this.gameLoop);
        alert("Game Over!");
        this.score.reset();
        this.snake.reset();
        this.apple.placeApple();
        this.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Main();
});
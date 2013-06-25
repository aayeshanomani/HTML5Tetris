
var createjs;

module Graphics {

    export class TetrisRoot {
        
        constructor() {
        } 

        bind(char, callback) {
        }
    }

    export class TetrisTimer {

        constructor() {
            createjs.Ticker.setInterval(200);
            createjs.Ticker.setFPS(2);
            createjs.Ticker.useRAF = true;
        }

        static pause() {
            var paused = !createjs.Ticker.getPaused();
            createjs.Ticker.setPaused(paused);
        }

        setCallback(callback) {
            createjs.Ticker.addListener(callback);
            //createjs.Ticker.addEventListener("tick", callback);
        }
    } 

    export class TetrisCanvas {

        public stage; 
        constructor() {
            this.stage = new createjs.Stage("tetris");
        }

        place(height, width, x, y) {
        }

        addChild(ele: any) {
            this.stage.addChild(ele);
        }

        removeChild(ele: any) {
            this.stage.removeChild(ele);
        }

        update() {
            this.stage.update();
        }

        unplace() {
        }

        remove() {
        }
    }

    export class TetrisRect {

        private rect;
        private canvas : TetrisCanvas;

        constructor(canvas: TetrisCanvas, x, y, w, h, color) {
            this.rect = new createjs.Shape();
            this.rect.graphics.beginFill(color).drawRect(x, y, w, h);
            this.canvas = canvas;
            this.canvas.addChild(this.rect);
            this.canvas.update();
        }

        move(dx: number, dy: number) {
            this.rect.x += dx;
            this.rect.y += dy;
        }

        remove() {
            this.canvas.removeChild(this.rect);
        }
    } 
}


module Game {

    export class Piece {
        
        board: Board;
        all_rotations;
        rotation_index;
        color;
        base_position = [5,0];
        moved = true;
        
        constructor(pointArray, board : Board) {
            this.all_rotations = pointArray;
            this.board = board;
            this.rotation_index = 0; //TODO:randomize
            this.color = "Red"; //TODO: get random from All Colors array
            this.base_position = [5,0];
            this.moved = true;
        }

        current_rotation() {
            return this.all_rotations[this.rotation_index];
        }

        dropByOne() {
            this.moved = this.move(0, 1, 0);
            return this.moved;
        }

        move(deltaX, deltaY, deltaRotation) {
            this.moved = true;
            var potential = this.all_rotations[(this.rotation_index + deltaRotation) % this.all_rotations.length];

            for (var index = 0; index < potential.length; ++index) {
                var posns = potential[index];
                if(this.board.emptyAt([
                    posns[0] + deltaX + this.base_position[0], 
                    posns[1] + deltaY + this.base_position[1]
                ])) {
                    this.moved = false;
                }
            }


            if (this.moved) {
                this.base_position[0] += deltaX;
                this.base_position[1] += deltaY;
                this.rotation_index = (this.rotation_index + deltaRotation) % this.all_rotations.length;
            }

            return this.moved;
        }

        static rotations (point_array) {

        }
        
        static next_piece(board: Board) {
            return new Piece(this.All_Pieces[0], board);
        }

        static All_Pieces = [[[[0, 0], [1, 0], [0, 1], [1, 1]]]];

        static AllColors = ['DarkGreen', 'dark blue', 'dark red', 'gold2', 'Purple3', 
               'OrangeRed2', 'LightSkyBlue'];
    }

    export class Board {

        grid: any;
        currentBlock: Piece;
        score = 0;
        game: Tetris;
        delay = 500;

        blockSize = 15;
        numColumns = 10;
        numRows = 27;
        current_pos: any;

        
        constructor(game: Tetris) {
            //this.grid = _.map(_.range(this.numRows), function(){return _.range(this.numColumns)});

            this.grid = new Array(this.numRows);

            for (var i = 0; i < this.numRows; i++) {
                this.grid[i] = new Array(this.numColumns);
            }

            this.currentBlock = Piece.next_piece(this);
            this.game = game;
            
        }

        emptyAt (point) {

        }

        run() {
            var ran = this.currentBlock.dropByOne();

            if (!ran) {
                //this.storeCurrent();
            
            }

            this.draw();
        
        }

        storeCurrent() {
        }

        draw() {
            this.current_pos = this.game.draw_piece(this.currentBlock, this.current_pos);
        }
    }

    export class Tetris {

        root: Graphics.TetrisRoot;
        ticker: Graphics.TetrisTimer;
        canvas: Graphics.TetrisCanvas;
        rect: Graphics.TetrisRect;
        board: Board;

        isRunning: bool;

        constructor() {
            this.root = new Graphics.TetrisRoot();
            this.ticker = new Graphics.TetrisTimer();
            this.canvas = new Graphics.TetrisCanvas();
            this.rect = new Graphics.TetrisRect(this.canvas, 2, 2, 25, 25, "red");
            this.ticker.setCallback(this);
            this.board = new Board(this);
            this.isRunning = true;
            //createjs.Ticker.addListener(this);
            //createjs.Ticker.addEventListener("tick", this.tick);
        }
        
        tick() {
            if (this.isRunning) {
                //this.rect.move(0, 3);
                this.board.run();
            }
        }

        draw_piece(piece: Piece, old) {

            if (old != null && piece.moved) {
                for (var i = 0; i < old.length; i++) {
                    var o = old[i];
                    o.remove();
                }
            }
            
            var size = this.board.blockSize;
            var blocks = piece.current_rotation();
            var start = piece.base_position;

            var results = [];

            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];

                results.push(new Graphics.TetrisRect(this.canvas, 
                                    start[0] * size + block[0]*size + 3,
                                    start[1] * size + block[1]*size,
                                    start[0] * size + size + block[0]*size + 3,
                                    start[1] * size + size + block[1]*size,
                                    piece.color));
            }

            return results;
        }
    }
}

var g = new Game.Tetris();

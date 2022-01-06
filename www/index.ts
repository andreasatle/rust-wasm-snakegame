// Import rust code.
import init, { GameStatus, World } from "snake_game";

// Definition of colors
const LIGHT_BLUE   = '#85C1E9';
const BLUE         = '#2980B9';
const DARK_BLUE    = '#1F618D';
const GREEN        = '#1ABC9C';
const RED          = '#CB4335';
const ALMOST_WHITE = '#F0F0F0';

// Set some global variables.
const CELL_SIZE = 10;
const WORLD_WIDTH = 20;
const INITIAL_SNAKE_WIDTH = 3;

// Setup the canvas from HTML.
const canvas = <HTMLCanvasElement> document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");

init().then(wasm => {
    // Create an instance of the world (the game).
    const world = World.new(WORLD_WIDTH, INITIAL_SNAKE_WIDTH);
    const worldWidth = world.width();

    // Set the dimensions of the canvas.
    canvas.height = canvas.width = worldWidth*CELL_SIZE;

    /// TEST START
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown: any = null;                                                        
    var yDown: any = null;

    function getTouches(evt: any) {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }                                                     
                                                                         
    function handleTouchStart(evt: any) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                         
    function handleTouchMove(evt: any) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        var cmd: string;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                /* right swipe */ 
                cmd = 'ArrowLeft';
            } else {
                /* left swipe */
                cmd = 'ArrowRight';
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* down swipe */ 
                cmd = 'ArrowUp';
            } else { 
                /* up swipe */
                cmd = 'ArrowDown';
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
        world.keystroke(cmd);
    };
    /// TEST END
    // Listen for key-strokes.
    document.addEventListener("keydown", (e) => {
        world.keystroke(e.code);
    })

    // Draw the grid.
    function drawWorld(color: string) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        for (let x = 0; x <= WORLD_WIDTH; x++) {
            ctx.moveTo(CELL_SIZE*x, 0);
            ctx.lineTo(CELL_SIZE*x, canvas.height);
        }
        for (let y = 0; y <= WORLD_WIDTH; y++) {
            ctx.moveTo(0, CELL_SIZE*y);
            ctx.lineTo(canvas.width, CELL_SIZE*y);
        }
        ctx.stroke();
    }

    // Draw the snake within the grid.
    function drawSnake(headColor: string, tailColor: string) {
        const snake_len = world.snake_len()
        const snakeCells = new Uint32Array(wasm.memory.buffer, world.snake_cells(), snake_len)
        
        snakeCells.forEach((snakeIdx,i) => {
            ctx.fillStyle = (i == snake_len-1) ? headColor : tailColor;
            let row = world.row(snakeIdx);
            let col = world.col(snakeIdx);
            ctx.beginPath();
            ctx.fillRect(col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
        })
        ctx.stroke()
    }

    // Draw a single cell in the grid (of the world).
    function drawCell(idx: number, color: string) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.fillRect(
            world.col(idx)*CELL_SIZE,
            world.row(idx)*CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE);
        ctx.stroke()
    }

    // Message that we should hit a key to start a new game.
    const idleState = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld(ALMOST_WHITE);
        ctx.strokeStyle = GREEN;
        ctx.font = "20px Arial";
        ctx.strokeText("Press any key", 10, 50);
    }

    // Draw and update the game.
    const playingState = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld(LIGHT_BLUE);
        drawSnake(DARK_BLUE, BLUE);
        drawCell(world.reward_cell(), GREEN);
        drawCell(world.penalty_cell(), RED);
        world.update();
    }

    // Message game over after illegal move.
    const gameOverState = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld(ALMOST_WHITE);
        ctx.font = "20px Arial";
        ctx.strokeStyle = RED;
        ctx.strokeText("GAME OVER!", 10, 50);
        ctx.strokeText("Press any key", 10, 100);
    }

    // Game-loop every 100 ms.
    const gameLoop = () => {
        setTimeout(_ => {
            switch (world.status()) {
                case GameStatus.Idle:
                    idleState();
                    break;
                case GameStatus.Playing:
                    playingState();
                    break;
                case GameStatus.GameOver:
                    gameOverState();
                    break;
            }
            requestAnimationFrame(gameLoop);
        }, 100)
    }
    gameLoop()
})
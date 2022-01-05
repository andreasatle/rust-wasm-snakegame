//! snake_game is the engine of a Snake Game for the browser.

/// Activate wasm_bindgen to be able to compile to wasm.
use wasm_bindgen::prelude::*;

/// Replace the default allocator with wee_alloc.
/// This is suitable when compiling to wasm.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// Import javascript utility files, for random number generation.
#[wasm_bindgen(module = "/www/utils/rand.js")]
extern "C" {
    fn rand(_: usize) -> usize;
}

/// GameStatus contains the different states the game can be in.
/// The state affects what happens at a keystroke from the user.
/// It is also used in the main loop of the game in javascript.
#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum GameStatus {
    /// State before Game is starting.
    Idle,
    /// State where game is being played.
    Playing,
    /// State after snake did illegal move.
    GameOver,
}

/// Direction keeps the different directions.
enum Direction {
    Up,
    Right,
    Down,
    Left,
}

/// SnakeCell is an abstraction of usize.
type SnakeCell = usize;

/// Snake contains information about the moving snake.
struct Snake {
    /// Vector containing the index to each cell of the snake.
    body: Vec<SnakeCell>,
    /// The snakes current direction.
    direction: Direction,
    /// How many cells we should current extend the snake with.
    extend: usize,
    /// How much we increase the extension, every time we get a reward.
    increase_extend: usize,
}

impl Snake {
    /// Create a new instance of a Snake.
    fn new(index: SnakeCell, extend: usize) -> Snake {
        Snake {
            body: vec![index],
            direction: Direction::Right,
            extend,
            increase_extend: 1,
        }
    }
    /// Reset an existing instance of a Snake.
    fn reset(&mut self, index: SnakeCell, extend: usize) {
        self.body.clear();
        self.body.push(index);
        self.extend = extend;
        self.increase_extend = 1;
    }

    /// Indicate to extend the snake by one.
    fn extend_by_one(&mut self) {
        self.extend += 1;
    }

    /// Indicate to extend the snake with an increasing amount each time.
    fn extend_after_reward(&mut self) {
        self.extend += self.increase_extend;
        self.increase_extend += 1;
    }
}

/// World contains the information about the playfield.
#[wasm_bindgen]
pub struct World {
    /// Dimension of game.
    width: usize,
    /// An instance of a Snake.
    snake: Snake,
    /// One cell that gives reward.
    reward_cell: usize,
    /// One cell that ends the game.
    penalty_cell: usize,
    /// Status of the game.
    pub status: GameStatus,
}

#[wasm_bindgen]
impl World {
    /// Create a new instance of the world.
    pub fn new(width: usize, extend: usize) -> World {
        World {
            width,
            snake: Snake::new(rand(width * width), extend),
            reward_cell: rand(width * width),
            penalty_cell: rand(width * width),
            status: GameStatus::Idle,
        }
    }

    /// Reset an existing instance of the world.
    pub fn reset(&mut self, extend: usize) {
        self.snake.reset(rand(self.width * self.width), extend);
        self.reward_cell = rand(self.width * self.width);
        self.penalty_cell = rand(self.width * self.width);
        self.status = GameStatus::Playing;
    }

    /// Getter for the width.
    pub fn width(&self) -> usize {
        self.width
    }

    /// Getter for the world index to the reward cell.
    pub fn reward_cell(&self) -> usize {
        self.reward_cell
    }

    /// Getter for the world index to the penalty cell.
    pub fn penalty_cell(&self) -> usize {
        self.penalty_cell
    }

    /// Compute the row from the world index.
    pub fn row(&self, idx: usize) -> usize {
        idx / self.width
    }

    /// Compute the column from the world index.
    pub fn col(&self, idx: usize) -> usize {
        idx % self.width
    }

    /// Compute the world index from the row and column.
    pub fn index(&self, row: usize, col: usize) -> usize {
        row * self.width + col
    }

    /// Update the state of a game that is going on.
    pub fn update(&mut self) {

        if self.snake.extend > 0 {
            // Extending the snake, don't remove the tail.
            self.snake.extend -= 1;
        } else {
            // Keep the length of the snake, remove first entry.
            for i in 1..self.snake.body.len() {
                self.snake.body[i - 1] = self.snake.body[i];
            }
            self.snake.body.pop();
        }

        let head_idx = self.snake.body[self.snake.body.len() - 1];
        let row = self.row(head_idx);
        let col = self.col(head_idx);

        // Get the new world index for the head.
        let new_idx = match self.snake.direction {
            Direction::Right => self.index(row, if col + 1 < self.width { col + 1 } else { 0 }),
            Direction::Down => self.index(if row + 1 < self.width { row + 1 } else { 0 }, col),
            Direction::Left => self.index(row, if col > 0 { col - 1 } else { self.width - 1 }),
            Direction::Up => self.index(if row > 0 { row - 1 } else { self.width - 1 }, col),
        };

        // If snake bites itself, the game is over.
        if self.snake.body.contains(&new_idx) {
            self.status = GameStatus::GameOver;
            return;
        }

        // Add the new head.
        self.snake.body.push(new_idx);

        // If the new head hits the penalty cell, then the game is over.
        if new_idx == self.penalty_cell() {
            self.status = GameStatus::GameOver;
            return;
        }

        // If the new head hits the reward cell, then the snake is extended
        // and we randomly choose the reward and penalty cells.
        // Here we also could keep track of a score (2DO...).
        if new_idx == self.reward_cell {
            self.reward_cell = rand(self.width * self.width);
            self.penalty_cell = rand(self.width * self.width);
         
            self.snake.extend_after_reward();
        }
    }

    /// Update the direction of the snake depending on keystroke.
    fn update_direction(&mut self, key: &str) {
        match key {
            "ArrowRight" => self.snake.direction = Direction::Right,
            "ArrowLeft" => self.snake.direction = Direction::Left,
            "ArrowUp" => self.snake.direction = Direction::Up,
            "ArrowDown" => self.snake.direction = Direction::Down,
            _ => {}
        }
    }

    /// Take action on keystroke, depending on game status.
    pub fn keystroke(&mut self, key: &str) {
        self.snake.extend_by_one();
        match self.status {
            GameStatus::Idle => self.reset(3),
            GameStatus::Playing => self.update_direction(key),
            GameStatus::GameOver => self.status = GameStatus::Idle,
        }
    }

    /// Return the pointer to the snake body.
    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }

    /// Return the length to the snake body.
    pub fn snake_len(&self) -> usize {
        self.snake.body.len()
    }

    /// Getter for the GameStatus.
    pub fn status(&self) -> GameStatus {
        self.status
    }
}

/* tslint:disable */
/* eslint-disable */
/**
* GameStatus contains the different states the game can be in.
* The state affects what happens at a keystroke from the user.
* It is also used in the main loop of the game in javascript.
*/
export enum GameStatus {
/**
* State before Game is starting.
*/
  Idle,
/**
* State where game is being played.
*/
  Playing,
/**
* State after snake did illegal move.
*/
  GameOver,
}
/**
* World contains the information about the playfield.
*/
export class World {
  free(): void;
/**
* Create a new instance of the world.
* @param {number} width
* @param {number} extend
* @returns {World}
*/
  static new(width: number, extend: number): World;
/**
* Reset an existing instance of the world.
* @param {number} extend
*/
  reset(extend: number): void;
/**
* Getter for the width.
* @returns {number}
*/
  width(): number;
/**
* Getter for the world index to the reward cell.
* @returns {number}
*/
  reward_cell(): number;
/**
* Getter for the world index to the penalty cell.
* @returns {number}
*/
  penalty_cell(): number;
/**
* Compute the row from the world index.
* @param {number} idx
* @returns {number}
*/
  row(idx: number): number;
/**
* Compute the column from the world index.
* @param {number} idx
* @returns {number}
*/
  col(idx: number): number;
/**
* Compute the world index from the row and column.
* @param {number} row
* @param {number} col
* @returns {number}
*/
  index(row: number, col: number): number;
/**
* Update the state of a game that is going on.
*/
  update(): void;
/**
* Take action on keystroke, depending on game status.
* @param {string} key
*/
  keystroke(key: string): void;
/**
* Return the pointer to the snake body.
* @returns {number}
*/
  snake_cells(): number;
/**
* Return the length to the snake body.
* @returns {number}
*/
  snake_len(): number;
/**
* Getter for the GameStatus.
* @returns {number}
*/
  status(): number;
/**
* Status of the game.
*/
  status: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_world_free: (a: number) => void;
  readonly __wbg_get_world_status: (a: number) => number;
  readonly __wbg_set_world_status: (a: number, b: number) => void;
  readonly world_new: (a: number, b: number) => number;
  readonly world_reset: (a: number, b: number) => void;
  readonly world_width: (a: number) => number;
  readonly world_reward_cell: (a: number) => number;
  readonly world_penalty_cell: (a: number) => number;
  readonly world_row: (a: number, b: number) => number;
  readonly world_col: (a: number, b: number) => number;
  readonly world_index: (a: number, b: number, c: number) => number;
  readonly world_update: (a: number) => void;
  readonly world_keystroke: (a: number, b: number, c: number) => void;
  readonly world_snake_cells: (a: number) => number;
  readonly world_snake_len: (a: number) => number;
  readonly world_status: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

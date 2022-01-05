/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function __wbg_world_free(a: number): void;
export function __wbg_get_world_status(a: number): number;
export function __wbg_set_world_status(a: number, b: number): void;
export function world_new(a: number, b: number): number;
export function world_reset(a: number, b: number): void;
export function world_width(a: number): number;
export function world_reward_cell(a: number): number;
export function world_penalty_cell(a: number): number;
export function world_row(a: number, b: number): number;
export function world_col(a: number, b: number): number;
export function world_index(a: number, b: number, c: number): number;
export function world_update(a: number): void;
export function world_keystroke(a: number, b: number, c: number): void;
export function world_snake_cells(a: number): number;
export function world_snake_len(a: number): number;
export function world_status(a: number): number;
export function __wbindgen_malloc(a: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number): number;

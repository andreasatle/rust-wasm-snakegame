import { rand } from './snippets/snake_game-027f5cd2d64d2885/www/utils/rand.js';

let wasm;

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* GameStatus contains the different states the game can be in.
* The state affects what happens at a keystroke from the user.
* It is also used in the main loop of the game in javascript.
*/
export const GameStatus = Object.freeze({
/**
* State before Game is starting.
*/
Idle:0,"0":"Idle",
/**
* State where game is being played.
*/
Playing:1,"1":"Playing",
/**
* State after snake did illegal move.
*/
GameOver:2,"2":"GameOver", });
/**
* World contains the information about the playfield.
*/
export class World {

    static __wrap(ptr) {
        const obj = Object.create(World.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_world_free(ptr);
    }
    /**
    * Status of the game.
    */
    get status() {
        var ret = wasm.__wbg_get_world_status(this.ptr);
        return ret >>> 0;
    }
    /**
    * Status of the game.
    * @param {number} arg0
    */
    set status(arg0) {
        wasm.__wbg_set_world_status(this.ptr, arg0);
    }
    /**
    * Create a new instance of the world.
    * @param {number} width
    * @param {number} extend
    * @returns {World}
    */
    static new(width, extend) {
        var ret = wasm.world_new(width, extend);
        return World.__wrap(ret);
    }
    /**
    * Reset an existing instance of the world.
    * @param {number} extend
    */
    reset(extend) {
        wasm.world_reset(this.ptr, extend);
    }
    /**
    * Getter for the width.
    * @returns {number}
    */
    width() {
        var ret = wasm.world_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * Getter for the world index to the reward cell.
    * @returns {number}
    */
    reward_cell() {
        var ret = wasm.world_reward_cell(this.ptr);
        return ret >>> 0;
    }
    /**
    * Getter for the world index to the penalty cell.
    * @returns {number}
    */
    penalty_cell() {
        var ret = wasm.world_penalty_cell(this.ptr);
        return ret >>> 0;
    }
    /**
    * Compute the row from the world index.
    * @param {number} idx
    * @returns {number}
    */
    row(idx) {
        var ret = wasm.world_row(this.ptr, idx);
        return ret >>> 0;
    }
    /**
    * Compute the column from the world index.
    * @param {number} idx
    * @returns {number}
    */
    col(idx) {
        var ret = wasm.world_col(this.ptr, idx);
        return ret >>> 0;
    }
    /**
    * Compute the world index from the row and column.
    * @param {number} row
    * @param {number} col
    * @returns {number}
    */
    index(row, col) {
        var ret = wasm.world_index(this.ptr, row, col);
        return ret >>> 0;
    }
    /**
    * Update the state of a game that is going on.
    */
    update() {
        wasm.world_update(this.ptr);
    }
    /**
    * Take action on keystroke, depending on game status.
    * @param {string} key
    */
    keystroke(key) {
        var ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.world_keystroke(this.ptr, ptr0, len0);
    }
    /**
    * Return the pointer to the snake body.
    * @returns {number}
    */
    snake_cells() {
        var ret = wasm.world_snake_cells(this.ptr);
        return ret;
    }
    /**
    * Return the length to the snake body.
    * @returns {number}
    */
    snake_len() {
        var ret = wasm.world_snake_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * Getter for the GameStatus.
    * @returns {number}
    */
    status() {
        var ret = wasm.world_status(this.ptr);
        return ret >>> 0;
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('snake_game_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_rand_c5b7f41ce19ac9ab = function(arg0) {
        var ret = rand(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;


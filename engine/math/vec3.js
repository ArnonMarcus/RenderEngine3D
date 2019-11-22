import { Position, Interpolatable, CrossedDirection } from "./vec.js";
import { PRECISION_DIGITS } from "../constants.js";
import { Buffer } from "../allocators.js";
let t_x, t_y, t_z, t_n;
let X, Y, Z, M11, M12, M13, M21, M22, M23, M31, M32, M33;
export const update_matrix3x3_arrays = (MATRIX3x3_ARRAYS) => [
    M11, M12, M13,
    M21, M22, M23,
    M31, M32, M33
] = MATRIX3x3_ARRAYS;
const __buffer_entry = [0, 0, 0];
const __buffer_slice = [null, null, null];
const VECTOR3D_ARRAYS = [null, null, null];
class Buffer3D extends Buffer {
    constructor() {
        super(...arguments);
        this._entry = __buffer_entry;
        this._slice = __buffer_slice;
        this._onBuffersChanged = () => [X, Y, Z] = VECTOR3D_ARRAYS;
    }
}
export const vector3Dbuffer = new Buffer3D(VECTOR3D_ARRAYS);
const get = (a, dim) => VECTOR3D_ARRAYS[dim][a];
const set = (a, dim, value) => { VECTOR3D_ARRAYS[dim][a] = value; };
const set_to = (a, x, y, z) => {
    X[a] = x;
    Y[a] = y;
    Z[a] = z;
};
const set_all_to = (a, value) => {
    X[a] = Y[a] = Z[a] = value;
};
const set_from = (a, o) => {
    X[a] = X[o];
    Y[a] = Y[o];
    Z[a] = Z[o];
};
const equals = (a, b) => X[a].toFixed(PRECISION_DIGITS) ===
    X[b].toFixed(PRECISION_DIGITS) &&
    Y[a].toFixed(PRECISION_DIGITS) ===
        Y[b].toFixed(PRECISION_DIGITS) &&
    Z[a].toFixed(PRECISION_DIGITS) ===
        Z[b].toFixed(PRECISION_DIGITS);
const invert = (a, o) => {
    X[o] = -X[a];
    Y[o] = -Y[a];
    Z[o] = -Z[a];
};
const invert_in_place = (a) => {
    X[a] = -X[a];
    Y[a] = -Y[a];
    Z[a] = -Z[a];
};
const length = (a) => Math.hypot(X[a], Y[a], Z[a]);
const distance = (a, b) => Math.hypot((X[b] - X[a]), (Y[b] - Y[a]), (Z[b] - Z[a]));
const length_squared = (a) => Math.pow(X[a], 2) +
    Math.pow(Y[a], 2) +
    Math.pow(Z[a], 2);
const distance_squared = (a, b) => (Math.pow((X[b] - X[a]), 2) +
    Math.pow((Y[b] - Y[a]), 2) +
    Math.pow((Z[b] - Z[a]), 2));
const lerp = (a, b, o, t) => {
    X[o] = (1 - t) * X[a] + t * (X[b]);
    Y[o] = (1 - t) * Y[a] + t * (Y[b]);
    Z[o] = (1 - t) * Z[a] + t * (Z[b]);
};
const add = (a, b, o) => {
    X[o] = X[a] + X[b];
    Y[o] = Y[a] + Y[b];
    Z[o] = Z[a] + Z[b];
};
const add_in_place = (a, b) => {
    X[a] += X[b];
    Y[a] += Y[b];
    Z[a] += Z[b];
};
const subtract = (a, b, o) => {
    X[o] = X[a] - X[b];
    Y[o] = Y[a] - Y[b];
    Z[o] = Z[a] - Z[b];
};
const subtract_in_place = (a, b) => {
    X[a] -= X[b];
    Y[a] -= Y[b];
    Z[a] -= Z[b];
};
const divide = (a, o, n) => {
    X[o] = X[a] / n;
    Y[o] = Y[a] / n;
    Z[o] = Z[a] / n;
};
const divide_in_place = (a, n) => {
    X[a] /= n;
    Y[a] /= n;
    Z[a] /= n;
};
const scale = (a, o, n) => {
    X[o] = X[a] * n;
    Y[o] = Y[a] * n;
    Z[o] = Z[a] * n;
};
const scale_in_place = (a, n) => {
    X[a] *= n;
    Y[a] *= n;
    Z[a] *= n;
};
const normalize = (a, o) => {
    t_n = Math.hypot(X[a], Y[a], Z[a]);
    X[o] = X[a] / t_n;
    Y[o] = Y[a] / t_n;
    Z[o] = Z[a] / t_n;
};
const normalize_in_place = (a) => {
    t_n = Math.hypot(X[a], Y[a], Z[a]);
    X[a] /= t_n;
    Y[a] /= t_n;
    Z[a] /= t_n;
};
const dot = (a, b) => X[a] * X[b] +
    Y[a] * Y[b] +
    Z[a] * Z[b];
const cross = (a, b, o) => {
    X[o] = Y[a] * Z[b] - Z[a] * Y[b];
    Y[o] = Z[a] * X[b] - X[a] * Z[b];
    Z[o] = X[a] * Y[b] - Y[a] * X[b];
};
const cross_in_place = (a, b) => {
    t_x = X[a];
    t_y = Y[a];
    t_z = Z[a];
    X[a] = t_y * Z[b] - t_z * Y[b];
    Y[a] = t_z * X[b] - t_x * Z[b];
    Z[a] = t_x * Y[b] - t_y * X[b];
};
const multiply = (a, b, o) => {
    X[o] = X[a] * M11[b] + Y[a] * M21[b] + Z[a] * M31[b];
    Y[o] = X[a] * M12[b] + Y[a] * M22[b] + Z[a] * M32[b];
    Z[o] = X[a] * M13[b] + Y[a] * M23[b] + Z[a] * M33[b];
};
const multiply_in_place = (a, b) => {
    t_x = X[a];
    t_y = Y[a];
    t_z = Z[a];
    X[a] = t_x * M11[b] + t_y * M21[b] + t_z * M31[b];
    Y[a] = t_x * M12[b] + t_y * M22[b] + t_z * M32[b];
    Z[a] = t_x * M13[b] + t_y * M23[b] + t_z * M33[b];
};
const baseFunctions = {
    get,
    set,
    set_to,
    set_from,
    set_all_to,
    equals,
    add,
    add_in_place,
    subtract,
    subtract_in_place,
    divide,
    divide_in_place,
    scale,
    scale_in_place,
    invert,
    invert_in_place,
    lerp
};
const vectorFunctions = Object.assign(Object.assign({}, baseFunctions), { multiply,
    multiply_in_place });
const positionFunctions = Object.assign(Object.assign({}, vectorFunctions), { distance,
    distance_squared });
const directionFunctions = Object.assign(Object.assign({}, vectorFunctions), { length,
    length_squared,
    normalize,
    normalize_in_place,
    dot,
    cross,
    cross_in_place });
export class UV3D extends Interpolatable {
    constructor() {
        super(...arguments);
        this._ = baseFunctions;
        this._buffer = vector3Dbuffer;
    }
    setTo(u, v, w) {
        set_to(this.id, u, v, w);
        return this;
    }
    set u(u) { X[this.id] = u; }
    set v(v) { Y[this.id] = v; }
    set w(w) { Z[this.id] = w; }
    get u() { return X[this.id]; }
    get v() { return Y[this.id]; }
    get w() { return Z[this.id]; }
}
export class Color3D extends Interpolatable {
    constructor() {
        super(...arguments);
        this._ = baseFunctions;
        this._buffer = vector3Dbuffer;
    }
    setTo(r, g, b) {
        set_to(this.id, r, g, b);
        return this;
    }
    set r(r) { X[this.id] = r; }
    set g(g) { Y[this.id] = g; }
    set b(b) { Z[this.id] = b; }
    get r() { return X[this.id]; }
    get g() { return Y[this.id]; }
    get b() { return Z[this.id]; }
}
export class Direction3D extends CrossedDirection {
    constructor() {
        super(...arguments);
        this._ = directionFunctions;
        this._buffer = vector3Dbuffer;
    }
    setTo(x, y, z) {
        this._.set_to(this.id, x, y, z);
        return this;
    }
    set x(x) { X[this.id] = x; }
    set y(y) { Y[this.id] = y; }
    set z(z) { Z[this.id] = z; }
    get x() { return X[this.id]; }
    get y() { return Y[this.id]; }
    get z() { return Z[this.id]; }
}
export class Position3D extends Position {
    constructor() {
        super(...arguments);
        this._ = positionFunctions;
        this._buffer = vector3Dbuffer;
        this._dir = dir3D;
    }
    setTo(x, y, z) {
        this._.set_to(this.id, x, y, z);
        return this;
    }
    set x(x) { X[this.id] = x; }
    set y(y) { Y[this.id] = y; }
    set z(z) { Z[this.id] = z; }
    get x() { return X[this.id]; }
    get y() { return Y[this.id]; }
    get z() { return Z[this.id]; }
}
export const pos3D = (x = 0, y = 0, z = 0) => x instanceof Direction3D ?
    new Position3D(x.buffer_offset, x.array_index) :
    new Position3D(vector3Dbuffer.tempID).setTo(x, y, z);
export const dir3D = (x = 0, y = 0, z = 0) => x instanceof Position3D ?
    new Direction3D(x.buffer_offset, x.array_index) :
    new Direction3D(vector3Dbuffer.tempID).setTo(x, y, z);
export const rgb = (r = 0, g = 0, b = 0) => new Color3D(vector3Dbuffer.tempID).setTo(r, g, b);
export const uvw = (u = 0, v = 0, w = 0) => new UV3D(vector3Dbuffer.tempID).setTo(u, v, w);
//# sourceMappingURL=vec3.js.map
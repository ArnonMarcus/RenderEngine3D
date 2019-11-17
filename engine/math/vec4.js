import { Direction, Position, Color } from "./vec.js";
import { PRECISION_DIGITS } from "../constants.js";
import { FloatBuffer } from "../allocators.js";
let t_x, t_y, t_z, t_w, t_n;
let X, Y, Z, W, M11, M12, M13, M14, M21, M22, M23, M24, M31, M32, M33, M34, M41, M42, M43, M44;
export const update_matrix4x4_arrays = (MATRIX4x4_ARRAYS) => [
    M11, M12, M13, M14,
    M21, M22, M23, M24,
    M31, M32, M33, M34,
    M41, M42, M43, M44
] = MATRIX4x4_ARRAYS;
const VECTOR4D_ARRAYS = [null, null];
export const vector4Dbuffer = new FloatBuffer(VECTOR4D_ARRAYS, () => [
    X, Y, Z
] = VECTOR4D_ARRAYS);
const get = (a, dim) => VECTOR4D_ARRAYS[dim][a];
const set = (a, dim, value) => { VECTOR4D_ARRAYS[dim][a] = value; };
const set_to = (a, x, y, z) => {
    X[a] = x;
    Y[a] = y;
    Z[a] = z;
    W[a] = z;
};
const set_all_to = (a, value) => {
    X[a] = Y[a] = Z[a] = W[a] = value;
};
const set_from = (a, o) => {
    X[a] = X[o];
    Y[a] = Y[o];
    Z[a] = Z[o];
    W[a] = W[o];
};
const equals = (a, b) => X[a].toFixed(PRECISION_DIGITS) ===
    X[b].toFixed(PRECISION_DIGITS) &&
    Y[a].toFixed(PRECISION_DIGITS) ===
        Y[b].toFixed(PRECISION_DIGITS) &&
    Z[a].toFixed(PRECISION_DIGITS) ===
        Z[b].toFixed(PRECISION_DIGITS) &&
    W[a].toFixed(PRECISION_DIGITS) ===
        W[b].toFixed(PRECISION_DIGITS);
const invert = (a, o) => {
    X[o] = -X[a];
    Y[o] = -Y[a];
    Z[o] = -Z[a];
    W[o] = -W[a];
};
const invert_in_place = (a) => {
    X[a] = -X[a];
    Y[a] = -Y[a];
    Z[a] = -Z[a];
    W[a] = -W[a];
};
const length = (a) => Math.hypot(X[a], Y[a], Z[a], W[a]);
const distance = (a, b) => Math.hypot((X[b] - X[a]), (Y[b] - Y[a]), (Z[b] - Z[a]), (W[b] - W[a]));
const length_squared = (a) => Math.pow(X[a], 2) +
    Math.pow(Y[a], 2) +
    Math.pow(Z[a], 2) +
    Math.pow(W[a], 2);
const distance_squared = (a, b) => (Math.pow((X[b] - X[a]), 2) +
    Math.pow((Y[b] - Y[a]), 2) +
    Math.pow((Z[b] - Z[a]), 2) +
    Math.pow((W[b] - W[a]), 2));
const lerp = (a, b, o, t) => {
    X[o] = (1 - t) * X[a] + t * (X[b]);
    Y[o] = (1 - t) * Y[a] + t * (Y[b]);
    Z[o] = (1 - t) * Z[a] + t * (Z[b]);
    W[o] = (1 - t) * W[a] + t * (W[b]);
};
const add = (a, b, o) => {
    X[o] = X[a] + X[b];
    Y[o] = Y[a] + Y[b];
    Z[o] = Z[a] + Z[b];
    W[o] = W[a] + W[b];
};
const add_in_place = (a, b) => {
    X[a] += X[b];
    Y[a] += Y[b];
    Z[a] += Z[b];
    W[a] += W[b];
};
const subtract = (a, b, o) => {
    X[o] = X[a] - X[b];
    Y[o] = Y[a] - Y[b];
    Z[o] = Z[a] - Z[b];
    W[o] = W[a] - W[b];
};
const subtract_in_place = (a, b) => {
    X[a] -= X[b];
    Y[a] -= Y[b];
    Z[a] -= Z[b];
    W[a] -= W[b];
};
const divide = (a, o, n) => {
    X[o] = X[a] / n;
    Y[o] = Y[a] / n;
    Z[o] = Z[a] / n;
    W[o] = W[a] / n;
};
const divide_in_place = (a, n) => {
    X[a] /= n;
    Y[a] /= n;
    Z[a] /= n;
    W[a] /= n;
};
const scale = (a, o, n) => {
    X[o] = X[a] * n;
    Y[o] = Y[a] * n;
    Z[o] = Z[a] * n;
    W[o] = W[a] * n;
};
const scale_in_place = (a, n) => {
    X[a] *= n;
    Y[a] *= n;
    Z[a] *= n;
    W[a] *= n;
};
const normalize = (a, o) => {
    t_n = Math.hypot(X[a], Y[a], Z[a], W[a]);
    X[o] = X[a] / t_n;
    Y[o] = Y[a] / t_n;
    Z[o] = Z[a] / t_n;
    W[o] = W[a] / t_n;
};
const normalize_in_place = (a) => {
    t_n = Math.hypot(X[a], Y[a], Z[a], W[a]);
    X[a] /= t_n;
    Y[a] /= t_n;
    Z[a] /= t_n;
    W[a] /= t_n;
};
const dot = (a, b) => X[a] * X[b] +
    Y[a] * Y[b] +
    Z[a] * Z[b] +
    W[a] * W[b];
const in_view = (x, y, z, w, n, f) => n <= z && z <= f &&
    -w <= y && y <= w &&
    -w <= x && x <= w;
const out_of_view = (x, y, z, w, n, f) => n > z || z > f ||
    -w > y || y > w ||
    -w > x || x > w;
const multiply = (a, b, o) => {
    X[o] = X[a] * M11[b] + Y[a] * M21[b] + Z[a] * M31[b] + W[a] * M41[b];
    Y[o] = X[a] * M12[b] + Y[a] * M22[b] + Z[a] * M32[b] + W[a] * M42[b];
    Z[o] = X[a] * M13[b] + Y[a] * M23[b] + Z[a] * M33[b] + W[a] * M43[b];
    W[o] = X[a] * M14[b] + Y[a] * M24[b] + Z[a] * M34[b] + W[a] * M44[b];
};
const multiply_in_place = (a, b) => {
    t_x = X[a];
    t_y = Y[a];
    t_z = Z[a];
    t_w = W[a];
    X[a] = t_x * M11[b] + t_y * M21[b] + t_z * M31[b] + t_w * M41[b];
    Y[a] = t_x * M12[b] + t_y * M22[b] + t_z * M32[b] + t_w * M42[b];
    Z[a] = t_x * M13[b] + t_y * M23[b] + t_z * M33[b] + t_w * M43[b];
    W[a] = t_x * M14[b] + t_y * M24[b] + t_z * M34[b] + t_w * M44[b];
};
const baseFunctions4D = {
    buffer: vector4Dbuffer,
    get,
    set,
    set_to,
    set_from,
    set_all_to,
    equals,
    invert,
    invert_in_place
};
const baseArithmaticFunctions4D = Object.assign(Object.assign({}, baseFunctions4D), { add,
    add_in_place,
    subtract,
    subtract_in_place,
    divide,
    divide_in_place,
    scale,
    scale_in_place,
    multiply,
    multiply_in_place });
const vectorFunctions4D = Object.assign(Object.assign({}, baseArithmaticFunctions4D), { distance,
    distance_squared,
    length,
    length_squared,
    normalize,
    normalize_in_place,
    dot,
    lerp });
export class RGBA extends Color {
    constructor() {
        super(...arguments);
        this._ = vectorFunctions4D;
    }
    setTo(r, g, b, a) {
        this._.set_to(this.id, r, g, b, a);
        return this;
    }
    set a(a) { W[this.id] = a; }
    get a() { return W[this.id]; }
}
export class Direction4D extends Direction {
    constructor() {
        super(...arguments);
        this._ = vectorFunctions4D;
    }
    setTo(x, y, z, w) {
        this._.set_to(this.id, x, y, z, w);
        return this;
    }
    set x(x) { X[this.id] = x; }
    set y(y) { Y[this.id] = y; }
    set z(z) { Y[this.id] = z; }
    set w(w) { Y[this.id] = w; }
    get x() { return X[this.id]; }
    get y() { return Y[this.id]; }
    get z() { return Z[this.id]; }
    get w() { return W[this.id]; }
}
export class Position4D extends Position {
    constructor() {
        super(...arguments);
        this._ = vectorFunctions4D;
        this._dir = dir4D;
        this.isInView = (near = 0, far = 1) => in_view(X[this.id], Y[this.id], Z[this.id], W[this.id], near, far);
        this.isOutOfView = (near = 0, far = 1) => out_of_view(X[this.id], Y[this.id], Z[this.id], W[this.id], near, far);
        this.toNDC = () => this.divideBy(W[this.id]);
    }
    setTo(x, y, z, w) {
        this._.set_to(this.id, x, y, z, w);
        return this;
    }
    set x(x) { X[this.id] = x; }
    set y(y) { Y[this.id] = y; }
    set z(z) { Y[this.id] = z; }
    set w(w) { Y[this.id] = w; }
    get x() { return X[this.id]; }
    get y() { return Y[this.id]; }
    get z() { return Z[this.id]; }
    get w() { return W[this.id]; }
}
export const pos4D = (x = 0, y = 0, z = 0, w = 0) => x instanceof Direction4D ?
    new Position4D(x.buffer_offset, x.array_index) :
    new Position4D(vector4Dbuffer.tempID).setTo(x, y, z, w);
export const dir4D = (x = 0, y = 0, z = 0, w = 0) => x instanceof Position4D ?
    new Direction4D(x.buffer_offset, x.array_index) :
    new Direction4D(vector4Dbuffer.tempID).setTo(x, y, z, w);
export const rgba = (r = 0, g = 0, b = 0, a = 0) => new RGBA(vector4Dbuffer.tempID).setTo(r, g, b, a);
//# sourceMappingURL=vec4.js.map
import {DIM, PRECISION_DIGITS} from "../constants.js";
import Matrix from "./mat.js";
import {FloatArray, Float4, Num4} from "../types.js";
import {Buffer} from "../allocators.js";
import {update_matrix2x2_arrays} from "./vec2.js";
import {IMatrixFunctions} from "./interfaces/functions.js";
import {IMatrix, IMatrix2x2} from "./interfaces/classes.js";

let t11, t12,
    t21, t22: number;

let M11, M12,
    M21, M22: FloatArray;

const __buffer_entry: Num4 = [
    0, 0,
    0, 0
];

const __buffer_slice: Float4 = [
    null, null,
    null, null
];

const MATRIX2x2_ARRAYS: Float4 = [
    null, null,
    null, null
];

class Buffer2x2 extends Buffer<DIM._4D, FloatArray> {
    protected readonly _entry = __buffer_entry;
    protected readonly _slice =__buffer_slice;

    _onBuffersChanged(): void {
        [
            M11, M12,
            M21, M22
        ] = MATRIX2x2_ARRAYS;

        update_matrix2x2_arrays(MATRIX2x2_ARRAYS);
    }
}

export const matrix2x2buffer = new Buffer2x2(MATRIX2x2_ARRAYS);

//
//
// export const MATRIX2x2_BUFFERS: [
//     Float32Array, Float32Array,
//     Float32Array, Float32Array
//     ] = [
//     null, null,
//     null, null
// ];
//
// const BUFFERS_BEFORE_INIT: [
//     Float32Array, Float32Array,
//     Float32Array, Float32Array
//     ] = [
//     null, null,
//     null, null
// ];
//
// const DIMENTION: DIM = DIM._4D;
// const TEMPORARY_STORAGE_LENGTH = CACHE_LINE_SIZE * 16;
// let BUFFER_LENGTH = 0;
// let temporary_storage_offset = 0;
// let current_storage_offset = TEMPORARY_STORAGE_LENGTH;
// export const allocateTemporaryArray2D = (): number =>
//     temporary_storage_offset++ % TEMPORARY_STORAGE_LENGTH;
//
// let offset_before_allocation: number;
// export const allocateArray2D = (length: number): number => {
//     offset_before_allocation = current_storage_offset;
//     current_storage_offset += length;
//
//     if (current_storage_offset > BUFFER_LENGTH)
//         throw '2D Buffer overflow!';
//
//     return offset_before_allocation;
// };
//
// let i: number;
// export const initBuffer2D = (length: number): void => {
//     BUFFER_LENGTH = TEMPORARY_STORAGE_LENGTH + length;
//
//     for (i= 0; i< DIMENTION; i++)
//         BUFFERS_BEFORE_INIT[i] = MATRIX2x2_BUFFERS[i];
//
//     M11 = MATRIX2x2_BUFFERS[0] = new Float32Array(BUFFER_LENGTH);
//     M12 = MATRIX2x2_BUFFERS[1] = new Float32Array(BUFFER_LENGTH);
//
//     M21 = MATRIX2x2_BUFFERS[2] = new Float32Array(BUFFER_LENGTH);
//     M22 = MATRIX2x2_BUFFERS[3] = new Float32Array(BUFFER_LENGTH);
//
//     if (BUFFERS_BEFORE_INIT[0] !== null)
//         for (i = 0; i < DIMENTION; i++)
//             MATRIX2x2_BUFFERS[i].set(BUFFERS_BEFORE_INIT[i]);
//
//     update_matrix2x2_arrays();
// };

const get = (a: number, dim: 0|1|2|3): number => MATRIX2x2_ARRAYS[dim][a];
const set = (a: number, dim: 0|1|2|3, value: number): void => {MATRIX2x2_ARRAYS[dim][a] = value};

const set_to = (a: number,
                m11: number, m12: number,
                m21: number, m22: number): void => {
    M11[a] = m11;  M12[a] = m12;
    M21[a] = m21;  M22[a] = m22;
};

const set_all_to = (a: number, value: number): void => {
    M11[a] = M12[a] =
        M21[a] = M22[a] = value;
};

const set_from = (a: number, o: number): void => {
    M11[a] = M11[o];  M12[a] = M12[o];
    M21[a] = M21[o];  M22[a] = M22[o];
};


const set_to_identity = (a: number) : void => {
    M11[a] = M22[a] = 1;
    M12[a] = M21[a] = 0;
};

const transpose = (a: number, o: number) : void => {
    M11[o] = M11[a];  M21[o] = M12[a];
    M12[o] = M21[a];  M22[o] = M22[a];
};

const transpose_in_place = (a: number) : void => {[
    M12[a], M21[a]] = [
    M21[a], M12[a]]
};

// TODO: Fix...
const invert = (a: number, o: number) : void => {
    M11[o] = M11[a];  M21[o] = M12[a];
    M12[o] = M21[a];  M22[o] = M22[a];
};

// TODO: Fix...
const invert_in_place = (a: number) : void => {[
    M12[a], M21[a]] = [
    M21[a], M12[a]]
};

const equals = (a: number, b: number) : boolean =>
    M11[a].toFixed(PRECISION_DIGITS) ===
    M11[b].toFixed(PRECISION_DIGITS) &&

    M12[a].toFixed(PRECISION_DIGITS) ===
    M12[b].toFixed(PRECISION_DIGITS) &&


    M21[a].toFixed(PRECISION_DIGITS) ===
    M21[b].toFixed(PRECISION_DIGITS) &&

    M22[a].toFixed(PRECISION_DIGITS) ===
    M22[b].toFixed(PRECISION_DIGITS);

const is_identity = (a: number) : boolean =>
    M11[a] === 1  &&  M21[a] === 0 &&
    M12[a] === 0  &&  M22[a] === 1;

const add = (a: number, b: number, o: number) : void => {
    M11[o] = M11[a] + M11[b];  M21[o] = M21[a] + M21[b];
    M12[o] = M12[a] + M12[b];  M22[o] = M22[a] + M22[b];
};

const add_in_place = (a: number, b: number) : void => {
    M11[a] += M11[b];  M21[a] += M21[b];
    M12[a] += M12[b];  M22[a] += M22[b];
};

const subtract = (a: number, b: number, o: number) : void => {
    M11[o] = M11[a] - M11[b];  M21[o] = M21[a] - M21[b];
    M12[o] = M12[a] - M12[b];  M22[o] = M22[a] - M22[b];
};

const subtract_in_place = (a: number, b: number) : void => {
    M11[a] -= M11[b];  M21[a] -= M21[b];
    M12[a] -= M12[b];  M22[a] -= M22[b];
};

const divide = (a: number, o: number, n: number) : void => {
    M11[o] = M11[a] / n;  M21[o] = M21[a] / n;
    M12[o] = M12[a] / n;  M22[o] = M22[a] / n;
};

const divide_in_place = (a: number, n: number) : void => {
    M11[a] /= n;  M21[a] /= n;
    M12[a] /= n;  M22[a] /= n;
};

const scale = (a: number, o: number, n: number) : void => {
    M11[o] = M11[a] * n;  M21[o] = M21[a] * n;
    M12[o] = M12[a] * n;  M22[o] = M22[a] * n;
};

const scale_in_place = (a: number, n: number) : void => {
    M11[a] *= n;  M21[a] *= n;
    M12[a] *= n;  M22[a] *= n;
};

const multiply = (a: number, b: number, o: number) : void => {
    M11[o] = M11[a]*M11[b] + M12[a]*M21[b]; // Row 1 | Column 1
    M12[o] = M11[a]*M12[b] + M12[a]*M22[b]; // Row 1 | Column 2

    M21[o] = M21[a]*M11[b] + M22[a]*M21[b]; // Row 2 | Column 1
    M22[o] = M21[a]*M12[b] + M22[a]*M22[b]; // Row 2 | Column 2
};

const multiply_in_place = (a: number, b: number) : void => {
    t11 = M11[a];  t21 = M21[a];
    t12 = M12[a];  t22 = M22[a];

    M11[a] = t11*M11[b] + t12*M21[b]; // Row 1 | Column 1
    M12[a] = t11*M12[b] + t12*M22[b]; // Row 1 | Column 2

    M21[a] = t21*M11[b] + t22*M21[b]; // Row 2 | Column 1
    M22[a] = t21*M12[b] + t22*M22[b]; // Row 2 | Column 2
};

const set_rotation = (a: number, cos: number, sin: number) : void => {
    M11[a] = M22[a] = cos;
    M12[a] = sin;
    M21[a] = -sin;
};

const matrixFunctions: IMatrixFunctions = {
    get,
    set,
    set_to,
    set_from,
    set_all_to,

    equals,

    invert,
    invert_in_place,

    add,
    add_in_place,

    subtract,
    subtract_in_place,

    divide,
    divide_in_place,

    scale,
    scale_in_place,

    multiply,
    multiply_in_place,

    is_identity,
    set_to_identity,

    transpose,
    transpose_in_place,
};

export default class Matrix2x2
    extends Matrix
    implements IMatrix2x2
{
    readonly _ = matrixFunctions;
    readonly _buffer = matrix2x2buffer;

    set m11(m11: number) {M11[this.id] = m11}
    set m12(m12: number) {M12[this.id] = m12}
    set m21(m21: number) {M21[this.id] = m21}
    set m22(m22: number) {M22[this.id] = m22}

    get m11(): number {return M11[this.id]}
    get m12(): number {return M12[this.id]}
    get m21(): number {return M21[this.id]}
    get m22(): number {return M22[this.id]}

    setTo(
        m11: number, m12: number,
        m21: number, m22: number
    ): this {
        set_to(
            this.id,
            m11, m12,
            m21, m22
        );

        return this;
    }

    setRotation(angle: number, reset: boolean = true): this {
        if (reset)
            this._.set_to_identity(this.id);

        set_rotation(this.id, Math.cos(angle), Math.sin(angle));

        return this;
    }
}

export const mat2x2 = (
    m11: number = 0, m12: number = 0,
    m21: number = 0, m22: number = 0
): Matrix2x2 => new Matrix2x2(matrix2x2buffer.tempID).setTo(
    m11, m12,
    m21, m22
);
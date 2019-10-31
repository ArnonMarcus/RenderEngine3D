import { PRECISION_DIGITS } from "../constants";
import { Matrix } from "./base";
import { Direction3D } from "./vec3.js";
const temp_matrix = new Float32Array(9);
export const set_identity = (a, i) => {
    a[0][i] = 0;
    a[1][i] = 1;
    a[2][i] = 0;
    a[3][i] = 0;
    a[4][i] = 1;
    a[5][i] = 0;
    a[6][i] = 0;
    a[7][i] = 0;
    a[8][i] = 1;
};
export const inverse = (a, i, o, k) => {
    if (i === k && (Object.is(a, o) || ((Object.is(a[0], o[0]) || Object.is(a[0].buffer, o[0].buffer)) &&
        (Object.is(a[1], o[1]) || Object.is(a[1].buffer, o[1].buffer)) &&
        (Object.is(a[2], o[2]) || Object.is(a[2].buffer, o[2].buffer)) &&
        (Object.is(a[3], o[3]) || Object.is(a[3].buffer, o[3].buffer)) &&
        (Object.is(a[4], o[4]) || Object.is(a[4].buffer, o[4].buffer)) &&
        (Object.is(a[5], o[5]) || Object.is(a[5].buffer, o[5].buffer)) &&
        (Object.is(a[6], o[6]) || Object.is(a[6].buffer, o[6].buffer)) &&
        (Object.is(a[7], o[7]) || Object.is(a[7].buffer, o[7].buffer)) &&
        (Object.is(a[8], o[8]) || Object.is(a[8].buffer, o[8].buffer)))))
        throw `Can not inverse - shared buffer detected! (Use inverse_in_place)`;
    o[0][k] = a[0][i];
    o[1][k] = a[3][i];
    o[2][k] = a[2][i];
    o[3][k] = a[1][i];
    o[4][k] = a[4][i];
    o[5][k] = a[5][i];
    o[6][k] = -(a[6][i] * a[0][i] +
        a[7][i] * a[1][i]);
    o[7][k] = -(a[6][i] * a[3][i] +
        a[7][i] * a[4][i]);
    o[8][k] = 1;
};
export const inverse_in_place = (a, i) => {
    temp_matrix[0] = a[0][i];
    temp_matrix[1] = a[1][i];
    temp_matrix[2] = a[2][i];
    temp_matrix[3] = a[3][i];
    temp_matrix[4] = a[4][i];
    temp_matrix[5] = a[5][i];
    temp_matrix[6] = a[6][i];
    temp_matrix[7] = a[7][i];
    temp_matrix[8] = a[8][i];
    a[0][i] = temp_matrix[0];
    a[1][i] = temp_matrix[3];
    a[2][i] = temp_matrix[2];
    a[3][i] = temp_matrix[1];
    a[4][i] = temp_matrix[4];
    a[5][i] = temp_matrix[5];
    a[6][i] = -(temp_matrix[6] * temp_matrix[0] +
        temp_matrix[7] * temp_matrix[1]);
    a[7][i] = -(temp_matrix[6] * temp_matrix[3] +
        temp_matrix[7] * temp_matrix[4]);
    a[8][i] = 1;
};
export const transpose = (a, i, o, k) => {
    if (i === k && (Object.is(a, o) || ((Object.is(a[0], o[0]) || Object.is(a[0].buffer, o[0].buffer)) &&
        (Object.is(a[1], o[1]) || Object.is(a[1].buffer, o[1].buffer)) &&
        (Object.is(a[2], o[2]) || Object.is(a[2].buffer, o[2].buffer)) &&
        (Object.is(a[3], o[3]) || Object.is(a[3].buffer, o[3].buffer)) &&
        (Object.is(a[4], o[4]) || Object.is(a[4].buffer, o[4].buffer)) &&
        (Object.is(a[5], o[5]) || Object.is(a[5].buffer, o[5].buffer)) &&
        (Object.is(a[6], o[6]) || Object.is(a[6].buffer, o[6].buffer)) &&
        (Object.is(a[7], o[7]) || Object.is(a[7].buffer, o[7].buffer)) &&
        (Object.is(a[8], o[8]) || Object.is(a[8].buffer, o[8].buffer)))))
        throw `Can not transpose - shared buffer detected! (Use transpose_in_place)`;
    o[0][k] = a[0][i];
    o[1][k] = a[3][i];
    o[2][k] = a[6][i];
    o[3][k] = a[1][i];
    o[4][k] = a[4][i];
    o[5][k] = a[7][i];
    o[6][k] = a[2][i];
    o[7][k] = a[5][i];
    o[8][k] = a[8][i];
};
export const transpose_in_place = (a, i) => {
    [
        a[1][i], a[2][i], a[3][i], a[5][i], a[6][i], a[7][i]
    ] = [
        a[3][i], a[6][i], a[1][i], a[7][i], a[2][i], a[5][i]
    ];
};
export const equals = (a, i, b, j) => {
    if (i === j && (Object.is(a, b) || ((Object.is(a[0], b[0]) || Object.is(a[0].buffer, b[0].buffer)) &&
        (Object.is(a[1], b[1]) || Object.is(a[1].buffer, b[1].buffer)) &&
        (Object.is(a[2], b[2]) || Object.is(a[2].buffer, b[2].buffer)) &&
        (Object.is(a[3], b[3]) || Object.is(a[3].buffer, b[3].buffer)) &&
        (Object.is(a[4], b[4]) || Object.is(a[4].buffer, b[4].buffer)) &&
        (Object.is(a[5], b[5]) || Object.is(a[5].buffer, b[5].buffer)) &&
        (Object.is(a[6], b[6]) || Object.is(a[6].buffer, b[6].buffer)) &&
        (Object.is(a[7], b[7]) || Object.is(a[7].buffer, b[7].buffer)) &&
        (Object.is(a[8], b[8]) || Object.is(a[8].buffer, b[8].buffer)))))
        return true;
    if (a.length !==
        b.length)
        return false;
    if (a[0][i].toFixed(PRECISION_DIGITS) !== b[0][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[1][i].toFixed(PRECISION_DIGITS) !== b[1][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[2][i].toFixed(PRECISION_DIGITS) !== b[2][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[3][i].toFixed(PRECISION_DIGITS) !== b[3][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[4][i].toFixed(PRECISION_DIGITS) !== b[4][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[5][i].toFixed(PRECISION_DIGITS) !== b[5][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[6][i].toFixed(PRECISION_DIGITS) !== b[6][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[7][i].toFixed(PRECISION_DIGITS) !== b[7][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[8][i].toFixed(PRECISION_DIGITS) !== b[8][j].toFixed(PRECISION_DIGITS))
        return false;
    return true;
};
export const is_identity = (a, i) => (a[0][i] === 1 &&
    a[1][i] === 0 &&
    a[2][i] === 0 &&
    a[3][i] === 0 &&
    a[4][i] === 1 &&
    a[5][i] === 0 &&
    a[6][i] === 0 &&
    a[7][i] === 0 &&
    a[8][i] === 1);
export const multiply = (a, i, b, j, o, k) => {
    if ((k === j && (Object.is(o, b) || ((Object.is(o[0], b[0]) || Object.is(o[0].buffer, b[0].buffer)) &&
        (Object.is(o[1], b[1]) || Object.is(o[1].buffer, b[1].buffer)) &&
        (Object.is(o[2], b[2]) || Object.is(o[2].buffer, b[2].buffer)) &&
        (Object.is(o[3], b[3]) || Object.is(o[3].buffer, b[3].buffer)) &&
        (Object.is(o[4], b[4]) || Object.is(o[4].buffer, b[4].buffer)) &&
        (Object.is(o[5], b[5]) || Object.is(o[5].buffer, b[5].buffer)) &&
        (Object.is(o[6], b[6]) || Object.is(o[6].buffer, b[6].buffer)) &&
        (Object.is(o[7], b[7]) || Object.is(o[7].buffer, b[7].buffer)) &&
        (Object.is(o[8], b[8]) || Object.is(o[8].buffer, b[8].buffer))))) || (k === i && (Object.is(o, a) || ((Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
        (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer)) &&
        (Object.is(o[2], a[2]) || Object.is(o[2].buffer, a[2].buffer)) &&
        (Object.is(o[3], a[3]) || Object.is(o[3].buffer, a[3].buffer)) &&
        (Object.is(o[4], a[4]) || Object.is(o[4].buffer, a[4].buffer)) &&
        (Object.is(o[5], a[5]) || Object.is(o[5].buffer, a[5].buffer)) &&
        (Object.is(o[6], a[6]) || Object.is(o[6].buffer, a[6].buffer)) &&
        (Object.is(o[7], a[7]) || Object.is(o[7].buffer, a[7].buffer)) &&
        (Object.is(o[8], a[8]) || Object.is(o[8].buffer, a[8].buffer))))))
        throw `Can not multiply - shared buffer detected! (Use multiply_in_place)`;
    // Row 1
    o[0][k] = // Column 1
        a[0][i] * b[0][j] +
            a[1][i] * b[3][j] +
            a[2][i] * b[6][j];
    o[1][k] = // Column 2
        a[0][i] * b[1][j] +
            a[1][i] * b[4][j] +
            a[2][i] * b[7][j];
    o[2][k] = // Column 3
        a[0][i] * b[2][j] +
            a[1][i] * b[5][j] +
            a[2][i] * b[8][j];
    // Row 2
    o[3][k] = // Column 1
        a[3][i] * b[0][j] +
            a[4][i] * b[3][j] +
            a[5][i] * b[6][j];
    o[4][k] = // Column 2
        a[3][i] * b[1][j] +
            a[4][i] * b[4][j] +
            a[5][i] * b[7][j];
    o[5][k] = // Column 3
        a[3][i] * b[2][j] +
            a[4][i] * b[5][j] +
            a[5][i] * b[8][j];
    // Row 3
    o[6][k] = // Column 1
        a[6][i] * b[0][j] +
            a[7][i] * b[3][j] +
            a[8][i] * b[6][j];
    o[7][k] = // Column 2
        a[6][i] * b[1][j] +
            a[7][i] * b[4][j] +
            a[8][i] * b[7][j];
    o[8][k] = // Column 3
        a[6][i] * b[2][j] +
            a[7][i] * b[5][j] +
            a[8][i] * b[8][j];
};
export const multiply_in_place = (a, i, b, j) => {
    temp_matrix[0] = a[0][i];
    temp_matrix[1] = a[1][i];
    temp_matrix[2] = a[2][i];
    temp_matrix[3] = a[3][i];
    temp_matrix[4] = a[4][i];
    temp_matrix[5] = a[5][i];
    temp_matrix[6] = a[6][i];
    temp_matrix[7] = a[7][i];
    temp_matrix[8] = a[8][i];
    // Row 1
    a[0][i] = // Column 1
        temp_matrix[0] * b[0][j] +
            temp_matrix[1] * b[3][j] +
            temp_matrix[2] * b[6][j];
    a[1][i] = // Column 2
        temp_matrix[0] * b[1][j] +
            temp_matrix[1] * b[4][j] +
            temp_matrix[2] * b[7][j];
    a[2][i] = // Column 3
        temp_matrix[0] * b[2][j] +
            temp_matrix[1] * b[5][j] +
            temp_matrix[2] * b[8][j];
    // Row 2
    a[3][i] = // Column 1
        temp_matrix[3] * b[0][j] +
            temp_matrix[4] * b[3][j] +
            temp_matrix[5] * b[6][j];
    a[4][i] = // Column 2
        temp_matrix[3] * b[1][j] +
            temp_matrix[4] * b[4][j] +
            temp_matrix[5] * b[7][j];
    a[5][i] = // Column 3
        temp_matrix[3] * b[2][j] +
            temp_matrix[4] * b[5][j] +
            temp_matrix[5] * b[8][j];
    // Row 3
    a[6][i] = // Column 1
        temp_matrix[6] * b[0][j] +
            temp_matrix[7] * b[3][j] +
            temp_matrix[8] * b[6][j];
    a[7][i] = // Column 2
        temp_matrix[6] * b[1][j] +
            temp_matrix[7] * b[4][j] +
            temp_matrix[8] * b[7][j];
    a[8][i] = // Column 3
        temp_matrix[6] * b[2][j] +
            temp_matrix[7] * b[5][j] +
            temp_matrix[8] * b[8][j];
};
export const set_rotation_around_x = (a, i, cos, sin) => {
    a[4][i] = a[8][i] = cos;
    a[5][i] = sin;
    a[7][i] = -sin;
};
export const set_rotation_around_y = (a, i, cos, sin) => {
    a[0][i] = a[8][i] = cos;
    a[2][i] = sin;
    a[6][i] = -sin;
};
export const set_rotation_around_z = (a, i, cos, sin) => {
    a[0][i] = a[4][i] = cos;
    a[1][i] = sin;
    a[3][i] = -sin;
};
export class Matrix3x3 extends Matrix {
    constructor(id, data, i = new Direction3D(id, [data[0], data[1], data[2]]), j = new Direction3D(id, [data[3], data[4], data[5]]), k = new Direction3D(id, [data[6], data[7], data[8]])) {
        super(id, data);
        this.id = id;
        this.data = data;
        this.i = i;
        this.j = j;
        this.k = k;
        this._dim = 9;
        this._equals = equals;
        this._is_identity = is_identity;
        this._set_identity = set_identity;
        this._set_rotation_around_x = set_rotation_around_x;
        this._set_rotation_around_y = set_rotation_around_y;
        this._set_rotation_around_z = set_rotation_around_z;
        this._inverse = inverse;
        this._inverse_in_place = inverse_in_place;
        this._transpose = transpose;
        this._transpose_in_place = transpose_in_place;
        this._multiply = multiply;
        this._multiply_in_place = multiply_in_place;
    }
}
//# sourceMappingURL=mat3x3.js.map
import {MathAccessor} from "./accessor.js";
import {Position2D, Position3D} from "./position.js";
import {Direction2D, Direction3D} from "./direction.js";
import {matrix2x2Functions} from "../math/mat2.js";
import {matrix4x4Functions} from "../math/mat4.js";
import {matrix3x3Functions} from "../math/mat3.js";
import {Float16, Float4, Float9} from "../../types.js";
import {IMatrix2x2FunctionSet, IMatrixFunctionSet, IMatrixRotationFunctionSet} from "../_interfaces/functions.js";
import {IMatrix, IMatrix2x2, IMatrix3x3, IMatrix4x4, IRotationMatrix} from "../_interfaces/matrix.js";


export default abstract class Matrix extends MathAccessor implements IMatrix
{
    readonly _: IMatrixFunctionSet;

    _newOut(): this {return this._new()}

    get is_identity(): boolean {
        return this._.is_identity(
            this.id, this.arrays
        );
    }

    get T(): this {
        return this.copy().transpose();
    }

    setToIdentity(): this {
        this._.set_to_identity(
            this.id, this.arrays
        );

        return this;
    }

    transpose(): this {
        this._.transpose_in_place(
            this.id, this.arrays
        );

        return this;
    }

    transposed(out: this = this.copy()): this {
        this._.transpose(
            this.id, this.arrays,
            out.id, out.arrays
        );

        return out;
    }

    abstract toArray(array?: Float32Array): Float32Array;
}

export abstract class RotationMatrix extends Matrix implements IRotationMatrix
{
    readonly _: IMatrixRotationFunctionSet;

    rotateAroundX(angle: number, out?: this): this {
        if (out && !Object.is(out, this)) {
            this._.rotate_around_x(
                this.id, this.arrays,
                Math.cos(angle),
                Math.sin(angle),
                out.id, out.arrays
            );
        } else
            this._.rotate_around_x_in_place(
                this.id, this.arrays,
                Math.cos(angle),
                Math.sin(angle)
            );

        return this;
    }

    rotateAroundY(angle: number, out?: this): this {
        if (out && !Object.is(out, this)) {
            this._.rotate_around_y(
                this.id, this.arrays,
                Math.cos(angle),
                Math.sin(angle),
                out.id, out.arrays
            );
        } else
            this._.rotate_around_y_in_place(
                this.id, this.arrays,
                Math.cos(angle),
                Math.sin(angle)
            );

        return this;
    }

    rotateAroundZ(angle: number, out?: this): this {
        if (out && !Object.is(out, this)) {
            this._.rotate_around_z(
                this.id, this.arrays,
                Math.cos(angle),
                Math.sin(angle),
                out.id, out.arrays
            );
        } else
            this._.rotate_around_z_in_place(
                this.id, this.arrays,
                Math.cos(angle),
                Math.sin(angle)
            );

        return this;
    }

    setRotationAroundX(angle: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation_around_x(
            this.id, this.arrays,
            Math.cos(angle),
            Math.sin(angle)
        );

        return this;
    }

    setRotationAroundY(angle: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation_around_y(
            this.id, this.arrays,
            Math.cos(angle),
            Math.sin(angle)
        );

        return this;
    }

    setRotationAroundZ(angle: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation_around_z(
            this.id, this.arrays,
            Math.cos(angle),
            Math.sin(angle)
        );

        return this;
    }

    rotateBy(x: number, y: number = 0, z: number = 0): this {
        if (x) this.rotateAroundX(x);
        if (y) this.rotateAroundY(y);
        if (z) this.rotateAroundZ(z);

        return this;
    }
}

export class Matrix2x2 extends Matrix implements IMatrix2x2
{
    readonly _: IMatrix2x2FunctionSet;
    public readonly x_axis: Direction2D;
    public readonly y_axis: Direction2D;

    public arrays: Float4;

    constructor(id?: number, arrays?: Float4) {
        super(matrix2x2Functions, id, arrays);

        this.x_axis = new Direction2D(this.id, [arrays[0], arrays[1]]);
        this.y_axis = new Direction2D(this.id, [arrays[2], arrays[3]]);
    }

    set m11(m11: number) {this.arrays[0][this.id] = m11}
    set m12(m12: number) {this.arrays[1][this.id] = m12}
    set m21(m21: number) {this.arrays[2][this.id] = m21}
    set m22(m22: number) {this.arrays[3][this.id] = m22}

    get m11(): number {return this.arrays[0][this.id]}
    get m12(): number {return this.arrays[1][this.id]}
    get m21(): number {return this.arrays[2][this.id]}
    get m22(): number {return this.arrays[3][this.id]}

    setTo(
        m11: number, m12: number,
        m21: number, m22: number
    ): this {
        this._.set_to(
            this.id, this.arrays,

            m11, m12,
            m21, m22
        );

        return this;
    }

    setRotation(angle: number, reset: boolean = true): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation(
            this.id, this.arrays,

            Math.cos(angle),
            Math.sin(angle)
        );

        return this;
    }

    rotateBy(angle: number, out?: this): this {
        if (out && !Object.is(out, this)) {
            this._.rotate(
                this.id, this.arrays,
                Math.cos(angle),
                Math.sin(angle),
                out.id, out.arrays
            );
        } else
            this._.rotate_in_place(
                this.id, this.arrays,
                Math.cos(angle),
                Math.sin(angle)
            );

        return this;
    }

    scaleBy(x: number, y: number = x): this {
        if (x !== 1) this.x_axis.mul(x);
        if (y !== 1) this.y_axis.mul(y);

        return this;
    }

    toArray(array: Float32Array = new Float32Array(4)): Float32Array {
        array[0] = this.arrays[0][this.id];
        array[1] = this.arrays[1][this.id];
        array[2] = this.arrays[2][this.id];
        array[3] = this.arrays[3][this.id];

        return array;
    }
}

export class Matrix3x3 extends RotationMatrix implements IMatrix3x3
{
    readonly _: IMatrixRotationFunctionSet;

    public readonly mat2: Matrix2x2;
    public readonly translation: Position2D;
    public readonly x_axis_2D: Direction2D;
    public readonly y_axis_2D: Direction2D;

    public readonly x_axis: Direction3D;
    public readonly y_axis: Direction3D;
    public readonly z_axis: Direction3D;

    public arrays: Float9;

    constructor(id?: number, arrays?: Float9) {
        super(matrix3x3Functions, id, arrays);

        this.mat2 = new Matrix2x2(this.id, [
            this.arrays[0], this.arrays[1],
            this.arrays[3], this.arrays[4],
        ]);
        this.translation = new Position2D(this.id, [this.arrays[6], this.arrays[7]]);
        this.x_axis_2D = new Direction2D(this.id, [this.arrays[0], this.arrays[1]]);
        this.y_axis_2D = new Direction2D(this.id, [this.arrays[3], this.arrays[4]]);

        this.x_axis = new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]]);
        this.y_axis = new Direction3D(this.id, [this.arrays[3], this.arrays[4], this.arrays[5]]);
        this.z_axis = new Direction3D(this.id, [this.arrays[6], this.arrays[7], this.arrays[8]]);
    }

    get m11(): number {return this.arrays[0][this.id]}
    get m12(): number {return this.arrays[1][this.id]}
    get m13(): number {return this.arrays[2][this.id]}

    get m21(): number {return this.arrays[3][this.id]}
    get m22(): number {return this.arrays[4][this.id]}
    get m23(): number {return this.arrays[5][this.id]}

    get m31(): number {return this.arrays[6][this.id]}
    get m32(): number {return this.arrays[7][this.id]}
    get m33(): number {return this.arrays[8][this.id]}


    set m11(m11: number) {this.arrays[0][this.id] = m11}
    set m12(m12: number) {this.arrays[1][this.id] = m12}
    set m13(m13: number) {this.arrays[2][this.id] = m13}

    set m21(m21: number) {this.arrays[3][this.id] = m21}
    set m22(m22: number) {this.arrays[4][this.id] = m22}
    set m23(m23: number) {this.arrays[5][this.id] = m23}

    set m31(m31: number) {this.arrays[6][this.id] = m31}
    set m32(m32: number) {this.arrays[7][this.id] = m32}
    set m33(m33: number) {this.arrays[8][this.id] = m33}

    setTo(
        m11: number, m12: number, m13: number,
        m21: number, m22: number, m23: number,
        m31: number, m32: number, m33: number
    ): this {
        this._.set_to(
            this.id,
            this.arrays,

            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        );

        return this;
    }

    toArray(array: Float32Array = new Float32Array(9)): Float32Array {
        array[0] = this.arrays[0][this.id];
        array[1] = this.arrays[1][this.id];
        array[2] = this.arrays[2][this.id];
        array[3] = this.arrays[3][this.id];
        array[4] = this.arrays[4][this.id];
        array[5] = this.arrays[5][this.id];
        array[6] = this.arrays[6][this.id];
        array[7] = this.arrays[7][this.id];
        array[8] = this.arrays[8][this.id];

        return array;
    }

    translateBy(x: number, y: number = 0): this {
        if (x) this.translation.x += x;
        if (y) this.translation.y += y;

        return this;
    }

    scale2DBy(x: number, y: number = x): this {
        if (x !== 1) this.x_axis_2D.mul(x);
        if (y !== 1) this.y_axis_2D.mul(y);

        return this;
    }

    scaleBy(x: number, y: number = x, z: number = x): this {
        if (x !== 1) this.x_axis.mul(x);
        if (y !== 1) this.y_axis.mul(y);
        if (z !== 1) this.z_axis.mul(z);

        return this;
    }
}

export class Matrix4x4 extends RotationMatrix implements IMatrix4x4
{
    readonly _: IMatrixRotationFunctionSet;

    public readonly mat3: Matrix3x3;
    public readonly translation: Position3D;

    public readonly x_axis: Direction3D;
    public readonly y_axis: Direction3D;
    public readonly z_axis: Direction3D;

    public arrays: Float16;

    constructor(id?: number, arrays?: Float16) {
        super(matrix4x4Functions, id, arrays);

        this.x_axis = new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]]);
        this.y_axis = new Direction3D(this.id, [this.arrays[4], this.arrays[5], this.arrays[6]]);
        this.z_axis = new Direction3D(this.id, [this.arrays[8], this.arrays[9], this.arrays[10]]);

        this.translation = new Position3D(this.id, [this.arrays[12], this.arrays[13], this.arrays[14]]);
        this.mat3 = new Matrix3x3(this.id, [
            this.arrays[0], this.arrays[1], this.arrays[2],
            this.arrays[4], this.arrays[5], this.arrays[6],
            this.arrays[8], this.arrays[9], this.arrays[10]
        ]);
    }

    set m11(m11: number) {this.arrays[0][this.id] = m11}
    set m12(m12: number) {this.arrays[1][this.id] = m12}
    set m13(m13: number) {this.arrays[2][this.id] = m13}
    set m14(m14: number) {this.arrays[3][this.id] = m14}

    set m21(m21: number) {this.arrays[4][this.id] = m21}
    set m22(m22: number) {this.arrays[5][this.id] = m22}
    set m23(m23: number) {this.arrays[6][this.id] = m23}
    set m24(m24: number) {this.arrays[7][this.id] = m24}

    set m31(m31: number) {this.arrays[8][this.id] = m31}
    set m32(m32: number) {this.arrays[9][this.id] = m32}
    set m33(m33: number) {this.arrays[10][this.id] = m33}
    set m34(m34: number) {this.arrays[11][this.id] = m34}

    set m41(m41: number) {this.arrays[12][this.id] = m41}
    set m42(m42: number) {this.arrays[13][this.id] = m42}
    set m43(m43: number) {this.arrays[14][this.id] = m43}
    set m44(m44: number) {this.arrays[15][this.id] = m44}

    get m11(): number {return this.arrays[0][this.id]}
    get m12(): number {return this.arrays[1][this.id]}
    get m13(): number {return this.arrays[2][this.id]}
    get m14(): number {return this.arrays[3][this.id]}

    get m21(): number {return this.arrays[4][this.id]}
    get m22(): number {return this.arrays[5][this.id]}
    get m23(): number {return this.arrays[6][this.id]}
    get m24(): number {return this.arrays[7][this.id]}

    get m31(): number {return this.arrays[8][this.id]}
    get m32(): number {return this.arrays[9][this.id]}
    get m33(): number {return this.arrays[10][this.id]}
    get m34(): number {return this.arrays[11][this.id]}

    get m41(): number {return this.arrays[12][this.id]}
    get m42(): number {return this.arrays[13][this.id]}
    get m43(): number {return this.arrays[14][this.id]}
    get m44(): number {return this.arrays[15][this.id]}

    setTo(
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
        m41: number, m42: number, m43: number, m44: number
    ): this {
        this._.set_to(
            this.id,
            this.arrays,

            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        );

        return this;
    }

    toArray(array: Float32Array = new Float32Array(16)): Float32Array {
        array[0] = this.arrays[0][this.id];
        array[1] = this.arrays[1][this.id];
        array[2] = this.arrays[2][this.id];
        array[3] = this.arrays[3][this.id];
        array[4] = this.arrays[4][this.id];
        array[5] = this.arrays[5][this.id];
        array[6] = this.arrays[6][this.id];
        array[7] = this.arrays[7][this.id];
        array[8] = this.arrays[8][this.id];
        array[9] = this.arrays[9][this.id];
        array[10] = this.arrays[10][this.id];
        array[11] = this.arrays[11][this.id];
        array[12] = this.arrays[12][this.id];
        array[13] = this.arrays[13][this.id];
        array[14] = this.arrays[14][this.id];
        array[15] = this.arrays[15][this.id];

        return array;
    }

    translateBy(x: number, y: number = 0, z: number = 0): this {
        if (x) this.translation.x += x;
        if (y) this.translation.y += y;
        if (z) this.translation.z += z;

        return this;
    }

    scaleBy(x: number, y: number = x, z: number = x): this {
        if (x !== 1) this.x_axis.mul(x);
        if (y !== 1) this.y_axis.mul(y);
        if (z !== 1) this.z_axis.mul(z);

        return this;
    }
}

export const mat2 = (
    m11: number = 0,   m12: number = m11,
    m21: number = m11, m22: number = m11
): Matrix2x2 => new Matrix2x2().setTo(
    m11, m12,
    m21, m22
);

export const mat3 = (
    m11: number = 0,   m12: number = m11, m13: number = m11,
    m21: number = m11, m22: number = m11, m23: number = m11,
    m31: number = m11, m32: number = m11, m33: number = m11,
): Matrix3x3 => new Matrix3x3().setTo(
    m11, m12, m13,
    m21, m22, m23,
    m31, m32, m33
);

export const mat4 = (
    m11: number = 0,   m12: number = m11, m13: number = m11, m14: number = m11,
    m21: number = m11, m22: number = m11, m23: number = m11, m24: number = m11,
    m31: number = m11, m32: number = m11, m33: number = m11, m34: number = m11,
    m41: number = m11, m42: number = m11, m43: number = m11, m44: number = m11
): Matrix4x4 => new Matrix4x4().setTo(
    m11, m12, m13, m14,
    m21, m22, m23, m24,
    m31, m32, m33, m34,
    m41, m42, m43, m44
);
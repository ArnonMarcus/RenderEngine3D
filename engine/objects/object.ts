import Transform, {trans} from "./transform.js";
import {Matrix3x3Allocator, Matrix4x4Allocator} from "../lib/allocators/float.js";
import {defaultMatrix4x4Allocator} from "../math/mat4x4.js";
import {defaultMatrix3x3Allocator} from "../math/mat3x3.js";
import {IBufferSizes} from "../buffer.js";

export default class Object3D {
    static readonly SIZE: IBufferSizes = Transform.SIZE;

    constructor(
        public readonly transform: Transform
    ) {}
}

export const obj3D = (
    matrix4x4_allocator: Matrix4x4Allocator = defaultMatrix4x4Allocator,
    matrix3x3_allocator: Matrix3x3Allocator = defaultMatrix3x3Allocator
) : Object3D => new Object3D(trans(matrix4x4_allocator, matrix3x3_allocator));

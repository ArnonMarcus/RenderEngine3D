import {ATTRIBUTE, DIM, FACE_TYPE} from "../constants.js";
import {
    FaceInputNum,
    FaceInputs,
    FaceInputStr,
    FaceValues,
    FaceVertexIndices,
    IntArray,
    NumArrays, SharedVertexValues, UnsharedVertexValues,
    VertexFacesIndices,
    VertexInputNum,
    VertexInputs,
    VertexInputStr,
} from "../types.js";
import {float3, num2, num3, num4} from "../factories.js";
import {Direction3D, Position3D, RGB, UVW} from "../math/vec3.js";
import {
    Allocators,
    FaceVertexIndexAllocator,
    Vector2DAllocator,
    Vector3DAllocator,
    Vector4DAllocator,
    VertexFacesIndicesAllocator
} from "../allocators.js";
import {UV} from "../math/vec2.js";
import {Direction4D, Position4D, RGBA} from "../math/vec4.js";
import {IBaseVector, IColor, IDirection, IPosition, IUV, IVector, VectorConstructor} from "../math/interfaces.js";

export abstract class Attribute {
    public readonly id: ATTRIBUTE;
}

export class InputAttribute extends Attribute {
    public readonly dim: DIM = DIM._3D;

    constructor(
        public face_type: FACE_TYPE = FACE_TYPE.TRIANGLE,
        public vertices?: VertexInputs,
        public faces?: FaceInputs,
    ) {
        super();

        if (!faces) switch (face_type) {
            case FACE_TYPE.TRIANGLE: this.faces = num3(); break;
            case FACE_TYPE.QUAD: this.faces = num4(); break;
            default:
                throw `Invalid face type ${face_type}! Only supports triangles and quads.`;
        }

        if (!vertices) switch (this.dim) {
            case DIM._2D: this.vertices = num2(); break;
            case DIM._3D: this.vertices = num3(); break;
            default:
                throw `Invalid vertex dimension ${this.dim}! Only supports 2D or 3D.`;
        }
    }

    triangulate() {
        if (this.face_type === FACE_TYPE.QUAD) {
            const v4 = this.faces.pop();
            const quad_count = v4.length;
            const [v1, v2, v3] = this.faces;

            v1.length *= 2;
            v2.length *= 2;
            v3.length *= 2;

            for (let quad_id = 0; quad_id < quad_count; quad_id++) {
                v1[quad_id + quad_count] = v1[quad_id];
                v2[quad_id + quad_count] = v3[quad_id];
                v3[quad_id + quad_count] = v4[quad_id];
            }

            this.face_type = FACE_TYPE.TRIANGLE;
        }
    }

    private getValue(value: number | string, is_index: boolean) : number {
        let error: string;
        if (typeof value === "number") {
            if (Number.isFinite(value)) {
                if (is_index) {
                    if (Number.isInteger(value))
                        return value;
                    else
                        error = `${value} is not an integer`
                } else
                    return value;
            } else
                error = `${value} is not a finite number`;
        } else if (typeof value === "string")
            return this.getValue(+value, is_index);
        else
            error = `Got ${typeof value} ${value} instead or a number or a string`;

        throw `Invalid ${this} ${is_index ? 'index' : 'value'}! ${error}`;
    }

    private checkInputSize(input_size: number, is_index: boolean) {
        const required_size = is_index ? this.face_type : this.dim;
        if (input_size !== required_size)
            throw `Invalid ${this} ${
                is_index ? 'indices' : 'values'
            } input! Got ${input_size} ${
                is_index ? 'vertices per face' : 'dimensions'
            } instead of ${required_size}`;
    }

    pushVertex(vertex: VertexInputNum | VertexInputStr) {
        this.checkInputSize(vertex.length, false);
        for (const [component_num, component_value] of vertex.entries())
            this.vertices[component_num].push(this.getValue(component_value, false));
    }

    pushFace(face: FaceInputNum | FaceInputStr) {
        this.checkInputSize(face.length, true);
        for (const [vertex_num, vertex_index] of face.entries())
            this.faces[vertex_num].push(this.getValue(vertex_index, true));
    }
}

abstract class AbstractVertexAttribute<Vector extends IVector> extends Attribute {
    public is_shared: boolean;
    public shared_values: SharedVertexValues;
    public unshared_values: UnsharedVertexValues = [
        undefined,
        undefined,
        undefined
    ];

    protected Vector: VectorConstructor<Vector>;
    public current: [Vector, Vector, Vector];

    setCurrent(
        id_1: number,
        id_2: number = id_1,
        id_3: number = id_1
    ) : void {
        this.current[0].id = id_1;
        this.current[1].id = id_2;
        this.current[2].id = id_3;
    }

    init(allocator: Vector2DAllocator | Vector3DAllocator | Vector4DAllocator,
         size: number,
         is_shared: boolean | number = this.is_shared) {

        if (is_shared) {
            this.is_shared = true;

            if (!this.shared_values)
                this.shared_values = allocator.allocate(size);

            this.current[0] = new this.Vector(this.shared_values);
            this.current[1] = new this.Vector(this.shared_values);
            this.current[2] = new this.Vector(this.shared_values);
        } else {
            this.is_shared = false;

            if (!this.unshared_values[0]) {
                this.unshared_values[0] = allocator.allocate(size);
                this.unshared_values[1] = allocator.allocate(size);
                this.unshared_values[2] = allocator.allocate(size);
            }
            this.current[0] = new this.Vector(this.unshared_values[0]);
            this.current[1] = new this.Vector(this.unshared_values[1]);
            this.current[2] = new this.Vector(this.unshared_values[2]);
        }
    }
}

abstract class AbstractLoadableVertexAttribute<
    Vector extends IBaseVector,
    InputAttributeType extends InputAttribute
    > extends AbstractVertexAttribute<Vector> {

    protected _loadShared(input_attribute: InputAttributeType, face_vertices: FaceVertices) : void {
        let input_id, output_id: number;
        for (const [out_component, in_component] of zip(this.shared_values, input_attribute.vertices))
            for (const [output_ids, input_ids] of zip(face_vertices, input_attribute.faces))
                for ([output_id, input_id] of zip(output_ids, input_ids))
                    out_component[output_id] = in_component[input_id];
    }

    protected _loadUnShared(input_attribute: InputAttributeType) : void {
        let face_index, vertex_index: number;
        for (const [out_components, indices] of zip(this.unshared_values, input_attribute.faces))
            for (const [out_component, in_component] of zip(out_components, input_attribute.vertices))
                for ([face_index, vertex_index] of indices.entries())
                    out_component[face_index] = in_component[vertex_index];
    }

    load(input_attribute: InputAttributeType, face_vertices: FaceVertices) : void {
        if (this.is_shared)
            this._loadShared(input_attribute, face_vertices);
        else
            this._loadUnShared(input_attribute);
    }
}

abstract class AbstractPulledVertexAttribute<
    Vector extends IBaseVector,
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends AbstractFaceAttribute<Vector>
    > extends AbstractLoadableVertexAttribute<Vector, InputAttributeType> {

    pull(face_attribute: FaceAttributeType, vertex_faces: VertexFaces) : void {
        if (this.is_shared) // Average vertex-attribute values from their related face's attribute values:
            for (const [vertex_component, face_component] of zip(this.shared_values, face_attribute.face_values))
                for (const [vertex_id, face_ids] of vertex_faces.indices.entries()) {
                    let accumulator = 0;

                    // For each component 'accumulate-in' the face-value of all the faces of this vertex:
                    for (let face_id of face_ids)
                        accumulator += face_component[face_id];

                    vertex_component[vertex_id] += accumulator / face_ids.length;
                }
        else // Copy over face-attribute values to their respective vertex-attribute values:
            for (const vertex_components of this.unshared_values)
                for (const [vertex_component, face_component] of zip(vertex_components, face_attribute.face_values))
                    vertex_component.set(face_component);
    }
}

abstract class AbstractFaceAttribute<Vector extends IBaseVector> extends Attribute {
    public face_values: FaceValues;
    protected Vector: VectorConstructor<Vector>;
    public current: Vector;

    setCurrent(id: number) : void {
        this.current.id = id;
    }

    init(allocator: Vector3DAllocator, size: number) {
        if (!(this.face_values && this.face_values[0].length === size))
            this.face_values = allocator.allocate(size);

        if (!this.current)
            this.current = new this.Vector(this.face_values);
    }
}

abstract class AbstractPulledFaceAttribute<
    FaceVector extends IBaseVector,
    VertexVector extends IBaseVector,
    VertexAttributeType extends AbstractVertexAttribute<VertexVector>
    > extends AbstractFaceAttribute<FaceVector> {

    pull(vertex_attribute: VertexAttributeType, face_vertices: FaceVertices): void {
        if (vertex_attribute.is_shared)
            for (const [output, input] of zip(this.face_values, vertex_attribute.shared_values))
                for (const [face_id, [id_0, id_1, id_2]] of [...zip(face_vertices)].entries())
                    output[face_id] = (input[id_0] + input[id_1] + input[id_2]) / 3;
        else
            for (const [output, ...inputs] of zip(this.face_values, ...vertex_attribute.unshared_values))
                for (const [face_id, values] of [...zip(...inputs)].entries())
                    output[face_id] = avg(values);
    }
}

class VertexPositions<Position extends IPosition>
    extends AbstractLoadableVertexAttribute<Position, InputPositions> {

    public readonly id: ATTRIBUTE = ATTRIBUTE.position;

    protected _loadShared(input_attribute: InputPositions) : void {
        for (const [out_component, in_component] of zip(this.shared_values, input_attribute.vertices))
            out_component.set(in_component);
    }
}

class VertexNormals<
    Direction extends IDirection,
    Position extends IPosition
    > extends AbstractPulledVertexAttribute<
        Direction,
        InputNormals,
        FaceNormals<Direction, Position>
    > {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
}

class VertexColors<Color extends IColor>
    extends AbstractPulledVertexAttribute<
        Color,
        InputColors,
        FaceColors<Color>
        > {

    public readonly id: ATTRIBUTE = ATTRIBUTE.color;

    generate() {
        if (this.is_shared)
            randomize(this.shared_values);
        else
            for (const values of this.unshared_values)
                randomize(values);
    }
}

class VertexUVs<UV extends IUV> extends AbstractLoadableVertexAttribute<UV, InputUVs> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.uv;
}

export class InputPositions extends InputAttribute {public readonly id = ATTRIBUTE.position}
export class InputNormals extends InputAttribute {public readonly id = ATTRIBUTE.normal}
export class InputColors extends InputAttribute {public readonly id = ATTRIBUTE.color}
export class InputUVs extends InputAttribute {public readonly id = ATTRIBUTE.uv; public readonly dim = DIM._2D}

export class FacePositions<Position extends IPosition>
    extends AbstractPulledFaceAttribute<Position, Position, VertexPositions<Position>> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
}

export class FaceNormals<
    Direction extends IDirection,
    Position extends IPosition
    > extends AbstractPulledFaceAttribute<Direction, Position, VertexPositions<Position>> {

    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;

    pull(attribute: VertexPositions<Position>, face_vertices: FaceVertices) {
        const [ids_0, ids_1, ids_2] = face_vertices.indices;

        face_normal.arrays = [
            this.face_values[0],
            this.face_values[1],
            this.face_values[2]
        ];
        if (attribute.is_shared)
            pos1.arrays = pos2.arrays = pos3.arrays = [
                attribute.shared_values[0],
                attribute.shared_values[1],
                attribute.shared_values[2]
            ];
        else {
            pos1.arrays = [
                attribute.unshared_values[0][0],
                attribute.unshared_values[0][1],
                attribute.unshared_values[0][2]
            ];
            pos2.arrays = [
                attribute.unshared_values[1][0],
                attribute.unshared_values[1][1],
                attribute.unshared_values[1][2]
            ];
            pos3.arrays = [
                attribute.unshared_values[2][0],
                attribute.unshared_values[2][1],
                attribute.unshared_values[2][2]
            ];
        }


        for (let face_id = 0; face_id < this.face_values[0].length; face_id++) {
            face_normal.id = face_id;

            if (attribute.is_shared) {
                pos1.id = ids_0[face_id];
                pos2.id = ids_1[face_id];
                pos3.id = ids_2[face_id];
            } else
                pos1.id = pos2.id = pos3.id = face_id;

            pos1.to(pos2,
                dir1).crossedWith(pos1.to(pos3, dir2),
                dir3).normalized(face_normal);
        }
    }
}

export class FaceColors<Color extends IColor>
    extends AbstractPulledFaceAttribute<Color, Color, VertexColors<Color>> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;

    generate() {
        randomize(this.face_values);
    }
}

class AttributeCollection<
    PositionAttributeType extends Attribute,
    NormalAttributeType extends Attribute,
    ColorAttributeType extends Attribute,
    > {
    public positions: PositionAttributeType;
    public normals: NormalAttributeType;
    public colors: ColorAttributeType;

    public count: number;
    public included: number;

    protected _validate(value: number, name: string,  min: number = 0, max: number = Number.MAX_SAFE_INTEGER) : boolean {
        if (Number.isInteger(value)) {
            if (Number.isFinite(value)) {
                if (value > min) {
                    if (value < max) {
                        return true;
                    } console.debug(`${name} has to be a smaller than ${max} - got ${value}`)
                } console.debug(`${name} has to be a greater than ${min} - got ${value}`)
            } else console.debug(`${name} has to be a finite number - got ${value}`);
        } else console.debug(`${name} has to be an integer - got ${value}`);

        return false;
    }

    protected _validateParameters = () : boolean => (
        this._validate(this.count, 'Count') &&
        this._validate(this.included, 'included', 0b0001, 0b1111)
    );
}

export class FaceVertices {
    public indices: FaceVertexIndices;

    init(allocator: FaceVertexIndexAllocator, size: number) {
        if (!(this.indices && this.indices[0].length === size))
            this.indices = allocator.allocate(size);
    }

    load(inputs: FaceInputs) {
        this.indices[0].set(inputs[0]);
        this.indices[1].set(inputs[1]);
        this.indices[2].set(inputs[2]);
    }
}

export class VertexFaces {
    private _buffer: IntArray;
    public indices: VertexFacesIndices = [];

    init(allocator: VertexFacesIndicesAllocator, size: number) {
        if (!(this._buffer && this._buffer.length === size))
            this._buffer = allocator.allocate(size)[0];
    }

    load(inputs: NumArrays) {
        this.indices.length = inputs.length;

        let offset = 0;
        for (const [i, array] of inputs.entries()) {
            this.indices[i] = this._buffer.subarray(offset, array.length);
            this.indices[i].set(array);
            offset += array.length;
        }
    }
}

export class Faces<
    Position extends IPosition = Position3D,
    Direction extends IDirection = Direction3D,
    Color extends IColor = RGB
    > extends AttributeCollection<
    FacePositions<Position>,
    FaceNormals<Direction, Position>,
    FaceColors<Color>
    > {
    public readonly positions = new FacePositions<Position>();
    public readonly normals = new FaceNormals<Direction, Position>();
    public readonly colors = new FaceColors<Color>();
    public readonly vertices = new FaceVertices();

    init(allocators: Allocators, count: number, included: number) : void {
        this.count = count;
        this.included = included;

        if (!this._validateParameters())
            throw `Invalid parameters! count: ${count} included: ${included}`;

        this.vertices.init(allocators.face_vertices, count);

        if (included & ATTRIBUTE.position) this.positions.init(allocators.vec3D, count);
        if (included & ATTRIBUTE.normal) this.normals.init(allocators.vec3D, count);
        if (included & ATTRIBUTE.color) this.colors.init(allocators.vec3D, count);
    }
}

export class Faces3D extends Faces<Position3D, Direction3D, RGB> {}
export class Faces4D extends Faces<Position4D, Direction4D, RGBA> {}

export class Vertices<
        Position extends IPosition,
        Direction extends IDirection,
        Color extends IColor,
        Uv extends IUV
    > extends AttributeCollection<
    VertexPositions<Position>,
    VertexNormals<Direction, Position>,
    VertexColors<Color>
    > {
    public readonly positions = new VertexPositions<Position>();
    public readonly normals = new VertexNormals<Direction, Position>();
    public readonly colors = new VertexColors<Color>();
    public readonly uvs =  new VertexUVs<Uv>();
    public readonly faces = new VertexFaces();

    public shared: number;

    init(allocators: Allocators, count: number, included: number, shared: number) : void {
        this.count = count;
        this.included = included;
        this.shared = shared;

        if (!this._validateParameters())
            throw `Invalid parameters! count: ${count} included: ${included}`;

        this.positions.init(allocators.vec3D, count, shared & ATTRIBUTE.position);
        if (included & ATTRIBUTE.normal) this.normals.init(allocators.vec3D, count, shared & ATTRIBUTE.normal);
        if (included & ATTRIBUTE.color) this.colors.init(allocators.vec3D, count, shared & ATTRIBUTE.color);
        if (included & ATTRIBUTE.uv) this.uvs.init(allocators.vec2D, count, shared & ATTRIBUTE.uv);
    }

    protected _validateParameters = () : boolean => (
        this._validate(this.count, 'Count') &&
        this._validate(this.included, 'included', 0b0001, 0b1111) &&
        this._validate(this.shared, 'shared', 0b0000, 0b1111)
    );
}

export class Vertices3D extends Vertices<Position3D, Direction3D, RGB, UV> {}
export class Vertices4D extends Vertices<Position4D, Direction4D, RGBA, UVW> {}


const randomize = (values: readonly Float32Array[]): void => {
    // Assigned random values:
    for (const array of values)
        for (const index of array.keys())
            array[index] = Math.random();
};

// Temporary float arrays for computations:
const temp = float3(3);

const dir1 = new Direction3D(temp, 0);
const dir2 = new Direction3D(temp, 1);
const dir3 = new Direction3D(temp, 2);

const pos1 = new Position3D(temp);
const pos2 = new Position3D(temp);
const pos3 = new Position3D(temp);
const face_normal = new Direction3D(temp);

function *zip (...iterables){
    let iterators = iterables.map(i => i[Symbol.iterator]());
    while (true) {
        let results = iterators.map(iter => iter.next());
        if (results.some(res => res.done))
            return;
        else
            yield results.map(res => res.value);
    }
}

const avg = (values: number[]) : number => {
    let sum = 0;
    for (const value of values) sum += value;
    return sum / values.length;
};

function* iter2<
    T, U,
    A extends Array<T>,
    B extends Array<U>
    >(a: A, b: B, r: [number, T, U] = [0, a[0], b[0]]) : Generator<typeof r> {
    for (let i = 0; i < a.length; i++) {
        r[0] = i;
        r[1] = a[i];
        r[2] = b[i];
        yield r;
    }
}

function* iter3<T, U, V, A extends Array<T>, B extends Array<U>, C extends Array<V>>(a: A, b: B, c: C) {
    const result: [number, T, U, V] = [0, a[0], b[0], c[0]];
    for (let i = 0; i < a.length; i++) {
        result[0] = i;
        result[1] = a[i];
        result[2] = b[i];
        result[3] = c[i];
        yield result;
    }
}

import { dir3D, pos3D } from "../math/vec3.js";
import { num2, num3, num4 } from "../factories.js";
import { AllocatorSizes } from "../allocators.js";
export class Attribute {
}
export class InputAttribute extends Attribute {
    constructor(face_type = 3 /* TRIANGLE */, vertices, faces) {
        super();
        this.face_type = face_type;
        this.vertices = vertices;
        this.faces = faces;
        this.dim = 3 /* _3D */;
        if (!faces)
            switch (face_type) {
                case 3 /* TRIANGLE */:
                    this.faces = num3();
                    break;
                case 4 /* QUAD */:
                    this.faces = num4();
                    break;
                default:
                    throw `Invalid face type ${face_type}! Only supports triangles and quads.`;
            }
        if (!vertices)
            switch (this.dim) {
                case 2 /* _2D */:
                    this.vertices = num2();
                    break;
                case 3 /* _3D */:
                    this.vertices = num3();
                    break;
                default:
                    throw `Invalid vertex dimension ${this.dim}! Only supports 2D or 3D.`;
            }
    }
    triangulate() {
        if (this.face_type === 4 /* QUAD */) {
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
            this.face_type = 3 /* TRIANGLE */;
        }
    }
    getValue(value, is_index) {
        let error;
        if (typeof value === "number") {
            if (Number.isFinite(value)) {
                if (is_index) {
                    if (Number.isInteger(value))
                        return value;
                    else
                        error = `${value} is not an integer`;
                }
                else
                    return value;
            }
            else
                error = `${value} is not a finite number`;
        }
        else if (typeof value === "string")
            return this.getValue(+value, is_index);
        else
            error = `Got ${typeof value} ${value} instead or a number or a string`;
        throw `Invalid ${this} ${is_index ? 'index' : 'value'}! ${error}`;
    }
    checkInputSize(input_size, is_index) {
        const required_size = is_index ? this.face_type : this.dim;
        if (input_size !== required_size)
            throw `Invalid ${this} ${is_index ? 'indices' : 'values'} input! Got ${input_size} ${is_index ? 'vertices per face' : 'dimensions'} instead of ${required_size}`;
    }
    pushVertex(vertex) {
        this.checkInputSize(vertex.length, false);
        for (const [component_num, component_value] of vertex.entries())
            this.vertices[component_num].push(this.getValue(component_value, false));
    }
    pushFace(face) {
        this.checkInputSize(face.length, true);
        for (const [vertex_num, vertex_index] of face.entries())
            this.faces[vertex_num].push(this.getValue(vertex_index, true));
    }
}
class AbstractVertexAttribute extends Attribute {
    constructor() {
        super(...arguments);
        this.is_shared = false;
        this.offsets = [0, 0, 0];
        this.size = 0;
    }
    setCurrent(array_index_1, array_index_2 = array_index_1, array_index_3 = array_index_1) {
        this.current[0].array_index = array_index_1;
        this.current[1].array_index = array_index_2;
        this.current[2].array_index = array_index_3;
    }
    init(buffer, size, is_shared = this.is_shared) {
        this.size = size;
        this.buffer = buffer;
        this.is_shared = !!(is_shared);
        if (is_shared) {
            this.offsets[0] = buffer.allocate(size);
            this.current[0] = new this.Vector(this.offsets[0]);
        }
        else {
            this.offsets[0] = buffer.allocate(size);
            this.offsets[1] = buffer.allocate(size);
            this.offsets[2] = buffer.allocate(size);
            this.current[0] = new this.Vector(this.offsets[0]);
            this.current[1] = new this.Vector(this.offsets[1]);
            this.current[2] = new this.Vector(this.offsets[2]);
        }
    }
    *_iterUnshared() {
        for (const offset of this.offsets)
            this.buffer.slice(this.size, offset);
    }
    get shared_values() {
        return this.buffer.slice(this.size, this.offsets[0]);
    }
    get unshared_values() {
        return this._iterUnshared();
    }
}
class AbstractLoadableVertexAttribute extends AbstractVertexAttribute {
    _loadShared(input_attribute, face_vertices) {
        let input_id, output_id;
        for (const [in_component, out_component, offset] of zip(input_attribute.vertices, this.buffer.arrays, this.offsets)) {
        }
        for (const [output_ids, input_ids] of zip(face_vertices, input_attribute.faces))
            for ([output_id, input_id] of zip(output_ids, input_ids))
                out_component[output_id] = in_component[input_id];
    }
    _loadUnShared(input_attribute) {
        let face_index, vertex_index;
        for (const [out_components, indices] of zip(this.unshared_values, input_attribute.faces))
            for (const [out_component, in_component] of zip(out_components, input_attribute.vertices))
                for ([face_index, vertex_index] of indices.entries())
                    out_component[face_index] = in_component[vertex_index];
    }
    load(input_attribute, face_vertices) {
        if (this.is_shared)
            this._loadShared(input_attribute, face_vertices);
        else
            this._loadUnShared(input_attribute);
    }
}
class AbstractPulledVertexAttribute extends AbstractLoadableVertexAttribute {
    pull(face_attribute, vertex_faces) {
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
class AbstractFaceAttribute extends Attribute {
    setCurrent(id) {
        this.current.id = id;
    }
    init(allocator, size) {
        if (!(this.face_values && this.face_values[0].length === size))
            this.face_values = allocator.allocate(size);
        if (!this.current)
            this.current = new this.Vector(this.face_values);
    }
}
class AbstractPulledFaceAttribute extends AbstractFaceAttribute {
    pull(vertex_attribute, face_vertices) {
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
class VertexPositions extends AbstractLoadableVertexAttribute {
    constructor() {
        super(...arguments);
        this.id = 1 /* position */;
    }
    _loadShared(input_attribute) {
        for (const [out_component, in_component] of zip(this.shared_values, input_attribute.vertices))
            out_component.set(in_component);
    }
}
class VertexNormals extends AbstractPulledVertexAttribute {
    constructor() {
        super(...arguments);
        this.id = 2 /* normal */;
    }
}
class VertexColors extends AbstractPulledVertexAttribute {
    constructor() {
        super(...arguments);
        this.id = 4 /* color */;
    }
    generate() {
        if (this.is_shared)
            randomize(this.shared_values);
        else
            for (const values of this.unshared_values)
                randomize(values);
    }
}
class VertexUVs extends AbstractLoadableVertexAttribute {
    constructor() {
        super(...arguments);
        this.id = 8 /* uv */;
    }
}
export class InputPositions extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 1 /* position */;
    }
}
export class InputNormals extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 2 /* normal */;
    }
}
export class InputColors extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 4 /* color */;
    }
}
export class InputUVs extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 8 /* uv */;
        this.dim = 2 /* _2D */;
    }
}
export class FacePositions extends AbstractPulledFaceAttribute {
    constructor() {
        super(...arguments);
        this.id = 1 /* position */;
    }
}
export class FaceNormals extends AbstractPulledFaceAttribute {
    constructor() {
        super(...arguments);
        this.id = 2 /* normal */;
    }
    pull(attribute, face_vertices) {
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
            }
            else
                pos1.id = pos2.id = pos3.id = face_id;
            pos1.to(pos2, dir1).crossedWith(pos1.to(pos3, dir2), dir3).normalized(face_normal);
        }
    }
}
export class FaceColors extends AbstractPulledFaceAttribute {
    constructor() {
        super(...arguments);
        this.id = 4 /* color */;
    }
    generate() {
        randomize(this.face_values);
    }
}
class AttributeCollection {
    constructor(mesh) {
        this.mesh = mesh;
        this._validateParameters = () => { };
        this._validateParameters();
    }
    _validate(value, name, min = 0, max = Number.MAX_SAFE_INTEGER) {
        if (Number.isInteger(value)) {
            if (Number.isFinite(value)) {
                if (value > min) {
                    if (value < max) {
                        return true;
                    }
                    console.debug(`${name} has to be a smaller than ${max} - got ${value}`);
                }
                console.debug(`${name} has to be a greater than ${min} - got ${value}`);
            }
            else
                console.debug(`${name} has to be a finite number - got ${value}`);
        }
        else
            console.debug(`${name} has to be an integer - got ${value}`);
        return false;
    }
}
export class FaceVertices {
    constructor() {
        this.offsets = [0, 0, 0];
        this.size = 0;
    }
    init(buffer, size) {
        this.size = size;
        this.indices = buffer.arrays;
        this.offsets[0] = buffer.allocate(size);
        this.offsets[1] = buffer.allocate(size);
        this.offsets[2] = buffer.allocate(size);
    }
    load(inputs) {
        for (const [array, offset, values] of zip(this.indices, this.offsets, inputs))
            array.set(values, offset);
    }
    *[Symbol.iterator]() {
        const size = this.size;
        for (const [array, offset] of zip(this.indices, this.offsets))
            yield function* () {
                for (let i = offset; i < offset + size; i++)
                    yield array[i];
            };
    }
}
export class VertexFaces {
    constructor() {
        this.offsets = [0];
        this.sizes = [0];
    }
    init(buffer, size) {
        this.indices = buffer.arrays;
        this.offsets[0] = buffer.allocate(size);
    }
    load(inputs) {
        this.offsets.length = this.sizes.length = inputs.length;
        let offset = this.offsets[0];
        for (const [i, values] of inputs.entries()) {
            this.indices[0].set(values, offset);
            this.offsets[i] = offset;
            this.sizes[i] = values.length;
            offset += values.length;
        }
    }
}
export class Faces extends AttributeCollection {
    constructor() {
        super(...arguments);
        this.positions = new FacePositions();
        this.normals = new FaceNormals();
        this.colors = new FaceColors();
        this.vertices = new FaceVertices();
        this._validateParameters = () => {
            if (!(this._validate(this.mesh.face_count, 'Count') &&
                this._validate(this.mesh.options.face_attributes, 'included', 0b0001, 0b1111)))
                throw `Invalid parameters! count: ${this.mesh.face_count} included: ${this.mesh.options.face_attributes}`;
        };
    }
    init(allocators, count, included) {
        this.vertices.init(allocators.face_vertices, count);
        if (included & 1 /* position */)
            this.positions.init(allocators.vec3D, count);
        if (included & 2 /* normal */)
            this.normals.init(allocators.vec3D, count);
        if (included & 4 /* color */)
            this.colors.init(allocators.vec3D, count);
    }
}
export class Faces3D extends Faces {
}
export class Faces4D extends Faces {
}
export class Vertices extends AttributeCollection {
    constructor() {
        super(...arguments);
        this.positions = new VertexPositions();
        this.normals = new VertexNormals();
        this.colors = new VertexColors();
        this.uvs = new VertexUVs();
        this.faces = new VertexFaces();
        this._validateParameters = () => {
            if (!(this._validate(this.mesh.vertex_count, 'Count') &&
                this._validate(this.mesh.options.vertex_attributes, 'included', 0b0001, 0b1111) &&
                this._validate(this.shared, 'shared', 0b0000, 0b1111)))
                throw `Invalid parameters! count: ${this.mesh.vertex_count} included: ${this.mesh.options.vertex_attributes}`;
        };
    }
    get allocator_sizes() {
        const result = new AllocatorSizes({
            face_vertices: this.mesh.vertex_count,
            vertex_faces: this.mesh.inputs.vertex_faces.size
        });
        const vertex_attributes = this.mesh.options.vertex_attributes;
        const face_attributes = this.mesh.options.face_attributes;
        const vertex_size = this.mesh.vertex_count * 4;
        result.vec3D += vertex_size;
        if (vertex_attributes & 2 /* normal */)
            result.vec3D += vertex_size;
        if (vertex_attributes & 4 /* color */)
            result.vec3D += vertex_size;
        if (vertex_attributes & 8 /* uv */)
            result.vec2D += vertex_size;
        if (face_attributes & 1 /* position */)
            result.vec3D += this.mesh.face_count;
        if (face_attributes & 2 /* normal */)
            result.vec3D += this.mesh.face_count;
        if (face_attributes & 4 /* color */)
            result.vec3D += this.mesh.face_count;
        return result;
    }
    init(allocators, count, included, shared) {
        this.positions.init(allocators.vec3D, count, shared & 1 /* position */);
        if (included & 2 /* normal */)
            this.normals.init(allocators.vec3D, count, shared & 2 /* normal */);
        if (included & 4 /* color */)
            this.colors.init(allocators.vec3D, count, shared & 4 /* color */);
        if (included & 8 /* uv */)
            this.uvs.init(allocators.vec2D, count, shared & 8 /* uv */);
    }
}
export class Vertices3D extends Vertices {
}
export class Vertices4D extends Vertices {
}
const randomize = (values) => {
    // Assigned random values:
    for (const array of values)
        for (const index of array.keys())
            array[index] = Math.random();
};
const dir1 = dir3D();
const dir2 = dir3D();
const dir3 = dir3D();
const pos1 = pos3D();
const pos2 = pos3D();
const pos3 = pos3D();
const face_normal = dir3D();
function* zip(...iterables) {
    let iterators = iterables.map(i => i[Symbol.iterator]());
    while (true) {
        let results = iterators.map(iter => iter.next());
        if (results.some(res => res.done))
            return;
        else
            yield results.map(res => res.value);
    }
}
const avg = (values) => {
    let sum = 0;
    for (const value of values)
        sum += value;
    return sum / values.length;
};
function* iter2(a, b, r = [0, a[0], b[0]]) {
    for (let i = 0; i < a.length; i++) {
        r[0] = i;
        r[1] = a[i];
        r[2] = b[i];
        yield r;
    }
}
function* iter3(a, b, c) {
    const result = [0, a[0], b[0], c[0]];
    for (let i = 0; i < a.length; i++) {
        result[0] = i;
        result[1] = a[i];
        result[2] = b[i];
        result[3] = c[i];
        yield result;
    }
}
//# sourceMappingURL=attribute.js.map
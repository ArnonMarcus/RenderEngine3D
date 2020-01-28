import {iterTriangles, Triangle} from "./_base.js";
import {UV2D, UV3D} from "../../accessors/uv.js";
import {UVs2D, UVs3D} from "../vectors.js";
import {InputUVs} from "../../geometry/inputs.js";
import {ATTRIBUTE} from "../../../constants.js";
import {loadVertices} from "./_core.js";
import {IFaceVertices} from "../../_interfaces/buffers.js";
import {IVertexAttribute} from "../../_interfaces/attributes.js";


export class VertexUVs2D extends UVs2D implements IVertexAttribute<UV2D, ATTRIBUTE.uv> {
    readonly attribute: ATTRIBUTE.uv;

    protected _is_shared: boolean;

    current_triangle: Triangle<UV2D>;

    constructor(
        readonly vertex_count: number,
        readonly face_vertices: IFaceVertices,
        is_shared: number | boolean = true,
        readonly face_count: number = face_vertices.length
    ) {
        super();
        this._is_shared = !!is_shared;
    }

    autoInit(arrays?: Float32Array[]): this {
        this.init(this._is_shared ? this.vertex_count : this.face_count * 3, arrays);
        return this;
    }

    get is_shared(): boolean {return this._is_shared}
    get triangles(): Generator<Triangle<UV2D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(UV2D, this.arrays);
    }

    load(inputs: InputUVs): this {
        loadVertices(this.arrays, inputs.vertices, this.face_vertices.arrays, inputs.faces_vertices, this.face_count, this._is_shared);
        return this;
    }
}

export class VertexUVs3D extends UVs3D implements IVertexAttribute<UV3D, ATTRIBUTE.uv> {
    readonly attribute: ATTRIBUTE.uv;

    protected _is_shared: boolean;

    current_triangle: Triangle<UV3D>;

    constructor(
        readonly vertex_count: number,
        readonly face_vertices: IFaceVertices,
        is_shared: number | boolean = true,
        readonly face_count: number = face_vertices.length
    ) {
        super();
        this._is_shared = !!is_shared;
    }

    autoInit(arrays?: Float32Array[]): this {
        this.init(this._is_shared ? this.vertex_count : this.face_count * 3, arrays);
        return this;
    }

    get is_shared(): boolean {return this._is_shared}
    get triangles(): Generator<Triangle<UV3D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(UV3D, this.arrays);
    }

    load(inputs: InputUVs): this {
        loadVertices(this.arrays, inputs.vertices, this.face_vertices.arrays, inputs.faces_vertices, this.face_count, this._is_shared);
        return this;
    }
}
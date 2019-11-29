import {PulledVertexAttribute} from "./_base.js";
import {InputNormals} from "../../../primitives/mesh.js";
import {ATTRIBUTE, DIM} from "../../../constants.js";
import {Direction3D, Direction4D} from "../../accessors/vector/direction.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../../allocators/float.js";
import {FaceNormals3D, FaceNormals4D} from "../face/normal.js";
import {IVertexNormals} from "../../_interfaces/attributes/vertex/normal.js";

export class VertexNormals3D extends PulledVertexAttribute<DIM._3D, Direction3D, InputNormals, FaceNormals3D>
    implements IVertexNormals<DIM._3D, Direction3D>
{
    readonly attribute = ATTRIBUTE.normal;

    readonly dim = DIM._3D;
    readonly Vector = Direction3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;
}

export class VertexNormals4D extends PulledVertexAttribute<DIM._4D, Direction4D, InputNormals, FaceNormals4D>
    implements IVertexNormals<DIM._4D, Direction4D>
{
    readonly attribute = ATTRIBUTE.normal;

    readonly dim = DIM._4D;
    readonly Vector = Direction4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;
}

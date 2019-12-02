import {MeshOptions} from "../options.js";
import {FaceVertices} from "../face/vertices.js";
import {ATTRIBUTE, DIM} from "../../../constants.js";
import {VertexUVs2D, VertexUVs3D} from "../../attributes/vertex/uv.js";
import {VertexColors3D, VertexColors4D} from "../../attributes/vertex/color.js";
import {VertexNormals3D, VertexNormals4D} from "../../attributes/vertex/normal.js";
import {VertexPositions3D, VertexPositions4D} from "../../attributes/vertex/position.js";
import {IVertexUVs, IVertexUVsConstructor} from "../../_interfaces/attributes/vertex/uv.js";
import {IVertexColors, IVertexColorsConstructor} from "../../_interfaces/attributes/vertex/color.js";
import {IVertexNormals, IVertexNormalsConstructor} from "../../_interfaces/attributes/vertex/normal.js";
import {IVertexPositions, IVertexPositionsConstructor} from "../../_interfaces/attributes/vertex/position.js";


abstract class Vertices<PositionDim extends DIM._3D | DIM._4D,
    NormalDim extends DIM._3D | DIM._4D = PositionDim,
    ColorDim extends DIM._3D | DIM._4D = PositionDim,
    UVDim extends DIM._2D | DIM._3D = PositionDim extends DIM._3D ? DIM._2D : DIM._3D>
{
    protected readonly VertexPositions: IVertexPositionsConstructor<PositionDim>;
    protected readonly VertexNormals: IVertexNormalsConstructor<NormalDim>;
    protected readonly VertexColors: IVertexColorsConstructor<ColorDim>;
    protected readonly VertexUVs: IVertexUVsConstructor<UVDim>;

    public positions: IVertexPositions<PositionDim>;
    public normals: IVertexNormals<NormalDim>|null;
    public colors: IVertexColors<ColorDim>|null;
    public uvs: IVertexUVs<UVDim>|null;

    constructor(
        face_vertices: FaceVertices,
        mesh_options: MeshOptions
    ) {
        const included = mesh_options.vertex_attributes;

        this.positions = new this.VertexPositions(
            face_vertices,mesh_options.share & ATTRIBUTE.position
        );

        this.normals = included & ATTRIBUTE.normal ?
            new this.VertexNormals(
                face_vertices,mesh_options.share & ATTRIBUTE.normal
            ) : null;

        this.colors = included & ATTRIBUTE.color ?
            new this.VertexColors(
                face_vertices,mesh_options.share & ATTRIBUTE.color
            ) : null;

        this.uvs = included & ATTRIBUTE.uv ?
            new this.VertexUVs(
                face_vertices,mesh_options.share & ATTRIBUTE.color
            ) : null;
    }
}

export class Vertices3D extends Vertices<DIM._3D>
{
    protected readonly VertexPositions = VertexPositions3D;
    protected readonly VertexNormals = VertexNormals3D;
    protected readonly VertexColors = VertexColors3D;
    protected readonly VertexUVs = VertexUVs2D;

    public positions: VertexPositions3D;
    public normals: VertexNormals3D;
    public colors: VertexColors3D;
    public uvs: VertexUVs2D;
}

export class Vertices4D extends Vertices<DIM._4D> {
    protected readonly VertexPositions = VertexPositions4D;
    protected readonly VertexNormals = VertexNormals4D;
    protected readonly VertexColors = VertexColors4D;
    protected readonly VertexUVs = VertexUVs3D;

    public positions: VertexPositions4D;
    public normals: VertexNormals4D;
    public colors: VertexColors4D;
    public uvs: VertexUVs3D;
}
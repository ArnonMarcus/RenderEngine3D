import {cube_face_vertices, cube_vertex_count} from "./cube.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";
import {Position3D, Position4D} from "../accessors/position.js";


abstract class Bounds {
    readonly abstract vertex_positions: VertexPositions3D|VertexPositions4D;
    readonly abstract min: Position3D|Position4D;
    readonly abstract max: Position3D|Position4D;

    load(source_positions: VertexPositions3D|VertexPositions4D) {
        const [x, y, z] = this.vertex_positions.arrays;

        x[0] = x[3] = x[4] = x[7] = Math.min.apply(Math, source_positions[0]);
        x[1] = x[2] = x[5] = x[6] = Math.max.apply(Math, source_positions[0]);

        y[0] = y[1] = y[4] = x[5] = Math.min.apply(Math, source_positions[1]);
        y[2] = y[3] = y[6] = y[7] = Math.max.apply(Math, source_positions[1]);

        z[0] = z[1] = z[2] = z[3] = Math.min.apply(Math, source_positions[2]);
        z[4] = z[5] = z[6] = z[7] = Math.max.apply(Math, source_positions[2]);
    }
}

export class Bounds3D extends Bounds {
    constructor(
        public readonly vertex_positions = new VertexPositions3D(cube_vertex_count, cube_face_vertices),
        public readonly min = new Position3D(0, vertex_positions.arrays),
        public readonly max = new Position3D(6, vertex_positions.arrays)
    ) {
        super();
    }
}

export class Bounds4D extends Bounds {
    constructor(
        public readonly vertex_positions = new VertexPositions4D(cube_vertex_count, cube_face_vertices),
        public readonly min = new Position4D(0, vertex_positions.arrays),
        public readonly max = new Position4D(6, vertex_positions.arrays)
    ) {
        super();
    }
}
import Geometry, {MeshGeometries} from "./geometry.js";
import Mesh from "../geometry/mesh.js";
// import {MeshShader} from "./shaders/mesh/base.js";
import {VertexPositions4D} from "../geometry/positions.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {cullFaces, cullVertices} from "../math/rendering/culling.js";
import {VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";
import {cube_face_vertices} from "../geometry/cube.js";
import {CLIP} from "../../constants.js";
import {T3, T4} from "../../types.js";
import {IMeshCallback, IRenderPipeline, IViewport} from "../_interfaces/render.js";
import Viewport from "./viewport.js";
import Scene from "../scene_graph/scene.js";
import {IGeometry, IMesh} from "../_interfaces/geometry.js";
import {IScene} from "../_interfaces/nodes.js";


export abstract class BaseRenderPipeline<
    Context extends RenderingContext,
    SceneType extends IScene<Context>>
    implements IRenderPipeline<Context, SceneType>
{
    abstract render(viewport: IViewport<Context>): void;

    readonly model_to_clip: Matrix4x4 = new Matrix4x4();

    readonly on_mesh_loaded_callback: IMeshCallback;
    readonly on_mesh_added_callback: IMeshCallback;
    readonly on_mesh_removed_callback: IMeshCallback;

    constructor(readonly context: Context, readonly scene: SceneType) {
        this.on_mesh_loaded_callback = this.on_mesh_loaded.bind(this);
        this.on_mesh_added_callback = this.on_mesh_added.bind(this);
        this.on_mesh_removed_callback = this.on_mesh_removed.bind(this);

        this.scene.mesh_geometries.on_mesh_added.add(this.on_mesh_added_callback);
        this.scene.mesh_geometries.on_mesh_removed.add(this.on_mesh_removed_callback);
    }

    on_mesh_loaded(mesh: IMesh) {}
    on_mesh_added(mesh: IMesh) {mesh.on_mesh_loaded.add(this.on_mesh_loaded_callback)}
    on_mesh_removed(mesh: IMesh) {mesh.on_mesh_loaded.delete(this.on_mesh_loaded_callback)}

    delete(): void {
        this.scene.mesh_geometries.on_mesh_added.delete(this.on_mesh_added_callback);
        this.scene.mesh_geometries.on_mesh_removed.delete(this.on_mesh_removed_callback);
    }
}

export default class RenderPipeline extends BaseRenderPipeline<CanvasRenderingContext2D, Scene> {
    cull_back_faces: boolean = false;

    protected current_max_face_count: number = 0;
    protected current_max_vertex_count: number = 0;

    protected interpolations: Float32Array;
    protected src_trg_indices: Uint32Array;
    protected src_trg_numbers: Uint8Array;
    protected vertex_flags: Uint8Array;
    protected face_flags: Uint8Array;

    protected readonly clip_space_vertex_positions = new VertexPositions4D(8, cube_face_vertices);


    protected _updateClippingBuffers(): void {
        let max_face_count = 0;
        let max_vertex_count = 0;

        for (const mesh of this.scene.mesh_geometries.meshes) {
            for (const geometry of this.scene.mesh_geometries.getGeometries(mesh)) {
                if (geometry.is_renderable) {
                    if (geometry.mesh.face_count > max_face_count)
                        max_face_count = geometry.mesh.face_count;

                    if (geometry.mesh.vertex_count> max_vertex_count)
                        max_vertex_count = geometry.mesh.vertex_count;
                }
            }
        }

        if (max_face_count > this.current_max_face_count) {
            this.current_max_face_count = max_face_count;

            this.face_flags = new Uint8Array(max_face_count);
            this.clip_space_vertex_positions.arrays = VECTOR_4D_ALLOCATOR.allocateBuffer(max_face_count) as T4<Float32Array>;

            this.src_trg_numbers = new Uint8Array(max_face_count);

            max_face_count += max_face_count;
            this.interpolations = new Float32Array(max_face_count);

            max_face_count += max_face_count;
            this.src_trg_indices = new Uint32Array(max_face_count);
        }

        if (max_vertex_count > this.current_max_vertex_count) {
            this.current_max_vertex_count = max_vertex_count;
            this.face_flags = new Uint8Array(max_vertex_count);
        }
    }

    render(viewport: Viewport): void {
        if (!this.scene.mesh_geometries.mesh_count)
            return;

        this._updateClippingBuffers();

        let mesh: IMesh;
        // let mesh_shader: MeshShader;
        let mesh_geometry: IGeometry;
        let mesh_geometries: Set<Geometry>;

        const n = viewport.camera.near;
        const world_to_clip = viewport.world_to_clip;
        const model_to_clip = this.model_to_clip;
        const clip_positions = this.clip_space_vertex_positions;
        const cp = clip_positions.arrays;

        const vf = this.vertex_flags;
        const ff = this.face_flags;
        const cbf = this.cull_back_faces;
        const cc = true; // Always do clipping checks

        const stn = this.src_trg_numbers;
        const sti = this.src_trg_indices;
        const ipl = this.interpolations;

        let fv: T3<Uint8Array|Uint16Array|Uint32Array>;
        let v1, v2, v3: Uint8Array|Uint16Array|Uint32Array;
        let vc, fc, result: number;
        const pz = viewport.camera.projection_matrix.translation.z;

        for (const material of this.scene.materials) {
            // mesh_shader = material.mesh_shader;

            for (mesh of material.mesh_geometries.meshes) {
                // fv = mesh.face_vertices.arrays;
                vc = mesh.vertex_count;
                fc = mesh.face_count;

                // mesh_shader.bindMesh(mesh);

                for (mesh_geometry of material.mesh_geometries.getGeometries(mesh)) if (mesh_geometry.is_renderable) {
                    // Prepare a matrix for converting from model space to clip space:
                    mesh_geometry.model_to_world.mul(world_to_clip, model_to_clip);

                    // Bind the inputs and outputs for the mesh shader, and execute it.
                    // Skip this geometry if it returns a CULL flag (0):
                    // if (mesh_shader.bindInputs(model_to_clip).bindOutputs(clip_positions).shade()) {
                    //     // The mesh shader did not cull this geometry.
                    //     // Cull the vertices against the view frustum:
                    //     if (cullVertices(cp, vf, vc)) {
                    //         // The mesh could not be determined to be outside the view frustum based on vertex culling alone.
                    //         // Check it's faces as well and check for clipping cases:
                    //         result = cullFaces(cp, fv, fc, ff, vf, cc, cbf, pz);
                    //         if (result) {
                    //             if (result === CLIP) {
                    //
                    //             }
                    //         }
                    //     }
                        //
                        // for (vertex_attribute of this.material.vertex_attributes) {
                        //     if (vertex_attribute.is_shared)
                        //         clipSharedAttribute(
                        //             vertex_attribute.arrays,
                        //
                        //             this.src_trg_indices,
                        //             this.src_trg_numbers,
                        //             this.interpolations,
                        //             this.face_flags,
                        //
                        //             clipped_vertex_attribute.arrays
                        //         );
                        //     else
                        //         clipUnsharedAttribute(
                        //             vertex_attribute.arrays,
                        //
                        //             this.src_trg_numbers,
                        //             this.interpolations,
                        //             this.face_flags,
                        //
                        //             clipped_vertex_attribute.arrays
                        //         );
                        // }

                        // Note:
                        // Additional vertex attributes might need to be 'clipped' as well if the mesh has any:
                        // if (this.result_flags === CLIP) {
                        //     this.clipper.clipAttr(this.in_vertex_attribute_1, out_vertex_attribute_1);
                        //     this.clipper.clipAttr(this.in_vertex_attribute_2, out_vertex_attribute_2);
                        //     ...
                        //     this.clipper.clipAttr(this.in_vertex_attribute_n, out_vertex_attribute_n);
                        // }
                    // }
                }
            }
        }
    }
}
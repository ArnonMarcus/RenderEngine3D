import Matrix4x4 from "../../../accessors/matrix4x4.js";
import GLMaterial from "./materials/_base.js";
import GLViewport from "./viewport.js";
import GLMeshBuffers from "./_core/mesh_buffers.js";
import {BaseRenderPipeline} from "../../_base/pipelines.js";
import {IMesh} from "../../../_interfaces/geometry.js";
import {IRasterRenderPipeline} from "../../../_interfaces/render.js";


export default class GLRenderPipeline
    extends BaseRenderPipeline<WebGL2RenderingContext, GLViewport, GLMaterial>
    implements IRasterRenderPipeline<WebGL2RenderingContext, GLViewport, GLMaterial>
{
    readonly model_to_clip: Matrix4x4 = new Matrix4x4();
    readonly mesh_buffers = new Map<IMesh, GLMeshBuffers>();

    render(viewport: GLViewport): void {
        for (const material of this.materials) {
            material.program.use();

            for (const mesh of material.mesh_geometries.meshes) {
                material.prepareMeshForDrawing(mesh, this);

                for (const geometry of material.mesh_geometries.getGeometries(mesh)) {
                    geometry.model_to_world.mul(viewport.world_to_clip, this.model_to_clip);
                    material.drawMesh(mesh, this.model_to_clip);
                }
            }
        }
    }

    on_mesh_loaded(mesh: IMesh) {
        this.mesh_buffers.get(mesh).load();
    }

    on_mesh_added(mesh: IMesh) {
        this.mesh_buffers.set(mesh, new GLMeshBuffers(this.context, mesh));
    }

    on_mesh_removed(mesh: IMesh) {
        this.mesh_buffers.get(mesh).delete();
        this.mesh_buffers.delete(mesh);
    }
}
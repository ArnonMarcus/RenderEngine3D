import RayTraceViewport from "./viewport.js";
import {BaseRenderPipeline} from "../_base/pipelines.js";
import {IRenderTarget} from "../../_interfaces/render.js";


export default class RayTracer extends BaseRenderPipeline<CanvasRenderingContext2D, RayTraceViewport>
{
    render(viewport: RayTraceViewport): void {
        // if (!this.scene.mesh_geometries.mesh_count)
        //     return;

        render_target = viewport.render_target;
        render_target.clear();

        width = viewport.width;
        height = viewport.height;

        y_start = viewport.y;
        x_start = viewport.x;

        y_end = y_start + height;
        x_end = x_start + width;

        if (viewport.is_active) {
            ray_x = viewport.ray_positions.arrays[0];
            ray_y = viewport.ray_positions.arrays[1];
            ray_z = viewport.ray_positions.arrays[2];
        } else {
            ray_x = viewport.ray_directions_transformed.arrays[0];
            ray_y = viewport.ray_directions_transformed.arrays[1];
            ray_z = viewport.ray_directions_transformed.arrays[2];
        }

        ray_direction_index = 0;

        for (y = y_start; y < y_end; y++) {
            for (x = x_start; x < x_end; x++) {
                render_target.putPixel(
                    x, y,
                    ray_x[ray_direction_index],
                    ray_y[ray_direction_index],
                    ray_z[ray_direction_index],
                    1
                );
                ray_direction_index++;
            }
        }

        render_target.draw();
    }
}


let render_target: IRenderTarget;

let ray_x,
    ray_y,
    ray_z: Float32Array;

let width,
    height,

    x, x_start, x_end,
    y, y_start, y_end,

    ray_direction_index: number;
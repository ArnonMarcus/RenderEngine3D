import {GLScene} from "../render/engine.js";
import {GLCamera} from "../render/camera.js";
import {GLViewport} from "./viewport.js";
import {GLRenderPipeline} from "../render/pipeline.js";

import {BaseScreen} from "../../../lib/render/screen.js";
import {IRectangle} from "../../../lib/_interfaces/render.js";
import {IVector2D} from "../../../lib/_interfaces/vectors.js";


export class GLScreen extends BaseScreen<WebGL2RenderingContext, GLScene, GLCamera, GLRenderPipeline, GLViewport> {
    protected _createDefaultRenderPipeline(context: WebGL2RenderingContext, scene: GLScene): GLRenderPipeline {
        return new GLRenderPipeline(context, scene);
    }

    protected _createViewport(
        camera: GLCamera,
        render_pipeline: GLRenderPipeline,
        size: IRectangle,
        position: IVector2D
    ): GLViewport {
        return new GLViewport(camera, render_pipeline, this, size, position);
    }

    clear() {
        gl = this.context;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

let gl: WebGL2RenderingContext;
import {INode3D, IScene} from "./nodes.js";
import {IVector2D} from "./vectors.js";
import {IMatrix4x4} from "./matrix.js";
import {IController} from "./input.js";
import {IGeometry, IMesh} from "./geometry.js";

export interface IRectangle
{
    width: number,
    height: number
}

export interface ICamera extends INode3D {
    fov: number;
    far: number;
    near: number;
    zoom: number;

    depth_factor: number;
    focal_length: number;
    aspect_ratio: number;

    readonly scene: IScene;
    readonly projection_matrix: IMatrix4x4;

    updateProjectionMatrix(): void;
}

export type CameraConstructor<Instance extends ICamera> = new (scene: IScene) => Instance;

export interface IMaterial<
    Context extends RenderingContext> {
    readonly id: number;
    readonly scene: IScene<Context>;
    readonly mesh_geometries: IMeshGeometries;

    prepareMeshForDrawing(mesh: IMesh, render_pipeline: IRenderPipeline<Context, IScene<Context>>): void;
    drawMesh(mesh: IMesh, matrix: IMatrix4x4): any;
}

export type MaterialConstructor<
    Context extends RenderingContext,
    Instance extends IMaterial<Context> = IMaterial<Context>
    > = new (scene: IScene<Context>) => Instance;

export type IMeshCallback = (mesh: IMesh) => void;

export interface IMeshGeometries {
    readonly scene: IScene;
    readonly meshes: Generator<IMesh>;
    readonly mesh_count: number;
    readonly on_mesh_added: Set<IMeshCallback>;
    readonly on_mesh_removed: Set<IMeshCallback>;

    hasMesh(mesh: IMesh): boolean;
    hasGeometry(geometry: IGeometry): boolean;

    getGeometryCount(mesh: IMesh): number;
    getGeometries(mesh: IMesh): Generator<IGeometry>;

    addGeometry(mesh: IMesh): IGeometry;
    addGeometry(geometry: IGeometry): IGeometry;
    addGeometry(mesh_or_geometry: IGeometry | IMesh): IGeometry;
    removeGeometry(geometry: IGeometry): void;
}

export interface IRenderPipeline<
    Context extends RenderingContext,
    SceneType extends IScene<Context>>
{
    readonly scene: SceneType,
    readonly context: Context;
    readonly model_to_clip: IMatrix4x4;

    delete(): void;
    render(viewport: IViewport<Context>): void;

    on_mesh_added(mesh: IMesh): void;
    on_mesh_removed(mesh: IMesh): void;
    on_mesh_loaded(mesh: IMesh): void;

    readonly on_mesh_loaded_callback: IMeshCallback;
    readonly on_mesh_added_callback: IMeshCallback;
    readonly on_mesh_removed_callback: IMeshCallback;
}

export interface IViewport<
    Context extends RenderingContext = RenderingContext,
    SceneType extends IScene<Context> = IScene<Context>,
    CameraType extends ICamera = ICamera,
    RenderPipelineType extends IRenderPipeline<Context, SceneType> = IRenderPipeline<Context, SceneType>>
{
    camera: CameraType
    render_pipeline: RenderPipelineType;

    readonly width: number;
    readonly height: number;
    readonly x: number;
    readonly y: number;

    readonly scene: SceneType;
    readonly world_to_view: IMatrix4x4;
    readonly world_to_clip: IMatrix4x4;

    refresh(): void;
    updateMatrices(): void;
    scale(x: number, y: number): void;
    reset(width: number, height: number, x: number, y: number): void;
}


export interface IScreen<
    Context extends RenderingContext,
    SceneType extends IScene<Context>,
    CameraType extends ICamera,
    RenderPipelineType extends IRenderPipeline<Context, SceneType>,
    ViewportType extends IViewport<Context, SceneType, CameraType, RenderPipelineType
        > = IViewport<Context, SceneType, CameraType, RenderPipelineType>>
{
    scene: SceneType;
    context: Context;
    controller: IController;
    active_viewport: ViewportType;

    readonly viewports: Generator<ViewportType>;

    clear(): void;
    refresh(): void;
    resize(width: number, height: number): void;

    addViewport(camera: CameraType, size?: IRectangle, position?: IVector2D): ViewportType;
    removeViewport(viewport: ViewportType): void;

    registerViewport(viewport: ViewportType): void;
    unregisterViewport(viewport: ViewportType): void;
}

export interface IRenderEngineKeys {
    ctrl: number;
    esc: number;
    space: number;
}

export interface IRenderEngine<
    Context extends RenderingContext,
    SceneType extends IScene<Context>,
    CameraType extends ICamera,
    RenderPipelineType extends IRenderPipeline<Context, SceneType>,
    ViewportType extends IViewport<Context, SceneType, CameraType, RenderPipelineType>,
    ScreenType extends IScreen<Context, SceneType, CameraType, RenderPipelineType, ViewportType>>
{
    readonly canvas: HTMLCanvasElement;
    readonly context: Context;

    readonly key_bindings: IRenderEngineKeys;
    readonly key_pressed: IRenderEngineKeys;

    scene: SceneType;
    screen: ScreenType;
    controller: IController;

    readonly is_active: boolean;
    readonly is_running: boolean;

    handleEvent(event: Event): void;
    update(timestamp): void;

    start(): void;
    stop(): void;
}
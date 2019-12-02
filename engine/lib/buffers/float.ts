import {IFloatBuffer} from "../_interfaces/buffers/float.js";
import {IFloatAllocator} from "../_interfaces/allocators.js";
import {FloatArray} from "../../types.js";
import {Buffer} from "./_base.js";
import {DIM} from "../../constants.js";

export abstract class FloatBuffer<Dim extends DIM> extends Buffer<FloatArray, Dim>
    implements IFloatBuffer<Dim>
{
    abstract readonly allocator: IFloatAllocator<Dim>;
}
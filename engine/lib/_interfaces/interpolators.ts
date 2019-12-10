import {IAccessor} from "./accessors.js";
import {IBarycentricInterpolatorFunctionSet, ILinearInterpolatorFunctionSet} from "./functions.js";

export interface ILinearInterpolator<AccessorType extends IAccessor = IAccessor>
    extends IAccessor {
    _: ILinearInterpolatorFunctionSet;

    interpolate(from: AccessorType, to: AccessorType, out?: AccessorType): AccessorType;
}

export interface IBarycentricInterpolator<AccessorType extends IAccessor = IAccessor>
    extends IAccessor {
    _: IBarycentricInterpolatorFunctionSet;

    interpolate(from: AccessorType, to: AccessorType, out?: AccessorType): AccessorType;
}
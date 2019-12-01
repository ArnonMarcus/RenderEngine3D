import {Arrays, IArithmaticFunctionSet, IFunctionSet} from "../function_sets.js";

export type IAccessorConstructor<Accessor extends IAccessor> = new (
    id?: number,
    arrays?: Float32Array[]
) => Accessor;

export interface IAccessor {
    _: IFunctionSet,

    id: number;
    arrays: Arrays;

    setTo(...values: number[]): this;
    setAllTo(value: number): this;
    setFrom(other: this): this;

    is(other: IAccessor): boolean;
    equals(other: IAccessor): boolean;

    copy(out?: this): this;
}

export interface IArithmaticAccessor
    extends IAccessor
{
    _: IArithmaticFunctionSet,
    _newOut(): IArithmaticAccessor;

    add(other: IArithmaticAccessor);
    subtract(other: IArithmaticAccessor): this;

    divideBy(denominator: number): this;
    over(denominator: number, out?: this): this;

    scaleBy(factor: number): this;
    times(factor: number, out?: this): this;

    plus(other: IArithmaticAccessor, out?: IArithmaticAccessor): IArithmaticAccessor;
    minus(other: IArithmaticAccessor, out?: IArithmaticAccessor): IArithmaticAccessor;

    invert(): this;
    inverted(out?: this): this;
}
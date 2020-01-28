import Vector2D from "./vector2D.js";
import Vector3D from "./vector3D.js";
import {IUV2D, IUV3D} from "../_interfaces/vectors.js";


export class UV2D extends Vector2D<UV2D> implements IUV2D
{
    setTo(u: number, v: number): this {return super.setTo(u, v)}
    copy(out: UV2D = new UV2D()): UV2D {return out.setFrom(this)}

    set u(u: number) {this.arrays[0][this.id] = u}
    set v(v: number) {this.arrays[1][this.id] = v}

    get u(): number {return this.arrays[0][this.id]}
    get v(): number {return this.arrays[1][this.id]}

    get uu(): UV2D {return new UV2D(this.id, [this.arrays[0], this.arrays[0]])}
    get uv(): UV2D {return new UV2D(this.id, [this.arrays[0], this.arrays[1]])}

    get vu(): UV2D {return new UV2D(this.id, [this.arrays[1], this.arrays[0]])}
    get vv(): UV2D {return new UV2D(this.id, [this.arrays[1], this.arrays[1]])}

    set uv(other: UV2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set vu(other: UV2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
}

export class UV3D extends Vector3D<UV3D> implements IUV3D
{
    setTo(u: number, v: number, w: number): this {return super.setTo(u, v, w)}
    copy(out: UV3D = new UV3D()): UV3D {return out.setFrom(this)}

    set u(u: number) {this.arrays[0][this.id] = u}
    set v(v: number) {this.arrays[1][this.id] = v}
    set w(w: number) {this.arrays[2][this.id] = w}

    get u(): number {return this.arrays[0][this.id]}
    get v(): number {return this.arrays[1][this.id]}
    get w(): number {return this.arrays[2][this.id]}

    get uu(): UV2D {return new UV2D(this.id, [this.arrays[0], this.arrays[0]])}
    get uv(): UV2D {return new UV2D(this.id, [this.arrays[0], this.arrays[1]])}
    get uw(): UV2D {return new UV2D(this.id, [this.arrays[0], this.arrays[2]])}

    get vu(): UV2D {return new UV2D(this.id, [this.arrays[1], this.arrays[0]])}
    get vv(): UV2D {return new UV2D(this.id, [this.arrays[1], this.arrays[1]])}
    get vw(): UV2D {return new UV2D(this.id, [this.arrays[1], this.arrays[2]])}

    get wu(): UV2D {return new UV2D(this.id, [this.arrays[2], this.arrays[0]])}
    get wv(): UV2D {return new UV2D(this.id, [this.arrays[2], this.arrays[1]])}
    get ww(): UV2D {return new UV2D(this.id, [this.arrays[2], this.arrays[2]])}

    get uuu(): UV3D {return new UV3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get uuv(): UV3D {return new UV3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get uuw(): UV3D {return new UV3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get uvu(): UV3D {return new UV3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get uvv(): UV3D {return new UV3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get uvw(): UV3D {return new UV3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get ubu(): UV3D {return new UV3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get ubv(): UV3D {return new UV3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get ubw(): UV3D {return new UV3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get vuu(): UV3D {return new UV3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get vuv(): UV3D {return new UV3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get vuw(): UV3D {return new UV3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get vvu(): UV3D {return new UV3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get vvv(): UV3D {return new UV3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get vvw(): UV3D {return new UV3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get vbu(): UV3D {return new UV3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get vbv(): UV3D {return new UV3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get vbw(): UV3D {return new UV3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get wuu(): UV3D {return new UV3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get wuv(): UV3D {return new UV3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get wuw(): UV3D {return new UV3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get wvu(): UV3D {return new UV3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get wvv(): UV3D {return new UV3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get wvw(): UV3D {return new UV3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get wbu(): UV3D {return new UV3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get wbv(): UV3D {return new UV3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get wbw(): UV3D {return new UV3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set uv(other: UV2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set uw(other: UV2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set vu(other: UV2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set vw(other: UV2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set wu(other: UV2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set wv(other: UV2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set uvw(other: UV3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set ubv(other: UV3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set vuw(other: UV3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set vbu(other: UV3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set wuv(other: UV3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set wvu(other: UV3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export const uv = (
    u: number = 0,
    v: number = u
): UV2D => new UV2D().setTo(u, v);

export const uvw = (
    u: number = 0,
    v: number = u,
    w: number = u
): UV3D => new UV3D().setTo(u, v, w);
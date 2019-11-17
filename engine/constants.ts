export const PRECISION_DIGITS = 3;

export const FLOAT_BITS = 32;
export const FLOAT_BYTES = FLOAT_BITS / 8;

export const CACHE_LINE_BYTES = 64;
export const CACHE_LINE_SIZE = CACHE_LINE_BYTES / FLOAT_BYTES;
// export const TEMP_STORAGE_SIZE = CACHE_LINE_SIZE * 4;

export const enum FACE_VERTEX_NUMBER {
    _1,
    _2,
    _3,
}

export const enum FACE_TYPE {
    TRIANGLE = 3,
    QUAD,
}

export const enum DIM {
    _1D = 1,
    _2D = 2,
    _3D = 3,
    _4D = 4,
    _9D = 9,
    _16D = 16,
}

export const enum ATTRIBUTE {
    position = 0b0001,
    normal   = 0b0010,
    color    = 0b0100,
    uv       = 0b1000,
}
export const enum SHARE {
    POSITION = 0b0001,
    NORMAL   = 0b0010,
    COLOR    = 0b0100,
    UV       = 0b1000,
}

export const enum NORMAL_SOURCING {
    NO_VERTEX__NO_FACE,
    NO_VERTEX__GENERATE_FACE,
    LOAD_VERTEX__NO_FACE,
    LOAD_VERTEX__GENERATE_FACE,
    GATHER_VERTEX__GENERATE_FACE
}

export const enum COLOR_SOURCING {
    NO_VERTEX__NO_FACE,
    NO_VERTEX__GENERATE_FACE,
    LOAD_VERTEX__NO_FACE,
    LOAD_VERTEX__GATHER_FACE,
    LOAD_VERTEX__GENERATE_FACE,
    GENERATE_VERTEX__NO_FACE,
    GENERATE_VERTEX__GATHER_FACE,
    GENERATE_VERTEX__GENERATE_FACE,
    GATHER_VERTEX__GENERATE_FACE
}
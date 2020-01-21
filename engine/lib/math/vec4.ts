const sqrt = Math.sqrt;
const PRECISION_DIGITS = 3;
let t_x,
    t_y,
    t_z,
    t_w,
    t_n: number;


export const set_the_components_of_a_4D_vector = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    x: number,
    y: number,
    z: number,
    w: number
): void => {
    Xa[a] = x;
    Ya[a] = y;
    Za[a] = z;
    Wa[a] = w;
};

export const set_all_components_of_a_4D_vector_to_a_number = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    value: number
): void => {
    Xa[a] = Ya[a] = Za[a] = Wa[a] = value;
};

export const set_a_4D_vector_from_another_4D_vector = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
): void => {
    Xa[a] = Xo[o];
    Ya[a] = Yo[o];
    Za[a] = Zo[o];
    Wa[a] = Wo[o];
};

export const check_if_two_4D_vectros_are_equal = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array
) : boolean =>
    Xa[a].toFixed(PRECISION_DIGITS) ===
    Xb[b].toFixed(PRECISION_DIGITS) &&

    Ya[a].toFixed(PRECISION_DIGITS) ===
    Yb[b].toFixed(PRECISION_DIGITS) &&

    Za[a].toFixed(PRECISION_DIGITS) ===
    Zb[b].toFixed(PRECISION_DIGITS) &&

    Wa[a].toFixed(PRECISION_DIGITS) ===
    Wb[b].toFixed(PRECISION_DIGITS);

export const negate_a_4D_direction_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
): void => {
    Xo[o] = -Xa[a];
    Yo[o] = -Ya[a];
    Zo[o] = -Za[a];
    Wo[o] = -Wa[a];
};

export const negate_a_4D_direction_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array
): void => {
    Xa[a] = -Xa[a];
    Ya[a] = -Ya[a];
    Za[a] = -Za[a];
    Wa[a] = -Wa[a];
};

export const compute_the_length_of_a_4D_direction = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array
) : number => sqrt((
    Xa[a] ** 2 +
    Ya[a] ** 2 +
    Za[a] ** 2 +
    Wa[a] ** 2
));

export const compute_the_distance_from_a_4D_position_to_another_4D_position = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array
) : number => sqrt((
    (Xb[b] - Xa[a]) ** 2 +
    (Yb[b] - Ya[a]) ** 2 +
    (Zb[b] - Za[a]) ** 2 +
    (Wb[b] - Wa[a]) ** 2
));

export const square_the_length_of_a_4D_direction = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array
) : number =>
    Xa[a] ** 2 +
    Ya[a] ** 2 +
    Za[a] ** 2 +
    Wa[a] ** 2;

export const square_the_distance_from_a_4D_positions_to_another_4D_position = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array
) : number => (
    (Xb[b] - Xa[a]) ** 2 +
    (Yb[b] - Ya[a]) ** 2 +
    (Zb[b] - Za[a]) ** 2 +
    (Wb[b] - Wa[a]) ** 2
);

export const linearly_interpolate_from_a_4D_vector_to_another_4D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array,

    t: number,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array,
) : void => {
    Xo[o] = (1-t)*Xa[a] + t*(Xb[b]);
    Yo[o] = (1-t)*Ya[a] + t*(Yb[b]);
    Zo[o] = (1-t)*Za[a] + t*(Zb[b]);
    Wo[o] = (1-t)*Wa[a] + t*(Wb[b]);
};

export const add_a_4D_vector_to_another_4D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    Xo[o] = Xa[a] + Xb[b];
    Yo[o] = Ya[a] + Yb[b];
    Zo[o] = Za[a] + Zb[b];
    Wo[o] = Wa[a] + Wb[b];
};

export const add_a_4D_vector_to_another_4D_vector_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array
) : void => {
    Xa[a] += Xb[b];
    Ya[a] += Yb[b];
    Za[a] += Zb[b];
    Wa[a] += Wb[b];
};

export const add_a_number_to_a_4D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    Xo[o] = Xa[a] + b;
    Yo[o] = Ya[a] + b;
    Zo[o] = Za[a] + b;
    Wo[o] = Wa[a] + b;
};

export const add_a_number_to_a_4D_vector_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number
) : void => {
    Xa[a] += b;
    Ya[a] += b;
    Za[a] += b;
    Wa[a] += b;
};

export const subtract_a_4D_vector_from_another_4D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    Xo[o] = Xa[a] - Xb[b];
    Yo[o] = Ya[a] - Yb[b];
    Zo[o] = Za[a] - Zb[b];
    Wo[o] = Wa[a] - Wb[b];
};

export const subtract_a_4D_vector_from_another_4D_vector_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array
) : void => {
    Xa[a] -= Xb[b];
    Ya[a] -= Yb[b];
    Za[a] -= Zb[b];
    Wa[a] -= Wb[b];
};

export const subtract_a_number_from_a_4D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    Xo[o] = Xa[a] - b;
    Yo[o] = Ya[a] - b;
    Zo[o] = Za[a] - b;
    Wo[o] = Wa[a] - b;
};

export const subtract_a_number_from_a_4D_vector_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number
) : void => {
    Xa[a] -= b;
    Ya[a] -= b;
    Za[a] -= b;
    Wa[a] -= b;
};

export const multiply_a_4D_vector_by_another_4D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    Xo[o] = Xa[a] * Xb[b];
    Yo[o] = Ya[a] * Yb[b];
    Zo[o] = Za[a] * Zb[b];
    Wo[o] = Wa[a] * Wb[b];
};

export const multiply_a_4D_vector_by_another_4D_vector_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array
) : void => {
    Xa[a] *= Xb[b];
    Ya[a] *= Yb[b];
    Za[a] *= Zb[b];
    Wa[a] *= Wb[b];
};

export const divide_a_4D_vector_by_a_number_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    Xo[o] = Xa[a] / b;
    Yo[o] = Ya[a] / b;
    Zo[o] = Za[a] / b;
    Wo[o] = Wa[a] / b;
};

export const divide_a_4D_vector_by_a_number_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number
) : void => {
    Xa[a] /= b;
    Ya[a] /= b;
    Za[a] /= b;
    Wa[a] /= b;
};

export const multiply_a_4D_vector_by_a_number_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    Xo[o] = Xa[a] * b;
    Yo[o] = Ya[a] * b;
    Zo[o] = Za[a] * b;
    Wo[o] = Wa[a] * b;
};

export const multiply_a_4D_vector_by_a_number_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number
) : void => {
    Xa[a] *= b;
    Ya[a] *= b;
    Za[a] *= b;
    Wa[a] *= b;
};

export const normalize_a_4D_direction_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    t_n = Xa[a]**2 + Ya[a]**2 + Za[a]**2 + Wa[a]**2;
    if (t_n === 1)
        return;

    t_n = 1 / sqrt(t_n);

    Xo[o] = Xa[a] * t_n;
    Yo[o] = Ya[a] * t_n;
    Zo[o] = Za[a] * t_n;
    Wo[o] = Wa[a] * t_n;
};

export const normalize_a_4D_direction_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array
) : void => {
    t_n = Xa[a]**2 + Ya[a]**2 + Za[a]**2 + Wa[a]**2;
    if (t_n === 1)
        return;

    t_n = 1 / sqrt(t_n);

    Xa[a] *= t_n;
    Ya[a] *= t_n;
    Za[a] *= t_n;
    Wa[a] *= t_n;
};

export const normalize_all_4D_directions_in_place = (
    X: Float32Array,
    Y: Float32Array,
    Z: Float32Array,
    W: Float32Array
) : void => {
    for (let i = 0; i < X.length; i++) {
        t_n = X[i]**2 + Y[i]**2 + Z[i]**2 + W[i]**2;
        if (t_n === 1)
            continue;

        t_n = 1 / sqrt(t_n);

        X[i] *= t_n;
        Y[i] *= t_n;
        Z[i] *= t_n;
        W[i] *= t_n;
    }
};

export const normalize_some_4D_directions_in_place = (
    X: Float32Array,
    Y: Float32Array,
    Z: Float32Array,
    W: Float32Array,

    include: Uint8Array
) : void => {
    for (let i = 0; i < X.length; i++) if (include[i]) {
        t_n = X[i]**2 + Y[i]**2 + Z[i]**2 + W[i]**2;
        if (t_n === 1)
            continue;

        t_n = 1 / sqrt(t_n);

        X[i] *= t_n;
        Y[i] *= t_n;
        Z[i] *= t_n;
        W[i] *= t_n;
    }
};

export const dot_a_4D_direction_with_another_4D_direction = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array
) : number =>
    Xa[a] * Xb[b] +
    Ya[a] * Yb[b] +
    Za[a] * Zb[b] +
    Wa[a] * Wb[b];

export const reflect_a_4D_vector_around_a_4D_direction_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
): void => {
    t_n = Xa[a] * Xb[b] +
        Ya[a] * Yb[b] +
        Za[a] * Zb[b] +
        Wa[a] * Wb[b];
    t_n += t_n;

    Xo[o] = Xb[b] * t_n - Xa[a];
    Yo[o] = Yb[b] * t_n - Ya[a];
    Zo[o] = Zb[b] * t_n - Za[a];
    Wo[o] = Wb[b] * t_n - Wa[a];
};

export const reflect_a_4D_vector_around_a_4D_direction_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
    Zb: Float32Array,
    Wb: Float32Array
): void => {
    t_n = Xa[a] * Xb[b] +
        Ya[a] * Yb[b] +
        Za[a] * Zb[b] +
        Wa[a] * Wb[b];
    t_n += t_n;

    Xa[a] = Xb[b] * t_n - Xa[a];
    Ya[a] = Yb[b] * t_n - Ya[a];
    Za[a] = Zb[b] * t_n - Za[a];
    Wa[a] = Wb[b] * t_n - Wa[a];
};

export const multiply_a_4D_vector_by_a_4x4_matrix_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    m: number,
    M11: Float32Array, M12: Float32Array, M13: Float32Array, M14: Float32Array,
    M21: Float32Array, M22: Float32Array, M23: Float32Array, M24: Float32Array,
    M31: Float32Array, M32: Float32Array, M33: Float32Array, M34: Float32Array,
    M41: Float32Array, M42: Float32Array, M43: Float32Array, M44: Float32Array
) : void => {
    t_x = Xa[a];
    t_y = Ya[a];
    t_z = Za[a];
    t_w = Wa[a];

    Xa[a] = t_x*M11[m] + t_y*M21[m] + t_z*M31[m] + t_w*M41[m];
    Ya[a] = t_x*M12[m] + t_y*M22[m] + t_z*M32[m] + t_w*M42[m];
    Za[a] = t_x*M13[m] + t_y*M23[m] + t_z*M33[m] + t_w*M43[m];
    Wa[a] = t_x*M14[m] + t_y*M24[m] + t_z*M34[m] + t_w*M44[m];
};

export const multiply_a_4D_vector_by_a_4x4_matrix_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    m: number,
    M11: Float32Array, M12: Float32Array, M13: Float32Array, M14: Float32Array,
    M21: Float32Array, M22: Float32Array, M23: Float32Array, M24: Float32Array,
    M31: Float32Array, M32: Float32Array, M33: Float32Array, M34: Float32Array,
    M41: Float32Array, M42: Float32Array, M43: Float32Array, M44: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    Xo[o] = Xa[a]*M11[m] + Ya[a]*M21[m] + Za[a]*M31[m] + Wa[a]*M41[m];
    Yo[o] = Xa[a]*M12[m] + Ya[a]*M22[m] + Za[a]*M32[m] + Wa[a]*M42[m];
    Zo[o] = Xa[a]*M13[m] + Ya[a]*M23[m] + Za[a]*M33[m] + Wa[a]*M43[m];
    Wo[o] = Xa[a]*M14[m] + Ya[a]*M24[m] + Za[a]*M34[m] + Wa[a]*M44[m];
};

export const multiply_all_4D_vectors_by_a_4x4_matrix_to_out = (
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    m: number,
    M11: Float32Array, M12: Float32Array, M13: Float32Array, M14: Float32Array,
    M21: Float32Array, M22: Float32Array, M23: Float32Array, M24: Float32Array,
    M31: Float32Array, M32: Float32Array, M33: Float32Array, M34: Float32Array,
    M41: Float32Array, M42: Float32Array, M43: Float32Array, M44: Float32Array,

    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    for (let i = 0; i < Xa.length; i++) {
        Xo[i] = Xa[i]*M11[m] + Ya[i]*M21[m] + Za[i]*M31[m] + Wa[i]*M41[m];
        Yo[i] = Xa[i]*M12[m] + Ya[i]*M22[m] + Za[i]*M32[m] + Wa[i]*M42[m];
        Zo[i] = Xa[i]*M13[m] + Ya[i]*M23[m] + Za[i]*M33[m] + Wa[i]*M43[m];
        Wo[i] = Xa[i]*M14[m] + Ya[i]*M24[m] + Za[i]*M34[m] + Wa[i]*M44[m];
    }
};

export const multiply_some_4D_vectors_by_a_4x4_matrix_to_out = (
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    include: Uint8Array,

    m: number,
    M11: Float32Array, M12: Float32Array, M13: Float32Array, M14: Float32Array,
    M21: Float32Array, M22: Float32Array, M23: Float32Array, M24: Float32Array,
    M31: Float32Array, M32: Float32Array, M33: Float32Array, M34: Float32Array,
    M41: Float32Array, M42: Float32Array, M43: Float32Array, M44: Float32Array,

    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array
) : void => {
    for (let i = 0; i < Xa.length; i++) if (include[i]){
        Xo[i] = Xa[i]*M11[m] + Ya[i]*M21[m] + Za[i]*M31[m] + Wa[i]*M41[m];
        Yo[i] = Xa[i]*M12[m] + Ya[i]*M22[m] + Za[i]*M32[m] + Wa[i]*M42[m];
        Zo[i] = Xa[i]*M13[m] + Ya[i]*M23[m] + Za[i]*M33[m] + Wa[i]*M43[m];
        Wo[i] = Xa[i]*M14[m] + Ya[i]*M24[m] + Za[i]*M34[m] + Wa[i]*M44[m];
    }
};

export const multiply_all_4D_vectors_by_a_4x4_matrix_in_place = (
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    m: number,
    M11: Float32Array, M12: Float32Array, M13: Float32Array, M14: Float32Array,
    M21: Float32Array, M22: Float32Array, M23: Float32Array, M24: Float32Array,
    M31: Float32Array, M32: Float32Array, M33: Float32Array, M34: Float32Array,
    M41: Float32Array, M42: Float32Array, M43: Float32Array, M44: Float32Array
) : void => {
    for (let i = 0; i < Xa.length; i++) {
        t_x = Xa[i];
        t_y = Ya[i];
        t_z = Za[i];
        t_w = Wa[i];

        Xa[i] = t_x*M11[m] + t_y*M21[m] + t_z*M31[m] + t_w*M41[m];
        Ya[i] = t_x*M12[m] + t_y*M22[m] + t_z*M32[m] + t_w*M42[m];
        Za[i] = t_x*M13[m] + t_y*M23[m] + t_z*M33[m] + t_w*M43[m];
        Wa[i] = t_x*M14[m] + t_y*M24[m] + t_z*M34[m] + t_w*M44[m];
    }
};

export const multiply_some_4D_vectors_by_a_4x4_matrix_in_place = (
    Xa: Float32Array,
    Ya: Float32Array,
    Za: Float32Array,
    Wa: Float32Array,

    include: Uint8Array,

    m: number,
    M11: Float32Array, M12: Float32Array, M13: Float32Array, M14: Float32Array,
    M21: Float32Array, M22: Float32Array, M23: Float32Array, M24: Float32Array,
    M31: Float32Array, M32: Float32Array, M33: Float32Array, M34: Float32Array,
    M41: Float32Array, M42: Float32Array, M43: Float32Array, M44: Float32Array
) : void => {
    for (let i = 0; i < Xa.length; i++) if (include[i]) {
        t_x = Xa[i];
        t_y = Ya[i];
        t_z = Za[i];
        t_w = Wa[i];

        Xa[i] = t_x*M11[m] + t_y*M21[m] + t_z*M31[m] + t_w*M41[m];
        Ya[i] = t_x*M12[m] + t_y*M22[m] + t_z*M32[m] + t_w*M42[m];
        Za[i] = t_x*M13[m] + t_y*M23[m] + t_z*M33[m] + t_w*M43[m];
        Wa[i] = t_x*M14[m] + t_y*M24[m] + t_z*M34[m] + t_w*M44[m];
    }
};
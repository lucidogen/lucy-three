uniform float lucy_aspect;
uniform float lucy_song;
uniform float lucy_time;

// Texture coordinates  line
varying vec2 vuv_00; //  0 | x  0  0  |
varying vec2 vuv_01; //  0 | 0  x  0  |
varying vec2 vuv_02; //  0 | 0  0  x  |
varying vec2 vuv_10; //  1 | x  0  0  |
varying vec2 vuv_11; //  1 | 0  x  0  |
varying vec2 vuv_12; //  1 | 0  0  x  |
varying vec2 vuv_20; //  2 | x  0  0  |
varying vec2 vuv_21; //  2 | 0  x  0  |
varying vec2 vuv_22; //  2 | 0  0  x  |
varying vec2 vuv;

const float DX = 0.002;
const float DY = 0.002;

void main() {
  vuv = uv;
  vuv_00 = uv + vec2(-DX, -DY);
  vuv_01 = uv + vec2( 0., -DY);
  vuv_02 = uv + vec2(+DX, -DY);
  vuv_10 = uv + vec2(-DX,  0.);
  vuv_11 = uv + vec2( 0.,  0.);
  vuv_12 = uv + vec2(+DX,  0.);
  vuv_20 = uv + vec2(-DX, +DY);
  vuv_21 = uv + vec2( 0., +DY);
  vuv_22 = uv + vec2(+DX, +DY);
  // pixel = uv - 0.5;

  // // This is to keep pixels square
  // // if we change < for >, we crop space instead of extending
  // if (lucy_aspect < 1.) {
  //   pixel.y = pixel.y / lucy_aspect;
  // } else {
  //   pixel.x = pixel.x * lucy_aspect;
  // }

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}


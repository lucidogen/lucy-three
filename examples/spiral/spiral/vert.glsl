varying vec2 vuv;
uniform float lucy_aspect;
uniform float fx_zoom;
void main() {
  vuv = (uv - vec2(0.5));
  // This is to keep pixels square
  // if we change < for >, we crop space instead of extending
  if (lucy_aspect < 1.) {
    vuv.y = vuv.y / lucy_aspect;
  } else {
    vuv.x = vuv.x * lucy_aspect;
  }
  vuv = (0.2 + 4.*fx_zoom) * vuv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

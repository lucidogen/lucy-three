uniform float lucy_aspect;
uniform float lucy_song;
uniform float lucy_time;

varying vec2 vuv;

void main() {
  vuv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}



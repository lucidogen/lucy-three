#define Pi 3.1415926535897932384626433832795

float steps(float v, float width, float steps) {
  float s = v / width;
  float r = s - floor(s);
  return floor(r * steps) / steps;
}

float ramp(float v, float width) {
  float s = v / width;
  return s - floor(s);
}

float norm(vec2 v) {
  return sqrt(v.x*v.x + v.y*v.y);
}

uniform float lucy_time;
uniform float lucy_song;
uniform float fx_smooth;
uniform float fx_beat;
uniform sampler2D tLast;
uniform sampler2D tDiffuse;

varying vec2 vuv;

void main() {
  float song = (lucy_song) * 2. * Pi;
  vec4 px  = texture2D(tDiffuse, vuv);
  vec2 offset = vec2(sin(song/2.), sin(Pi/2. + song)) * 0.009 * fx_beat;
  vec4 old = texture2D(tLast, vec2(0.5) + 0.99 * (vuv - vec2(0.5) + offset));

  float m = 0.97 * fx_smooth;
  // gradually fade to black
  

  old = max(vec4(0.), old + vec4(0.0001));
  vec4 color = (1.05-m) * px * 1. + (m + 0.00 + 0.00 * sin(song*1.)) * old;
  // dimensionality curse with 3D ? length is shit: always lingering on 
  // exteriors (near 0. or 1.).
  // float len = max(color.r, max(color.g, color.b));
  // // why is old color so white ?
  // if (len < 0.07) {
  //   color = vec4(0.);
  // }
  
  //color = px + len*old;
  // vec4 color =  px + sin(old*.4);
  // if (color.r < 0.2) {
  //   color = vec4(0.,0.,0.,1.);
  // }
  gl_FragColor = 1.0 * vec4(color.rgb, 1.);
  //gl_FragColor = max(color, px * 0.8);//(1.-m) * px + m * old;
}





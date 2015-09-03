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
uniform float fx_mix;  // fade to black
uniform float fx_beat;
uniform sampler2D tDiffuse;

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

// edge detection
// Y convolution
//      | -1 -2 -1 |
//      |  0  0  0 |
//      |  1  2  1 |

// X convolution
//      | -1  0  1 |
//      | -2  0  2 |
//      | -1  0  1 |

void main() {
  float beat = 1. - ramp(lucy_song, 1.) * fx_beat;
  vec4 px_00 = texture2D(tDiffuse, vuv_00); //  0 | x  0  0  |
  vec4 px_01 = texture2D(tDiffuse, vuv_01); //  0 | 0  x  0  |
  vec4 px_02 = texture2D(tDiffuse, vuv_02); //  0 | 0  0  x  |
  vec4 px_10 = texture2D(tDiffuse, vuv_10); //  1 | x  0  0  |
  vec4 px_11 = texture2D(tDiffuse, vuv_11); //  1 | 0  x  0  |
  vec4 px_12 = texture2D(tDiffuse, vuv_12); //  1 | 0  0  x  |
  vec4 px_20 = texture2D(tDiffuse, vuv_20); //  2 | x  0  0  |
  vec4 px_21 = texture2D(tDiffuse, vuv_21); //  2 | 0  x  0  |
  vec4 px_22 = texture2D(tDiffuse, vuv_22); //  2 | 0  0  x  |

  vec4 convy = -1. * px_00 -2. * px_01 -1. * px_02
           //   0. * px_10 +0. * px_11 +0. * px_12                                    
               +1. * px_20 +2. * px_21 +1. * px_22;

  vec4 convx = -1. * px_00             +1. * px_02
               -2. * px_10             +2. * px_22
               -1. * px_20             +1. * px_22;

  vec2 conv = vec2(length(convx), length(convy));
  float c = length(conv);
  c = min(c, beat);
  gl_FragColor = fx_mix * vec4(2. * px_11.rgb * c, 1.);
}




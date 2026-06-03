/**
 * avatarShader — point-cloud "Neural Entity" face.
 *
 * Renders a head sampled into glowing additive points. The look is tuned to stay
 * delicate: small soft points with low per-point alpha so dense (front-facing)
 * regions read as fine structure rather than a blown-out white blob. A global
 * `uIntensity` controls overall luminance.
 *
 * Phase 0 proves the pipeline with a PROCEDURAL jaw: each vertex carries
 * `aJawWeight` (how much it belongs to the lower jaw) and is rotated around a
 * hinge by `uJawOpen`. Later this is replaced by real ARKit/Viseme morph targets
 * — the driver (uJawOpen → blendshape weights) stays the same.
 */

export const avatarVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uJawOpen;      // 0 = closed, 1 = fully open
  uniform float uJawMaxAngle;  // radians at uJawOpen = 1
  uniform vec3  uJawHinge;     // pivot (model space)
  uniform float uBreath;       // subtle idle breathing amplitude
  uniform float uPointScale;   // global point-size multiplier

  attribute float aSize;
  attribute float aPhase;
  attribute float aJawWeight;  // 0..1

  varying float vAlpha;
  varying float vJaw;

  void main() {
    vec3 pos = position;

    // ── Procedural jaw: rotate lower-face points around the hinge (pitch) ──
    if (aJawWeight > 0.001) {
      float ang = uJawOpen * uJawMaxAngle * aJawWeight;
      vec3 p = pos - uJawHinge;
      float c = cos(ang);
      float s = sin(ang);
      p.yz = mat2(c, s, -s, c) * p.yz; // drop the chin
      pos = uJawHinge + p;
    }

    // ── Idle breathing: tiny uniform scale pulse ──
    pos *= 1.0 + sin(uTime * 1.4) * uBreath;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Small points; gentle per-point twinkle. Hard-clamped so near points don't bloom.
    float twinkle = 0.9 + 0.1 * sin(uTime * 2.5 + aPhase * 6.283);
    float size = aSize * twinkle * uPointScale * (115.0 / -mvPosition.z) * uPixelRatio;
    gl_PointSize = clamp(size, 0.8, 3.2 * uPixelRatio);

    // Depth fade so the back of the head reads softer (less additive pile-up)
    float zFade = clamp((-mvPosition.z - 4.0) / 16.0, 0.0, 1.0);
    vAlpha = mix(0.8, 0.22, zFade);
    vJaw = aJawWeight;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const avatarFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;     // highlight toward this on the moving jaw
  uniform float uIntensity; // global luminance control
  varying float vAlpha;
  varying float vJaw;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Soft round falloff — small bright center, long gentle halo.
    float core = 1.0 - smoothstep(0.0, 0.10, dist);
    float glow = pow(1.0 - smoothstep(0.0, 0.5, dist), 2.2);

    // Jaw/mouth region tints toward the accent so speech motion stays legible.
    vec3 color = mix(uColor, uAccent, vJaw * 0.35);
    // Keep the color (additive piles toward bright CYAN, not white). Only a hint
    // of white at the very center so points still read as little light sources.
    color += core * 0.08;

    float alpha = (core * 0.6 + glow * 0.4) * vAlpha * uIntensity;
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * avatarShader — point-cloud "Neural Entity" face.
 *
 * Renders a head sampled into glowing additive points (matches the holographic
 * aesthetic of ParticleMorphField / NeuralParticleField). Phase 0 proves the
 * pipeline with a PROCEDURAL jaw: each vertex carries `aJawWeight` (how much it
 * belongs to the lower jaw) and is rotated around a hinge by `uJawOpen`. In a
 * later phase this is replaced by real ARKit/Viseme morph targets — the driver
 * (uJawOpen → blendshape weights) stays the same.
 */

export const avatarVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uJawOpen;      // 0 = closed, 1 = fully open
  uniform float uJawMaxAngle;  // radians at uJawOpen = 1
  uniform vec3  uJawHinge;     // pivot (model space)
  uniform float uBreath;       // subtle idle breathing amplitude

  attribute float aSize;
  attribute float aPhase;
  attribute float aJawWeight;  // 0..1

  varying float vAlpha;
  varying float vJaw;

  void main() {
    vec3 pos = position;

    // ── Procedural jaw: rotate lower-face points around the hinge (pitch/X) ──
    if (aJawWeight > 0.001) {
      float ang = uJawOpen * uJawMaxAngle * aJawWeight;
      vec3 p = pos - uJawHinge;
      float c = cos(ang);
      float s = sin(ang);
      // rotate in Y-Z plane so the chin drops & comes forward
      p.yz = mat2(c, s, -s, c) * p.yz;
      pos = uJawHinge + p;
    }

    // ── Idle breathing: tiny uniform scale pulse ──
    pos *= 1.0 + sin(uTime * 1.4) * uBreath;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size with perspective attenuation; flicker a touch by phase for life
    float twinkle = 0.85 + 0.15 * sin(uTime * 3.0 + aPhase * 6.283);
    gl_PointSize = aSize * twinkle * (220.0 / -mvPosition.z) * uPixelRatio;

    // Depth fade so the back of the head reads softer
    float zFade = clamp((-mvPosition.z - 4.0) / 18.0, 0.0, 1.0);
    vAlpha = mix(0.9, 0.35, zFade);
    vJaw = aJawWeight;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const avatarFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;   // highlight toward this on the moving jaw
  varying float vAlpha;
  varying float vJaw;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.14, dist);
    float glow = pow(1.0 - smoothstep(0.0, 0.5, dist), 1.8);

    // Jaw/mouth region tints toward the accent so speech motion is legible
    vec3 color = mix(uColor, uAccent, vJaw * 0.5);
    color = mix(color, vec3(1.0), core * 0.4);

    float alpha = (core * 0.85 + glow * 0.5) * vAlpha;
    gl_FragColor = vec4(color, alpha);
  }
`;

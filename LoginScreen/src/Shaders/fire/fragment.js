export default /*glsl*/`
uniform float time;
uniform sampler2D noiseTexture;
uniform sampler2D alphaTexture;
uniform sampler2D gradientTexture;

varying vec2 vUv;

void main()  {
  float distortion = texture2D(noiseTexture, vec2(vUv.x, time * 0.1)).r; // increase the speed of distortion
  
  vec2 noiseCoords = mod(vUv + vec2(time * 0.1 + distortion * 0.2 + sin(time * 0.2) * 0.1), 1.0); // increased distortion and noise speed

  float noise = texture2D(noiseTexture, noiseCoords).r;
  float fireIntensity = smoothstep(0.2, 1.0, noise + (1.0 - vUv.y)); // Lowered smoothstep lower limit to increase fire range

  vec3 rockColor = vec3(1.0, 0.5, 0.0); // Adjusted rockColor for more orange-like color
  vec3 fireColor = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 0.5, 0.0), noise); // Changed mix colors for a more fiery look

  vec4 color = vec4(mix(rockColor, fireColor, fireIntensity), 1.0);

  float alpha = texture2D(alphaTexture, vec2(vUv.x, 1.0 - vUv.y)).r;
  if (alpha < 0.5) {
    discard;
  }
  
  // Glow effect
  vec4 glow = vec4(color.rgb * fireIntensity, color.a);
  float glowIntensity = 0.2; // increased glowIntensity for a more vivid glow
  color = mix(color, glow, glowIntensity);

  gl_FragColor = color;
}

`;

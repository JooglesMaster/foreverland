export default /*glsl*/`
uniform float time;
uniform sampler2D gradientTexture;
varying vec2 vUv;

void main()  {
  vUv = uv;
  vec3 pos = position;
  pos.x += sin(time + pos.y) * 0.2; // Increase the distortion effect

  // Use gradient texture to modify y position
  vec2 gradientUV = vec2(0.55, 0.5 + sin(time *2.0) * 0.3); // increase the range of sin(time)
  float scale = texture2D(gradientTexture, gradientUV).r;

  // Scale y-position based on the current y-position and the gradient scale
  pos.y += scale * pos.y * 2.0; // increase the scale effect

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

`;

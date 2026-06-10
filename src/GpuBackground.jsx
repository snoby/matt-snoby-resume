import { useEffect, useRef } from 'react'

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  if (!vertexShader || !fragmentShader) return null

  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  return program
}

export default function GpuBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    })
    if (!gl) return undefined

    const vertexSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const fragmentSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash(i + vec2(0.0, 0.0));
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        mat2 rotate = mat2(0.8, -0.6, 0.6, 0.8);
        for (int i = 0; i < 3; i++) {
          value += amplitude * noise(p);
          p = rotate * p * 2.02 + 14.31;
          amplitude *= 0.5;
        }
        return value;
      }

      float softGrid(float axis, float drift, float count, float widthPx) {
        float cell = abs(fract((axis + drift) * count) - 0.5);
        float pixel = widthPx / min(u_resolution.x, u_resolution.y);
        return 1.0 - smoothstep(0.0, pixel, cell);
      }

      float pearl(vec2 p, vec2 center, float radius, float glow) {
        float d = length(p - center);
        float shell = 1.0 - smoothstep(radius * 0.72, radius, d);
        float halo = exp(-d * glow) * 0.22;
        return shell + halo;
      }

      vec3 pearlColor(float light) {
        vec3 ice = vec3(0.72, 0.94, 1.0);
        vec3 rose = vec3(1.0, 0.62, 0.84);
        vec3 gold = vec3(1.0, 0.78, 0.48);
        return mix(mix(ice, rose, smoothstep(0.25, 0.75, light)), gold, smoothstep(0.72, 1.0, light) * 0.42);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0) * 2.0;

        float t = u_time * 0.08;
        float deep = fbm(p * 1.02 + vec2(t * 0.6, -t * 0.35));
        float current = fbm(p * 1.85 + vec2(-t * 1.2, t * 0.8));
        float ribbonA = smoothstep(0.56, 0.82, sin(p.x * 2.25 - p.y * 0.95 + current * 2.8 + u_time * 0.22) * 0.5 + 0.5);
        float ribbonB = smoothstep(0.62, 0.92, sin(p.x * -1.55 + p.y * 2.45 + deep * 3.35 - u_time * 0.18) * 0.5 + 0.5);

        vec3 abyss = vec3(0.006, 0.015, 0.032);
        vec3 blueGlass = vec3(0.04, 0.15, 0.22);
        vec3 teal = vec3(0.05, 0.42, 0.46);
        vec3 smoke = vec3(0.38, 0.48, 0.58);
        vec3 color = mix(abyss, blueGlass, smoothstep(0.1, 1.0, deep));
        color += teal * ribbonA * 0.16;
        color += smoke * ribbonB * 0.11;

        float grid = softGrid(uv.x, current * 0.01, 16.0, 10.0) * 0.018;
        grid += softGrid(uv.y, -deep * 0.012, 10.0, 9.0) * 0.014;
        color += vec3(0.26, 0.82, 0.88) * grid;

        float pearls = 0.0;
        for (int i = 0; i < 14; i++) {
          float fi = float(i);
          vec2 seed = vec2(hash(vec2(fi, 2.4)), hash(vec2(8.1, fi)));
          vec2 center = seed * 2.25 - 1.125;
          center.x *= u_resolution.x / u_resolution.y;
          center += vec2(sin(u_time * (0.09 + seed.x * 0.08) + fi) * 0.06, cos(u_time * (0.07 + seed.y * 0.06) + fi * 1.7) * 0.045);
          float radius = mix(0.008, 0.028, hash(seed + 5.0));
          float twinkle = 0.55 + 0.45 * sin(u_time * (0.55 + seed.x) + fi * 2.7);
          pearls += pearl(p, center, radius, mix(14.0, 28.0, seed.y)) * twinkle;
        }

        vec3 pearlGlow = pearlColor(fract(pearls + deep)) * pearls * 0.28;
        color += pearlGlow;

        vec2 upperRight = p - vec2(0.78 * u_resolution.x / u_resolution.y, 0.72);
        vec2 lowerLeft = p - vec2(-0.86 * u_resolution.x / u_resolution.y, -0.72);
        float cornerGlow = exp(-dot(upperRight, upperRight) * 2.2) + exp(-dot(lowerLeft, lowerLeft) * 2.0);
        color += pearlColor(current) * cornerGlow * 0.13;

        float vignette = smoothstep(1.62, 0.22, length(p));
        color *= 0.58 + vignette * 0.62;
        color += (hash(gl_FragCoord.xy) - 0.5) * 0.006;

        gl_FragColor = vec4(color, 0.82);
      }
    `

    const program = createProgram(gl, vertexSource, fragmentSource)
    if (!program) return undefined

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const timeLocation = gl.getUniformLocation(program, 'u_time')

    const resize = () => {
      const deviceScale = window.devicePixelRatio || 1
      const dpr = Math.min(deviceScale, 1.25)
      const renderScale = deviceScale > 1 ? 0.72 : 0.85
      const width = Math.floor(window.innerWidth * dpr)
      const height = Math.floor(window.innerHeight * dpr)
      const scaledWidth = Math.max(1, Math.floor(width * renderScale))
      const scaledHeight = Math.max(1, Math.floor(height * renderScale))
      if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
        canvas.width = scaledWidth
        canvas.height = scaledHeight
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    let raf = 0
    const start = performance.now()
    let lastFrameTime = 0

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const render = (now = performance.now()) => {
      if (!reduceMotion && document.visibilityState !== 'visible') {
        raf = requestAnimationFrame(render)
        return
      }

      if (!reduceMotion && now - lastFrameTime < 1000 / 24) {
        raf = requestAnimationFrame(render)
        return
      }

      lastFrameTime = now
      resize()
      const elapsed = (performance.now() - start) * 0.001
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.uniform1f(timeLocation, elapsed)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (!reduceMotion) {
        raf = requestAnimationFrame(render)
      }
    }

    render()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
    }
  }, [])

  return <canvas ref={canvasRef} className="gpu-bg" aria-hidden="true" />
}

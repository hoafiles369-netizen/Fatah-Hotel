// @ts-nocheck
import React, { useEffect, useRef } from 'react';

// --- WGSL SHADER SOURCE ---
const SHADER_CODE = `
struct Uniforms {
    resolution: vec2<f32>,
    mouse: vec2<f32>,
    time: f32,
    speed: f32,
    zoom: f32,
    distortion: f32,
    noise_scale: f32,
    mouse_strength: f32,
    mouse_radius: f32,
    img_opacity: f32,
    img_distortion: f32,
    img_scale: f32,
    brightness: f32,
    contrast: f32,
    saturation: f32,
    vignette_strength: f32,
    pad1: f32,
    pad2: f32,
    color_a: vec4<f32>,
    color_b: vec4<f32>,
    color_c: vec4<f32>,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var myTexture: texture_2d<f32>;

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
    var pos = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0), vec2<f32>(1.0, -1.0), vec2<f32>(-1.0, 1.0),
        vec2<f32>(-1.0, 1.0), vec2<f32>(1.0, -1.0), vec2<f32>(1.0, 1.0)
    );
    return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
}

fn hash(p: vec2<f32>) -> vec2<f32> {
    let p2 = vec2<f32>(dot(p, vec2<f32>(127.1, 311.7)), dot(p, vec2<f32>(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p2) * 43758.5453123);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i + vec2<f32>(0.0, 0.0)), f - vec2<f32>(0.0, 0.0)),
                   dot(hash(i + vec2<f32>(1.0, 0.0)), f - vec2<f32>(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2<f32>(0.0, 1.0)), f - vec2<f32>(0.0, 1.0)),
                   dot(hash(i + vec2<f32>(1.0, 1.0)), f - vec2<f32>(1.0, 1.0)), u.x), u.y);
}

fn rgb2gray(c: vec3<f32>) -> f32 {
    return dot(c, vec3<f32>(0.299, 0.587, 0.114));
}

@fragment
fn fs_main(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
    let aspect = uniforms.resolution.x / uniforms.resolution.y;
    let uv = pos.xy / uniforms.resolution.y;
    let uv_screen = pos.xy / uniforms.resolution;

    let mouse_p = vec2<f32>(uniforms.mouse.x * aspect, uniforms.mouse.y);
    let uv_p = vec2<f32>(uv.x, uv.y);
    let m_dist = distance(uv_p, mouse_p);
    let m_force = smoothstep(uniforms.mouse_radius, 0.0, m_dist) * uniforms.mouse_strength;

    let t = uniforms.time * uniforms.speed;

    var p = uv * uniforms.zoom;
    p += vec2<f32>(m_force);

    let q = vec2<f32>(noise(p + t), noise(p + t + 4.2));

    let r = vec2<f32>(
        noise(p + uniforms.noise_scale * q + vec2<f32>(1.7, 9.2) + 0.5 * t),
        noise(p + uniforms.noise_scale * q + vec2<f32>(8.3, 2.8) + 0.4 * t)
    );

    let f = noise(p + uniforms.distortion * r);

    var color = mix(uniforms.color_a.rgb, uniforms.color_b.rgb, clamp(f * f * 4.0, 0.0, 1.0));
    color = mix(color, uniforms.color_c.rgb, clamp(length(q), 0.0, 1.0));
    color = mix(color, vec3<f32>(1.0), clamp(r.x, 0.0, 1.0) * 0.4);

    let liquid_final = color * f * 1.5;

    let tex_uv = (uv_screen - 0.5) * uniforms.img_scale + 0.5;
    let tex_flip = vec2<f32>(tex_uv.x, 1.0 - tex_uv.y);
    let tex_distorted = tex_flip + (r * 0.05 * uniforms.img_distortion);
    let tex_color = textureSample(myTexture, mySampler, tex_distorted);

    var output = mix(liquid_final, tex_color.rgb, uniforms.img_opacity);

    let gray = rgb2gray(output);
    output = mix(vec3<f32>(gray), output, uniforms.saturation);
    output = (output - 0.5) * uniforms.contrast + 0.5;
    output = output + uniforms.brightness;

    let d_center = distance(uv_screen, vec2<f32>(0.5));
    let vign = smoothstep(0.8, 0.2, d_center * uniforms.vignette_strength);
    output = output * vign;

    return vec4<f32>(output, 1.0);
}
`;

// ---------------------------------------------------------------------------
// BAKED SETTINGS — values taken directly from the screenshot
// Edit these constants to change the look without a runtime UI.
// ---------------------------------------------------------------------------
const SETTINGS = {
  // Fluid Dynamics
  speed:      0.20,
  zoom:       3.00,
  distortion: 4.00,
  noiseScale: 2.00,
  // Interaction (mouse tracking stays on)
  mouseStrength: 0.50,
  mouseRadius:   0.40,
  // Colors: Deep Base #190032 · Fluid Mid #008099 · Highlights #C8DCFF
  colorA: { r: 0x19, g: 0x00, b: 0x32 },
  colorB: { r: 0x00, g: 0x80, b: 0x99 },
  colorC: { r: 0xC8, g: 0xDC, b: 0xFF },
  // Post Processing
  brightness: 0.00,
  contrast:   1.00,
  saturation: 1.10,
  vignette:   0.50,
  // Image overlay — disabled
  imgOpacity:    0.00,
  imgDistortion: 1.00,
  imgScale:      1.00,
} as const;

// ---------------------------------------------------------------------------

const LiquidMetal: React.FC = () => {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const requestRef    = useRef<number>(0);
  const deviceRef     = useRef<GPUDevice | null>(null);
  const textureRef    = useRef<GPUTexture | null>(null);
  const mousePos      = useRef({ x: 0.5, y: 0.5 });

  // Mouse tracking
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // If canvas is not full screen, we should probably calculate relative position
      // But for now, sticking to the provided code logic but ensuring it works if canvas is full width of section
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mousePos.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        };
      }
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // WebGPU init + render loop
  useEffect(() => {
    const initGPU = async () => {
      if (!navigator.gpu) {
        console.error('WebGPU not supported in this browser.');
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) return;
      const device = await adapter.requestDevice();
      deviceRef.current = device;

      const canvas  = canvasRef.current!;
      const context = canvas.getContext('webgpu')!;
      const format  = navigator.gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: 'premultiplied' });

      const shaderModule = device.createShaderModule({ code: SHADER_CODE });

      const uniformBuffer = device.createBuffer({
        size: 256,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      // 1×1 black placeholder texture (image overlay is off)
      const defaultTex = device.createTexture({
        size: [1, 1],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
      });
      device.queue.writeTexture(
        { texture: defaultTex },
        new Uint8Array([0, 0, 0, 255]),
        { bytesPerRow: 4 },
        { width: 1, height: 1 }
      );
      textureRef.current = defaultTex;

      const sampler = device.createSampler({
        magFilter: 'linear',
        minFilter: 'linear',
        addressModeU: 'mirror-repeat',
        addressModeV: 'mirror-repeat',
      });

      const bindGroupLayout = device.createBindGroupLayout({
        entries: [
          { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
          { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
          { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {} },
        ],
      });

      const pipeline = device.createRenderPipeline({
        layout:    device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
        vertex:    { module: shaderModule, entryPoint: 'vs_main' },
        fragment:  { module: shaderModule, entryPoint: 'fs_main', targets: [{ format }] },
        primitive: { topology: 'triangle-list' },
      });

      const startTime = performance.now();
      const s = SETTINGS;

      const frame = () => {
        const now = (performance.now() - startTime) / 1000;

        const uniData = new Float32Array([
          canvas.width, canvas.height,           // resolution
          mousePos.current.x, mousePos.current.y,// mouse
          now,                                   // time
          s.speed,
          s.zoom,
          s.distortion,
          s.noiseScale,
          s.mouseStrength,
          s.mouseRadius,
          s.imgOpacity,
          s.imgDistortion,
          s.imgScale,
          s.brightness,
          s.contrast,
          s.saturation,
          s.vignette,
          0.0, 0.0,                              // padding (pad1, pad2)
          s.colorA.r / 255, s.colorA.g / 255, s.colorA.b / 255, 1.0,
          s.colorB.r / 255, s.colorB.g / 255, s.colorB.b / 255, 1.0,
          s.colorC.r / 255, s.colorC.g / 255, s.colorC.b / 255, 1.0,
        ]);

        device.queue.writeBuffer(uniformBuffer, 0, uniData);

        const bindGroup = device.createBindGroup({
          layout: bindGroupLayout,
          entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: textureRef.current!.createView() },
          ],
        });

        const encoder = device.createCommandEncoder();
        const pass    = encoder.beginRenderPass({
          colorAttachments: [{
            view:       context.getCurrentTexture().createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp:  'clear',
            storeOp: 'store',
          }],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(6);
        pass.end();

        device.queue.submit([encoder.finish()]);
        requestRef.current = requestAnimationFrame(frame);
      };

      requestRef.current = requestAnimationFrame(frame);
    };

    const resize = () => {
      if (canvasRef.current) {
        // Use clientWidth/Height for section-based sizing
        canvasRef.current.width  = canvasRef.current.clientWidth  * window.devicePixelRatio;
        canvasRef.current.height = canvasRef.current.clientHeight * window.devicePixelRatio;
      }
    };

    window.addEventListener('resize', resize);
    resize();
    initGPU();

    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (deviceRef.current) deviceRef.current.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        outline: 'none',
        position: 'absolute', // Changed from fixed to absolute
        inset: 0,
        pointerEvents: 'none', // Allow clicks to pass through to content
        zIndex: 0, // Ensure it's behind content
      }}
    />
  );
};

export default LiquidMetal;

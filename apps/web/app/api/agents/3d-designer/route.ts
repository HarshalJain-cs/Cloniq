/**
 * 3D Designer Agent - WORKING WITH VISUAL PREVIEWS
 * Generates Three.js 3D scenes with live previews
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Design3DRequestSchema = z.object({
  scene: z.enum(["product", "abstract", "geometric", "particles", "text3d"]).default("product"),
  colors: z.object({
    primary: z.string().default("#3b82f6"),
    secondary: z.string().default("#8b5cf6"),
    background: z.string().default("#1a1a1a"),
  }).optional(),
  animation: z.boolean().default(true),
  preview: z.boolean().default(true),
});

// Three.js scene templates
const SCENE_TEMPLATES = {
  product: (colors: any, animated: boolean) => `
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('${colors.background}');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Product (rounded box)
const geometry = new THREE.BoxGeometry(2, 2, 2, 10, 10, 10);
const material = new THREE.MeshStandardMaterial({
  color: '${colors.primary}',
  metalness: 0.7,
  roughness: 0.2,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation
function animate() {
  requestAnimationFrame(animate);
  ${animated ? 'cube.rotation.x += 0.005; cube.rotation.y += 0.01;' : ''}
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
`,

  geometric: (colors: any, animated: boolean) => `
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color('${colors.background}');
scene.fog = new THREE.Fog('${colors.background}', 1, 20);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

// Create geometric shapes
const shapes = [];
const geometries = [
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.OctahedronGeometry(1),
  new THREE.TetrahedronGeometry(1),
];

for (let i = 0; i < 20; i++) {
  const geometry = geometries[Math.floor(Math.random() * geometries.length)];
  const material = new THREE.MeshPhongMaterial({
    color: Math.random() < 0.5 ? '${colors.primary}' : '${colors.secondary}',
    shininess: 100,
  });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = (Math.random() - 0.5) * 20;
  mesh.position.y = (Math.random() - 0.5) * 20;
  mesh.position.z = (Math.random() - 0.5) * 20;

  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;

  const scale = 0.5 + Math.random() * 0.5;
  mesh.scale.set(scale, scale, scale);

  scene.add(mesh);
  shapes.push(mesh);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);
  ${animated ? `
  shapes.forEach((shape, i) => {
    shape.rotation.x += 0.001 * (i % 3);
    shape.rotation.y += 0.002 * (i % 5);
  });
  ` : ''}
  controls.update();
  renderer.render(scene, camera);
}

animate();
`,

  particles: (colors: any, animated: boolean) => `
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color('${colors.background}');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Particle system
const particleCount = 5000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

const color1 = new THREE.Color('${colors.primary}');
const color2 = new THREE.Color('${colors.secondary}');

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 100;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

  const mixedColor = color1.clone().lerp(color2, Math.random());
  colors[i * 3] = mixedColor.r;
  colors[i * 3 + 1] = mixedColor.g;
  colors[i * 3 + 2] = mixedColor.b;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.5,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
});

const particleSystem = new THREE.Points(particles, material);
scene.add(particleSystem);

function animate() {
  requestAnimationFrame(animate);
  ${animated ? `
  particleSystem.rotation.x += 0.001;
  particleSystem.rotation.y += 0.002;
  ` : ''}
  renderer.render(scene, camera);
}

animate();
`,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scene, colors, animation, preview } = Design3DRequestSchema.parse(body);

    const defaultColors = colors || {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      background: "#1a1a1a",
    };

    // Generate Three.js code
    const template = SCENE_TEMPLATES[scene as keyof typeof SCENE_TEMPLATES];
    if (!template) {
      return NextResponse.json(
        { error: `Scene type "${scene}" not supported. Try: product, geometric, particles` },
        { status: 400 }
      );
    }

    const threeJsCode = template(defaultColors, animation);

    // Generate live preview HTML
    const previewHTML = preview ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Scene Preview - ${scene}</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #info {
      position: absolute;
      top: 20px;
      left: 20px;
      color: white;
      background: rgba(0, 0, 0, 0.5);
      padding: 12px 20px;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }
  </style>
</head>
<body>
  <div id="info">
    <strong>3D Scene:</strong> ${scene}<br>
    <strong>Animation:</strong> ${animation ? "Enabled" : "Disabled"}<br>
    <small>Drag to rotate • Scroll to zoom</small>
  </div>
  <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
        "three/examples/jsm/controls/OrbitControls": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js"
      }
    }
  </script>
  <script type="module">
${threeJsCode}
  </script>
</body>
</html>` : null;

    return NextResponse.json({
      success: true,
      design: {
        scene,
        colors: defaultColors,
        animation,
        code: {
          threeJs: threeJsCode,
          instructions: "1. Install: npm install three\n2. Import the code into your React/Vue/vanilla JS project\n3. Add OrbitControls from three/examples/jsm/controls/OrbitControls",
        },
        preview: {
          html: previewHTML,
          dataUrl: previewHTML ? `data:text/html;base64,${Buffer.from(previewHTML).toString("base64")}` : null,
        },
      },
      message: `Generated ${scene} 3D scene with ${animation ? "animation" : "static rendering"}. Use the preview.dataUrl in an iframe to see it live.`,
    });
  } catch (error: any) {
    console.error("3D Designer error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate 3D scene" },
      { status: 500 }
    );
  }
}

// Get scene catalog
export async function GET() {
  return NextResponse.json({
    agent: "3d-designer",
    status: "active",
    capabilities: {
      scenes: ["product", "geometric", "particles"],
      features: ["Three.js code generation", "Live 3D preview", "Interactive controls", "Customizable colors"],
    },
    info: "This agent generates 3D scenes with Three.js and live previews. POST with {scene, colors, animation} to generate 3D designs.",
    example: {
      request: {
        scene: "particles",
        colors: { primary: "#3b82f6", secondary: "#8b5cf6", background: "#1a1a1a" },
        animation: true,
      },
    },
  });
}

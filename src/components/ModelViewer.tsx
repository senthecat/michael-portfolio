import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ModelViewerProps {
  src: string;
  label: string;
  color?: string;
}

type LoadState = { status: 'loading'; progress: number } | { status: 'ready' } | { status: 'error' };

// Loads a .glb/.gltf or .stl file into a scene the visitor can orbit, zoom and pan.
// The model slowly auto-rotates until the visitor interacts with it.
async function loadModel(src: string, color: string, onProgress: (p: number) => void): Promise<THREE.Object3D> {
  const progress = (e: ProgressEvent) => e.lengthComputable && onProgress(e.loaded / e.total);

  if (/\.stl(\?|#|$)/i.test(src)) {
    const geometry = await new STLLoader().loadAsync(src, progress);
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({ color, metalness: 0.2, roughness: 0.55 });
    const mesh = new THREE.Mesh(geometry, material);
    // CAD tools export Z-up; three.js is Y-up.
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  const gltf = await new GLTFLoader().loadAsync(src, progress);
  return gltf.scene;
}

export default function ModelViewer({ src, label, color = '#9ca3af' }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const [state, setState] = useState<LoadState>({ status: 'loading', progress: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setState({ status: 'loading', progress: 0 });

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 10, 7);
    scene.add(keyLight);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 1000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    const stopAutoRotate = () => (controls.autoRotate = false);
    controls.addEventListener('start', stopAutoRotate);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    let disposed = false;
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    loadModel(src, color, (progress) => !disposed && setState({ status: 'loading', progress }))
      .then((model) => {
        if (disposed) return;
        // Center the model at the origin and scale it to a consistent size, whatever units it was exported in.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        const pivot = new THREE.Group();
        model.position.sub(center);
        pivot.add(model);
        pivot.scale.setScalar(2 / size);
        scene.add(pivot);

        const home = new THREE.Vector3(1.4, 0.9, 1.6);
        resetRef.current = () => {
          camera.position.copy(home);
          controls.target.set(0, 0, 0);
          controls.autoRotate = true;
        };
        resetRef.current();
        controls.minDistance = 0.3;
        controls.maxDistance = 8;
        setState({ status: 'ready' });
        animate();
      })
      .catch(() => !disposed && setState({ status: 'error' }));

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.removeEventListener('start', stopAutoRotate);
      controls.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
        }
      });
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src, color]);

  const toggleFullscreen = () => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-100 to-slate-200">
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" aria-label={`3D model: ${label}`} role="img" />

      {state.status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500 pointer-events-none">
          <div className="w-40 h-1.5 rounded-full bg-slate-300 overflow-hidden">
            <div className="h-full bg-slate-600 transition-all duration-200" style={{ width: `${Math.round(state.progress * 100)}%` }} />
          </div>
          <span className="text-xs font-medium">Loading 3D model…</span>
        </div>
      )}
      {state.status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
          3D model coming soon
        </div>
      )}

      {state.status === 'ready' && (
        <>
          <p className="absolute bottom-3 left-3 text-xs text-slate-500 bg-white/70 backdrop-blur px-2 py-1 rounded pointer-events-none">
            Drag to rotate · Scroll to zoom · Right-drag to pan
          </p>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => resetRef.current()}
              className="text-xs font-medium bg-white/80 hover:bg-white text-slate-700 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-sm"
            >
              Reset view
            </button>
            <button
              onClick={toggleFullscreen}
              className="text-xs font-medium bg-white/80 hover:bg-white text-slate-700 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-sm"
            >
              Fullscreen
            </button>
          </div>
        </>
      )}
    </div>
  );
}

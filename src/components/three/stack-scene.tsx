"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/*
  The hero's 3D object: Ritesh's real stack as four floating plates.
  A request (the yellow packet) travels down from the interface to the model
  and back up again. Plates drift apart as the page scrolls and the whole
  stack leans toward the pointer.
*/

type Palette = { ink: string; ink2: string; bg: string; surface: string; mark: string; line: string };

const LAYERS = [
  { code: "01", name: "INTERFACE", tech: "React · jQuery · Bootstrap" },
  { code: "02", name: "API", tech: "ASP.NET MVC · Web API · C#" },
  { code: "03", name: "DATA", tech: "SQL Server · EF Core" },
  { code: "04", name: "AI", tech: "LLM APIs · Agents · Prompts" },
];

const GAP = 1.2;
const W = 3.4;
const D = 2.2;
const H = 0.09;

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim() || "#000";
  return { ink: v("--ink"), ink2: v("--ink-2"), bg: v("--bg"), surface: v("--surface"), mark: v("--mark"), line: v("--line") };
}

function usePalette() {
  const [p, setP] = useState<Palette | null>(null);
  useEffect(() => {
    const update = () => setP(readPalette());
    update();
    // Redraw labels once the brand fonts are ready.
    document.fonts?.ready.then(update).catch(() => {});
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);
    return () => {
      mo.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);
  return p;
}

function labelTexture(layer: (typeof LAYERS)[number], p: Palette) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 660;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, c.width, c.height);
  g.fillStyle = p.ink2;
  g.font = "500 44px 'JetBrains Mono Variable', monospace";
  g.fillText(`L${layer.code}`, 64, 300);
  g.font = "500 46px 'JetBrains Mono Variable', monospace";
  g.fillText(layer.tech, 64, 400);
  g.fillStyle = p.ink;
  g.font = "800 150px 'Archivo Variable', sans-serif";
  g.fillText(layer.name, 58, 580);
  // corner ticks, like registration marks on a drawing
  g.strokeStyle = p.ink;
  g.lineWidth = 4;
  const t = 36;
  [
    [24, 24, 1, 1],
    [1000, 24, -1, 1],
    [24, 636, 1, -1],
    [1000, 636, -1, -1],
  ].forEach(([x, y, dx, dy]) => {
    g.beginPath();
    g.moveTo(x, y + dy * t);
    g.lineTo(x, y);
    g.lineTo(x + dx * t, y);
    g.stroke();
  });
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Plate({ index, palette, spread }: { index: number; palette: Palette; spread: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const layer = LAYERS[index];
  const tex = useMemo(() => labelTexture(layer, palette), [layer, palette]);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)), []);
  const baseY = (1.5 - index) * GAP;

  useEffect(() => () => tex.dispose(), [tex]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const s = spread.current ?? 0;
    group.current.position.y = baseY * (1 + s * 0.9) + Math.sin(t * 0.8 + index * 1.3) * 0.04;
    group.current.rotation.y = Math.sin(t * 0.25 + index) * 0.04 + s * (index - 1.5) * 0.18;
  });

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color={palette.surface} roughness={0.85} metalness={0} transparent opacity={0.92} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={palette.ink} transparent opacity={0.9} />
      </lineSegments>
      <mesh position={[0, H / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 0.96, D * 0.96]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

function Packet({ palette, spread }: { palette: Palette; spread: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const trail = useRef<THREE.Points>(null);
  const N = 28;
  const positions = useMemo(() => new Float32Array(N * 3), []);
  const history = useRef<THREE.Vector3[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = spread.current ?? 0;
    const top = 1.5 * GAP * (1 + s * 0.9) + 0.6;
    const bottom = -1.5 * GAP * (1 + s * 0.9) - 0.1;
    // down and back up: a request and its response
    const phase = (t * 0.22) % 1;
    const k = phase < 0.5 ? phase * 2 : 2 - phase * 2;
    const eased = k * k * (3 - 2 * k);
    const y = THREE.MathUtils.lerp(top, bottom, eased);
    const x = 0.95 + Math.sin(t * 1.4) * 0.06;
    const z = 0.45;
    if (mesh.current) {
      mesh.current.position.set(x, y, z);
      mesh.current.rotation.x += 0.03;
      mesh.current.rotation.y += 0.04;
    }
    const h = history.current;
    h.unshift(new THREE.Vector3(x, y, z));
    if (h.length > N) h.pop();
    if (trail.current) {
      const attr = trail.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < N; i++) {
        const p = h[Math.min(i, h.length - 1)];
        attr.setXYZ(i, p.x, p.y, p.z);
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <>
      <mesh ref={mesh}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={palette.mark} emissive={palette.mark} emissiveIntensity={0.55} roughness={0.4} />
      </mesh>
      <points ref={trail}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={palette.mark} size={0.08} sizeAttenuation transparent opacity={0.8} />
      </points>
      {/* the vertical wire the request travels along */}
      <mesh position={[0.95, 0, 0.45]}>
        <cylinderGeometry args={[0.008, 0.008, 6.2, 6]} />
        <meshBasicMaterial color={palette.ink2} transparent opacity={0.45} />
      </mesh>
    </>
  );
}

function Dust({ palette }: { palette: Palette }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(220 * 3);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
    for (let i = 0; i < 220; i++) {
      a[i * 3] = rnd() * 7;
      a[i * 3 + 1] = rnd() * 5;
      a[i * 3 + 2] = rnd() * 4 - 1;
    }
    return a;
  }, []);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={palette.ink2} size={0.022} sizeAttenuation transparent opacity={0.55} />
    </points>
  );
}

function Rig({ palette, reduced }: { palette: Palette; reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const spread = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();
  const scale = size.width < 640 ? 1.05 : size.width < 1024 ? 0.95 : 1;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    const target = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
    spread.current = THREE.MathUtils.damp(spread.current, reduced ? 0 : target, 4, dt);
    if (!root.current) return;
    const t = state.clock.elapsedTime;
    const ry = -0.62 + pointer.current.x * 0.25 + (reduced ? 0 : Math.sin(t * 0.15) * 0.08);
    const rx = 0.5 + pointer.current.y * 0.12;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, ry, 3, dt);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, rx, 3, dt);
  });

  return (
    <group ref={root} scale={scale} rotation={[0.5, -0.62, 0]}>
      {LAYERS.map((_, i) => (
        <Plate key={i} index={i} palette={palette} spread={spread} />
      ))}
      <Packet palette={palette} spread={spread} />
    </group>
  );
}

export default function StackScene({ reduced }: { reduced: boolean }) {
  const palette = usePalette();
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  // Stop rendering when the hero is off screen to save battery.
  useEffect(() => {
    if (!host.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(host.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="absolute inset-0" aria-hidden>
      {palette ? (
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.4, 9.2], fov: 38 }}
          frameloop={visible && !reduced ? "always" : "demand"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={1.6} />
          <directionalLight position={[4, 6, 5]} intensity={1.4} />
          <Dust palette={palette} />
          <Rig palette={palette} reduced={reduced} />
        </Canvas>
      ) : null}
    </div>
  );
}

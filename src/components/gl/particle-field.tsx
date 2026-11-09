"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  gridShape,
  noiseSeeds,
  ribbonShape,
  scatterShape,
  sphereShape,
  textShape,
  torusShape,
  tunnelShape,
  type View,
} from "./shapes";

/*
  One particle field for the whole page. Every section declares a shape with
  data-shape="0..7"; as you scroll, the field flows from one shape to the next.
  0 name · 1 ribbon · 2 ring · 3 sphere · 4 tunnel · 5 floor grid · 6 stars · 7 "@"
*/
export const SHAPES = 8;

const vertex = /* glsl */ `
  uniform float uW[${SHAPES}];
  uniform float uTime;
  uniform float uIntro;
  uniform float uTunnel;
  uniform vec2 uMouse;
  uniform float uMouseForce;
  uniform float uSize;
  uniform float uPixel;
  uniform float uSphereX;
  uniform float uSpin;
  attribute vec3 t0; attribute vec3 t1; attribute vec3 t2; attribute vec3 t3;
  attribute vec3 t4; attribute vec3 t5; attribute vec3 t6; attribute vec3 t7;
  attribute vec4 seed;
  varying float vAccent;
  varying float vFade;

  void main() {
    // tunnel rings stream toward the camera
    vec3 tn = t4;
    tn.z = mod(t4.z + uTime * 1.6 + uTunnel * 40.0 + 42.0, 48.0) - 42.0;
    // floor grid ripples
    vec3 gr = t5;
    gr.y += sin(gr.x * 0.55 + uTime * 1.2) * 0.35 + cos(gr.z * 0.45 + uTime) * 0.35;
    // the ring slowly turns
    float ra = uTime * 0.12 + uSpin;
    vec3 rg = vec3(t2.x * cos(ra) - t2.z * sin(ra), t2.y, t2.x * sin(ra) + t2.z * cos(ra));
    // the sphere turns around its own centre
    float sa = uTime * 0.18 + uSpin;
    vec3 sp = t3 - vec3(uSphereX, 0.0, 0.0);
    sp = vec3(sp.x * cos(sa) - sp.z * sin(sa), sp.y, sp.x * sin(sa) + sp.z * cos(sa)) + vec3(uSphereX, 0.0, 0.0);

    vec3 p = t0 * uW[0] + t1 * uW[1] + rg * uW[2] + sp * uW[3] + tn * uW[4] + gr * uW[5] + t6 * uW[6] + t7 * uW[7];

    // living drift
    float d = 0.06 + uW[1] * 0.22 + uW[6] * 0.3;
    p.x += sin(uTime * 0.7 + seed.x * 40.0) * d;
    p.y += cos(uTime * 0.6 + seed.y * 40.0) * d;
    p.z += sin(uTime * 0.5 + seed.z * 40.0) * d;

    // intro: particles condense out of a wide cloud
    vec3 chaos = (seed.xyz - 0.5) * vec3(36.0, 22.0, 18.0);
    float k = smoothstep(seed.w * 0.55, seed.w * 0.55 + 0.45, uIntro);
    p = mix(chaos, p, k);

    // pointer pushes particles away, they spring back
    vec2 delta = p.xy - uMouse;
    float dist = length(delta);
    float push = smoothstep(1.9, 0.0, dist) * uMouseForce;
    p.xy += normalize(delta + 0.0001) * push * 0.9;
    p.z += push * 1.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float s = uSize * (0.55 + seed.w * 0.9) * (1.0 + push * 1.5);
    gl_PointSize = s * uPixel / -mv.z;
    vAccent = step(0.93, seed.x) + push * 0.8;
    vFade = clamp((-mv.z - 0.5) / 3.0, 0.0, 1.0) * clamp(1.0 - (-mv.z - 12.0) / 34.0, 0.15, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uAlpha;
  varying float vAccent;
  varying float vFade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.15, r);
    vec3 col = mix(uInk, uAccent, clamp(vAccent, 0.0, 1.0));
    gl_FragColor = vec4(col, a * uAlpha * vFade);
  }
`;

type Anchor = { top: number; bottom: number; shape: number; alpha: number };

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function ParticleField() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      document.documentElement.classList.add("no-gl");
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    const mobile = window.innerWidth < 768;
    const N = mobile ? 6500 : 15000;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute("seed", new THREE.BufferAttribute(noiseSeeds(N), 4));

    const uniforms = {
      uW: { value: new Array(SHAPES).fill(0).map((_, i) => (i === 0 ? 1 : 0)) },
      uTime: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uTunnel: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uMouseForce: { value: 0 },
      uSize: { value: mobile ? 0.085 : 0.07 },
      uPixel: { value: 0 },
      uSphereX: { value: 0 },
      uSpin: { value: 0 },
      uInk: { value: new THREE.Color() },
      uAccent: { value: new THREE.Color() },
      uAlpha: { value: 1 },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true, depthWrite: false });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    scene.add(points);

    const readColors = () => {
      uniforms.uInk.value.set(css("--ink") || "#0b0d12");
      uniforms.uAccent.value.set(css("--accent") || "#2b3bff");
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", readColors);

    let view: View = { w: 1, h: 1, mobile };
    const build = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const worldH = 2 * 10 * Math.tan((50 * Math.PI) / 360);
      view = { w: worldH * camera.aspect, h: worldH, mobile: w < 768 };
      uniforms.uPixel.value = (h * dpr) / (2 * Math.tan((50 * Math.PI) / 360));
      uniforms.uSphereX.value = view.mobile ? 0 : view.w * 0.2;
      const nameLines = view.mobile ? ["RITESH", "JENA"] : ["RITESH JENA"];
      const nameW = view.mobile ? view.w * 0.9 : Math.min(view.w * 0.86, 15);
      const shapes = [
        textShape(nameLines, N, view, { width: nameW, y: view.mobile ? view.h * 0.13 : view.h * 0.1 }),
        ribbonShape(N, view),
        torusShape(N, view),
        sphereShape(N, view),
        tunnelShape(N, view),
        gridShape(N, view),
        scatterShape(N, view),
        textShape(["@"], N, view, { width: Math.min(view.w, view.h) * (view.mobile ? 0.5 : 0.42), x: view.mobile ? 0 : view.w * 0.36, y: view.mobile ? -view.h * 0.08 : 0, weight: 500 }),
      ];
      shapes.forEach((s, i) => geo.setAttribute(`t${i}`, new THREE.BufferAttribute(s, 3)));
      measure();
    };

    // Section anchors, re-measured whenever layout changes.
    let anchors: Anchor[] = [];
    const measure = () => {
      anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-shape]")).map((s) => {
        const r = s.getBoundingClientRect();
        return {
          top: r.top + window.scrollY,
          bottom: r.bottom + window.scrollY,
          shape: Number(s.dataset.shape),
          alpha: Number(s.dataset.alpha ?? 1),
        };
      });
    };

    const target = new Array(SHAPES).fill(0);
    let targetAlpha = 1;
    const computeTargets = () => {
      target.fill(0);
      if (!anchors.length) {
        target[0] = 1;
        return;
      }
      const vh = window.innerHeight;
      const y = window.scrollY + vh * 0.5;
      let i = anchors.findIndex((a) => y >= a.top && y < a.bottom);
      if (i === -1) i = y < anchors[0].top ? 0 : anchors.length - 1;
      const a = anchors[i];
      const next = anchors[i + 1];
      const zone = Math.min(vh * 0.6, (a.bottom - a.top) * 0.5);
      let t = 0;
      if (next) t = Math.min(1, Math.max(0, (y - (a.bottom - zone)) / zone));
      t = t * t * (3 - 2 * t);
      target[a.shape] += 1 - t;
      if (next) target[next.shape] += t;
      targetAlpha = a.alpha * (1 - t) + (next ? next.alpha : a.alpha) * t;
      // tunnel travel follows the journey section's progress
      const journey = anchors.find((x) => x.shape === 4);
      if (journey) uniforms.uTunnel.value = Math.min(1, Math.max(0, (y - journey.top) / Math.max(1, journey.bottom - journey.top)));
    };

    let mouseTarget = new THREE.Vector2(99, 99);
    let mouseActive = 0;
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const x = (e.clientX / window.innerWidth - 0.5) * view.w;
      const y = -(e.clientY / window.innerHeight - 0.5) * view.h;
      mouseTarget = new THREE.Vector2(x, y);
      mouseActive = 1;
    };
    const onLeave = () => (mouseActive = 0);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    // Reduced motion: no animation loop, just redraw the matching shape when the page moves.
    const onStill = () => {
      if (reduced && started && !raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", onStill, { passive: true });
    const onResize = () => {
      build();
      onStill();
    };
    window.addEventListener("resize", onResize);
    const onRefresh = () => measure();
    const onSpin = (e: Event) => (uniforms.uSpin.value = (e as CustomEvent<number>).detail);
    window.addEventListener("field:spin", onSpin);
    window.addEventListener("field:measure", onRefresh);
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);

    let raf = 0;
    let visible = true;
    const onVis = () => (visible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    const clock = new THREE.Timer();
    const introStart = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      clock.update(now);
      const dt = Math.min(0.05, clock.getDelta());
      uniforms.uTime.value += reduced ? 0 : dt;
      if (!reduced) uniforms.uIntro.value = Math.min(1, (now - introStart) / 2600);
      computeTargets();
      const w = uniforms.uW.value;
      const ease = reduced ? 1 : 1 - Math.pow(0.0025, dt);
      for (let i = 0; i < SHAPES; i++) w[i] += (target[i] - w[i]) * ease;
      uniforms.uAlpha.value += (targetAlpha - uniforms.uAlpha.value) * ease;
      uniforms.uMouse.value.lerp(mouseTarget, 1 - Math.pow(0.001, dt));
      uniforms.uMouseForce.value += (mouseActive - uniforms.uMouseForce.value) * ease;
      // camera leans gently with the pointer
      camera.position.x += (uniforms.uMouse.value.x * 0.04 * mouseActive - camera.position.x) * ease;
      camera.position.y += (uniforms.uMouse.value.y * 0.04 * mouseActive - camera.position.y) * ease;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (reduced) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      build();
      document.documentElement.classList.add("gl-on");
      raf = requestAnimationFrame(frame);
      window.dispatchEvent(new Event("field:ready"));
    };
    // Wait for the display font so the name is sampled in the right face.
    Promise.race([document.fonts.load('800 100px "Unbounded Variable"'), new Promise((r) => setTimeout(r, 1500))]).then(start, start);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onStill);
      window.removeEventListener("field:measure", onRefresh);
      window.removeEventListener("field:spin", onSpin);
      document.removeEventListener("visibilitychange", onVis);
      mq.removeEventListener("change", readColors);
      mo.disconnect();
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      document.documentElement.classList.remove("gl-on");
    };
  }, []);

  return <div ref={host} aria-hidden className="field" />;
}

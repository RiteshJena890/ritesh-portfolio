// Target point clouds for the particle field. Each section of the page has one;
// the field blends between them as you scroll. World units: camera at z=10, fov 50.

export type View = { w: number; h: number; mobile: boolean };

const rand = (() => {
  let s = 1234567;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
})();

/** Sample filled pixels of text drawn on a canvas and map them into world space. */
export function textShape(lines: string[], n: number, v: View, opts: { width: number; y: number; x?: number; weight?: number }) {
  const cw = 1400;
  const fontSize = 220;
  const lh = fontSize * 1.02;
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = Math.ceil(lh * lines.length + fontSize * 0.4);
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.fillStyle = "#000";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `${opts.weight ?? 800} ${fontSize}px "Unbounded Variable", "Arial Black", sans-serif`;
  // shrink to fit the canvas width
  const widest = Math.max(...lines.map((l) => g.measureText(l).width));
  const scale = Math.min(1, (cw * 0.96) / widest);
  g.font = `${opts.weight ?? 800} ${fontSize * scale}px "Unbounded Variable", "Arial Black", sans-serif`;
  lines.forEach((l, i) => g.fillText(l, cw / 2, fontSize * 0.2 + lh * scale * (i + 0.5) + (lh * (1 - scale) * lines.length) / 2));
  const data = g.getImageData(0, 0, c.width, c.height).data;
  const pts: number[] = [];
  let minX = cw,
    maxX = 0,
    minY = c.height,
    maxY = 0;
  const step = 3;
  for (let y = 0; y < c.height; y += step) {
    for (let x = 0; x < cw; x += step) {
      if (data[(y * cw + x) * 4 + 3] > 140) {
        pts.push(x, y);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const out = new Float32Array(n * 3);
  const count = pts.length / 2;
  const bw = Math.max(1, maxX - minX);
  const bh = Math.max(1, maxY - minY);
  const worldW = opts.width;
  const worldH = (bh / bw) * worldW;
  for (let i = 0; i < n; i++) {
    const k = count ? Math.floor(rand() * count) : 0;
    const px = count ? pts[k * 2] + (rand() - 0.5) * step : 0;
    const py = count ? pts[k * 2 + 1] + (rand() - 0.5) * step : 0;
    out[i * 3] = ((px - minX) / bw - 0.5) * worldW + (opts.x ?? 0);
    out[i * 3 + 1] = -((py - minY) / bh - 0.5) * worldH + opts.y;
    out[i * 3 + 2] = (rand() - 0.5) * 0.25;
  }
  return out;
}

export function ribbonShape(n: number, v: View) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = rand();
    const s = rand();
    const x = (u - 0.5) * v.w * 1.3;
    const twist = u * Math.PI * 3;
    const r = (s - 0.5) * (v.mobile ? 1.6 : 2.2);
    out[i * 3] = x;
    out[i * 3 + 1] = Math.sin(twist) * v.h * 0.12 + Math.cos(twist) * r - v.h * 0.05;
    out[i * 3 + 2] = Math.sin(twist) * r * 1.2 - 1;
  }
  return out;
}

export function torusShape(n: number, v: View) {
  const out = new Float32Array(n * 3);
  const R = Math.min(v.w, v.h) * (v.mobile ? 0.36 : 0.3);
  const r = R * 0.18;
  const tilt = 1.15;
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const b = rand() * Math.PI * 2;
    const x = (R + r * Math.cos(b)) * Math.cos(a);
    const y = (R + r * Math.cos(b)) * Math.sin(a);
    const z = r * Math.sin(b);
    out[i * 3] = x;
    out[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt);
    out[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt) - 1;
  }
  return out;
}

export function sphereShape(n: number, v: View) {
  const out = new Float32Array(n * 3);
  const R = Math.min(v.w, v.h) * (v.mobile ? 0.36 : 0.32);
  const cx = v.mobile ? 0 : v.w * 0.2;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const shell = i % 7 === 0 ? 1.18 + rand() * 0.4 : 1;
    out[i * 3] = Math.cos(th) * rad * R * shell + cx;
    out[i * 3 + 1] = y * R * shell;
    out[i * 3 + 2] = Math.sin(th) * rad * R * shell;
  }
  return out;
}

/** Rings along the z axis. The shader scrolls them toward the camera. */
export function tunnelShape(n: number, v: View) {
  const out = new Float32Array(n * 3);
  const R = Math.max(v.w, v.h) * 0.42;
  const rings = 60;
  for (let i = 0; i < n; i++) {
    const ring = i % rings;
    const a = rand() * Math.PI * 2;
    const rr = R * (0.92 + rand() * 0.16);
    out[i * 3] = Math.cos(a) * rr;
    out[i * 3 + 1] = Math.sin(a) * rr;
    out[i * 3 + 2] = -(ring / rings) * 48 + 6;
  }
  return out;
}

export function gridShape(n: number, v: View) {
  const out = new Float32Array(n * 3);
  const cols = Math.ceil(Math.sqrt(n * 2.2));
  const rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const cx = i % cols;
    const cz = Math.floor(i / cols);
    out[i * 3] = (cx / cols - 0.5) * v.w * 2.4;
    out[i * 3 + 1] = -v.h * 0.42;
    out[i * 3 + 2] = -(cz / rows) * 30 + 4;
  }
  return out;
}

export function scatterShape(n: number, v: View) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    out[i * 3] = (rand() - 0.5) * v.w * 1.6;
    out[i * 3 + 1] = (rand() - 0.5) * v.h * 1.6;
    out[i * 3 + 2] = -rand() * 14 + 2;
  }
  return out;
}

export function noiseSeeds(n: number) {
  const out = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    out[i * 4] = rand();
    out[i * 4 + 1] = rand();
    out[i * 4 + 2] = rand();
    out[i * 4 + 3] = rand();
  }
  return out;
}

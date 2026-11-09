import type { Project } from "@/content/profile";

const CHAR_W = 6.7; // approx. width of an 11px mono glyph

function wrap(text: string, maxChars: number) {
  const lines: string[] = [];
  let cur = "";
  for (const word of text.split(" ")) {
    const next = cur ? `${cur} ${word}` : word;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = word;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * A schematic of the project's modules, drawn from its real feature list.
 * Used instead of screenshots, which are not available.
 */
export function ProjectDiagram({ project, index }: { project: Project; index: number }) {
  const feats = project.features.slice(0, 4);
  const W = 400;
  const H = 250;
  const cx = W / 2;
  const cy = 52;
  const twoRows = feats.length === 4;
  const cols = twoRows ? 2 : feats.length;
  const pad = 22;
  const gap = 10;
  const boxW = (W - pad * 2 - gap * (cols - 1)) / cols;
  const boxH = twoRows ? 58 : 76;
  const rowY = (r: number) => (twoRows ? 106 + r * (boxH + 10) : 124);
  const maxChars = Math.floor((boxW - 14) / CHAR_W);
  const title = project.name.length > 20 ? project.name.split(" ").slice(0, 2).join(" ") : project.name;

  const boxes = feats.map((f, i) => {
    const col = i % cols;
    const row = twoRows ? Math.floor(i / cols) : 0;
    const x = pad + col * (boxW + gap);
    const y = rowY(row);
    return { f, x, y, lines: wrap(f, maxChars).slice(0, 3) };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Module diagram of ${project.name}: ${feats.join(", ")}`}>
      <defs>
        <pattern id={`dots-${index}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="var(--line)" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill={`url(#dots-${index})`} />
      {boxes.map(({ f, x, y }) => {
        const bx = x + boxW / 2;
        return (
          <path
            key={`l-${f}`}
            d={`M ${cx} ${cy + 22} C ${cx} ${cy + 50}, ${bx} ${y - 34}, ${bx} ${y}`}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.5"
            className="diagram-wire"
          />
        );
      })}
      <rect x={cx - 100} y={cy - 22} width="200" height="44" rx="10" fill="var(--ink)" />
      <text x={cx} y={cy + 6} textAnchor="middle" fill="var(--bg)" fontFamily="var(--font-display)" fontWeight="800" fontSize="17">
        {title}
      </text>
      {boxes.map(({ f, x, y, lines }) => (
        <g key={f}>
          <rect x={x} y={y} width={boxW} height={boxH} rx="8" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.5" />
          <rect x={x + 1} y={y + 1} width={boxW - 2} height="5" rx="2" fill="var(--mark)" />
          {lines.map((ln, li) => (
            <text
              key={li}
              x={x + boxW / 2}
              y={y + boxH / 2 + 5 + (li - (lines.length - 1) / 2) * 13}
              textAnchor="middle"
              fill="var(--ink)"
              fontFamily="var(--font-mono)"
              fontSize="11"
            >
              {ln}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}

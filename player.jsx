/* Animation framework: Player hook + step engine + small components */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ===================== Player hook =====================
 * Drives a sequence of "frames" (steps) computed by a generator function.
 * - frames: array produced by the algorithm function
 * - controls: play / pause / step / reset / speed / seek
 */
function usePlayer(framesFactory, deps = []) {
  const frames = useMemo(() => {
    try { return framesFactory() || []; } catch (e) { console.error(e); return []; }
  }, deps);

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.25 .. 4
  const timerRef = useRef(null);

  // reset when frames change
  useEffect(() => { setIdx(0); setPlaying(false); }, [frames]);

  useEffect(() => {
    if (!playing) return;
    if (idx >= frames.length - 1) { setPlaying(false); return; }
    const baseDelay = 700; // ms per step at 1x
    const delay = baseDelay / speed;
    timerRef.current = setTimeout(() => setIdx(i => Math.min(frames.length - 1, i + 1)), delay);
    return () => clearTimeout(timerRef.current);
  }, [playing, idx, speed, frames]);

  const play = () => { if (idx >= frames.length - 1) setIdx(0); setPlaying(true); };
  const pause = () => setPlaying(false);
  const toggle = () => playing ? pause() : play();
  const step = () => { setPlaying(false); setIdx(i => Math.min(frames.length - 1, i + 1)); };
  const back = () => { setPlaying(false); setIdx(i => Math.max(0, i - 1)); };
  const reset = () => { setPlaying(false); setIdx(0); };
  const seek = (i) => { setPlaying(false); setIdx(Math.max(0, Math.min(frames.length - 1, i))); };

  const frame = frames[idx] || frames[0] || {};
  return { frames, idx, frame, playing, speed, setSpeed, play, pause, toggle, step, back, reset, seek };
}

/* ===================== Player toolbar component ===================== */
function PlayerToolbar({ player, extraLeft, extraRight }) {
  return (
    <div className="viz-toolbar">
      {extraLeft}
      <button className="btn btn-ghost btn-sm btn-icon" onClick={player.reset} title="Reset">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
      </button>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={player.back} disabled={player.idx === 0} title="Step back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 5L4 12l7 7V5zM20 5l-7 7 7 7V5z"/></svg>
      </button>
      <button className="btn btn-primary btn-sm btn-icon" onClick={player.toggle} title={player.playing ? "Pause" : "Play"}>
        {player.playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8V4z"/></svg>
        )}
      </button>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={player.step} disabled={player.idx >= player.frames.length - 1} title="Step forward">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 19l7-7-7-7v14zM4 19l7-7-7-7v14z"/></svg>
      </button>
      <div className="ctrl-group" style={{ marginLeft: 8 }}>
        <span style={{ fontSize: 11 }}>Speed</span>
        <input
          className="slider"
          type="range"
          min="0.25" max="4" step="0.25"
          value={player.speed}
          onChange={e => player.setSpeed(parseFloat(e.target.value))}
        />
        <span style={{ fontSize: 11, minWidth: 30 }}>{player.speed}x</span>
      </div>
      <div className="spacer" />
      <span style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>
        Step {player.idx + 1} / {player.frames.length}
      </span>
      {extraRight}
    </div>
  );
}

/* ===================== Code highlighter ===================== */
function CodeBlock({ code, highlight, language = "c" }) {
  // code: array of { line: string }
  // highlight: array of line indexes (0-based) currently active
  const hi = new Set(highlight || []);
  return (
    <pre className="code-block" style={{ margin: 0 }}>
      <code>
        {code.map((row, i) => (
          <span key={i} className={"ln" + (hi.has(i) ? " hi" : "")}>
            <span className="ln-num">{String(i + 1).padStart(2, ' ')}</span>
            {syntax(row, language)}
            {"\n"}
          </span>
        ))}
      </code>
    </pre>
  );
}

// extremely small syntax highlighter
function syntax(line, lang) {
  const kws = new Set([
    "for","while","if","else","return","int","void","char","float","double","long",
    "struct","typedef","const","static","sizeof","break","continue","do","switch","case","default",
    "true","false","NULL","#include","define","new","delete","class","public","private"
  ]);
  // tokenize
  const out = [];
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(\b\d+(\.\d+)?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|(\s+)|([^\w\s])/g;
  let m, key = 0;
  while ((m = re.exec(line)) !== null) {
    const [t] = m;
    if (m[1]) out.push(<span key={key++} className="tok-cmt">{t}</span>);
    else if (m[2]) out.push(<span key={key++} className="tok-str">{t}</span>);
    else if (m[3]) out.push(<span key={key++} className="tok-num">{t}</span>);
    else if (m[5]) {
      if (kws.has(t)) out.push(<span key={key++} className="tok-kw">{t}</span>);
      else if (line.slice(m.index + t.length).startsWith("(")) out.push(<span key={key++} className="tok-fn">{t}</span>);
      else out.push(<span key={key++}>{t}</span>);
    }
    else out.push(<span key={key++}>{t}</span>);
  }
  return out;
}

/* ===================== Bars renderer (for sorting) ===================== */
function Bars({ data, marks = {}, max }) {
  // data: number[]
  // marks: { idx: 'compare'|'swap'|'sorted'|'pivot'|'cursor'|'dim' }
  const m = max || Math.max(...data, 1);
  return (
    <div className="bars">
      {data.map((v, i) => (
        <div
          key={i}
          className={"bar " + (marks[i] || "")}
          style={{ height: `${(v / m) * 100}%` }}
        >
          {v}
        </div>
      ))}
    </div>
  );
}

/* ===================== Cells renderer (array / search) ===================== */
function Cells({ data, marks = {}, labels = {} }) {
  return (
    <div className="cells" style={{ marginTop: 30, marginBottom: 26 }}>
      {data.map((v, i) => (
        <div key={i} className={"cell " + (marks[i] || "")}>
          {labels[i] && <span className="cell-label">{labels[i]}</span>}
          {v}
          <span className="cell-idx">{i}</span>
        </div>
      ))}
    </div>
  );
}

/* ===================== Variables panel ===================== */
function VarsPanel({ vars }) {
  const entries = Object.entries(vars || {});
  if (!entries.length) return null;
  return (
    <div className="viz-info">
      {entries.map(([k, v]) => (
        <span key={k}>{k}:<b>{String(v)}</b></span>
      ))}
    </div>
  );
}

/* ===================== Input array control ===================== */
function ArrayInput({ value, onChange, max = 40, min = 3 }) {
  const [text, setText] = useState(value.join(", "));
  useEffect(() => { setText(value.join(", ")); }, [value]);
  const apply = () => {
    const arr = text.split(/[,\s]+/).filter(Boolean).map(Number).filter(n => !Number.isNaN(n)).slice(0, max);
    if (arr.length >= min) onChange(arr);
    else setText(value.join(", "));
  };
  return (
    <div className="ctrl-group">
      <span style={{ fontSize: 11 }}>Input</span>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={apply}
        onKeyDown={e => { if (e.key === 'Enter') { apply(); e.target.blur(); } }}
        style={{ width: 220 }}
      />
      <button className="btn btn-ghost btn-sm" onClick={() => {
        const n = 8 + Math.floor(Math.random() * 4);
        const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 5);
        onChange(arr);
      }}>Random</button>
    </div>
  );
}

window.usePlayer = usePlayer;
window.PlayerToolbar = PlayerToolbar;
window.CodeBlock = CodeBlock;
window.Bars = Bars;
window.Cells = Cells;
window.VarsPanel = VarsPanel;
window.ArrayInput = ArrayInput;

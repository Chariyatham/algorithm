/* Lessons Part 13 — Power tools: Step Compare, Code Bridge, Proof Visualizer */

const { useState: useS13, useEffect: useE13, useMemo: useM13, useRef: useR13 } = React;

const Lessons13 = {};

/* ============================================================
   1)  STEP COMPARE — synchronized scrub across 2–3 algorithms
============================================================ */

const SORT_ALGOS = [
  { key: "bubble", color: "#7dd3fc" },
  { key: "selection", color: "#fbbf24" },
  { key: "insertion", color: "#a78bfa" },
  { key: "merge", color: "#34d399" },
  { key: "quick", color: "#f472b6" },
  { key: "heap", color: "#f87171" },
];

function MiniBars({ data, marks = {}, accent = "#7dd3fc" }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 130, padding: '6px 8px', background: 'var(--bg-0)', borderRadius: 8, border: '1px solid var(--border-soft)' }}>
      {data.map((v, i) => {
        const mk = marks[i];
        let bg = accent + "55";
        let outline = "transparent";
        if (mk === 'compare') { bg = "var(--warn)"; outline = "var(--warn)"; }
        else if (mk === 'swap') { bg = "var(--danger)"; outline = "var(--danger)"; }
        else if (mk === 'sorted') { bg = "var(--accent-3)"; outline = "var(--accent-3)"; }
        else if (mk === 'pivot') { bg = "var(--accent-2)"; outline = "var(--accent-2)"; }
        else if (mk === 'cursor') { bg = accent; outline = accent; }
        else if (mk === 'dim') { bg = accent + "22"; }
        return (
          <div key={i} title={String(v)} style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            background: bg,
            borderTop: `2px solid ${outline}`,
            borderRadius: '3px 3px 0 0',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            color: '#0a0e14', fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700,
            transition: 'height .18s, background .12s',
            minWidth: 14, paddingBottom: 2,
          }}>{v}</div>
        );
      })}
    </div>
  );
}

function Lane({ algoKey, input, step, totalSync }) {
  const algo = window.AlgorithmGenerators[algoKey];
  const palette = SORT_ALGOS.find(a => a.key === algoKey) || { color: '#7dd3fc' };
  const frames = useM13(() => {
    try { return algo.gen(input); } catch (e) { return []; }
  }, [input, algoKey]);

  const idx = Math.min(step, frames.length - 1);
  const f = frames[idx] || { arr: input, marks: {}, vars: {} };
  const done = step >= frames.length - 1;
  const pct = totalSync > 0 ? Math.min(100, (frames.length / totalSync) * 100) : 0;

  const vars = f.vars || {};
  const cmp = vars.comparisons ?? '—';
  const sw  = vars.swaps ?? vars.shifts ?? '—';

  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', background: 'var(--bg-2)', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: palette.color }}></span>
        <b style={{ fontSize: 13 }}>{algo.name}</b>
        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-2)' }}>{algo.complexity.time}</span>
        <div style={{ flex: 1 }}></div>
        {done
          ? <span style={{ fontSize: 11, color: 'var(--accent-3)', fontWeight: 600 }}>✓ DONE @ step {frames.length - 1}</span>
          : <span style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{idx} / {frames.length - 1}</span>}
      </div>

      <div style={{ padding: 10 }}>
        <MiniBars data={f.arr || input} marks={f.marks || {}} accent={palette.color} />
      </div>

      {/* mini timeline bar showing length relative to others */}
      <div style={{ padding: '0 14px 6px' }}>
        <div title="ความยาว frame ของ algo นี้ เทียบกับ algo ที่ยาวที่สุด"
             style={{ height: 4, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: palette.color + 'aa' }}></div>
        </div>
      </div>

      <div style={{ padding: '8px 14px 12px', display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-2)', borderTop: '1px solid var(--border-soft)' }}>
        <span>cmp: <b style={{ color: 'var(--warn)' }}>{cmp}</b></span>
        <span>{vars.swaps !== undefined ? 'swap' : (vars.shifts !== undefined ? 'shift' : 'op')}: <b style={{ color: 'var(--danger)' }}>{sw}</b></span>
        <span>line: <b style={{ color: 'var(--accent)' }}>{(f.line ?? 0) + 1}</b></span>
        <span>frames: <b>{frames.length}</b></span>
      </div>
    </div>
  );
}

Lessons13["step-compare"] = function () {
  const [picked, setPicked] = useS13(["bubble", "merge", "quick"]);
  const [arr, setArr] = useS13([42, 7, 19, 88, 3, 56, 31, 64, 25, 50]);
  const [step, setStep] = useS13(0);
  const [playing, setPlaying] = useS13(false);
  const [speed, setSpeed] = useS13(1);

  // compute max frames among selected
  const lanes = picked.map(k => ({
    key: k,
    frames: (() => { try { return window.AlgorithmGenerators[k].gen(arr); } catch { return []; } })()
  }));
  const maxLen = Math.max(1, ...lanes.map(l => l.frames.length));

  useE13(() => { setStep(0); setPlaying(false); }, [arr, picked.join('|')]);

  useE13(() => {
    if (!playing) return;
    if (step >= maxLen - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => Math.min(maxLen - 1, s + 1)), 600 / speed);
    return () => clearTimeout(t);
  }, [playing, step, speed, maxLen]);

  const toggleAlgo = (k) => {
    if (picked.includes(k)) {
      if (picked.length > 1) setPicked(picked.filter(x => x !== k));
    } else if (picked.length < 4) {
      setPicked([...picked, k]);
    }
  };

  const randomize = () => {
    const n = 8 + Math.floor(Math.random() * 5);
    const a = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 5);
    setArr(a);
  };
  const sortedInput = () => setArr([5, 12, 20, 28, 35, 47, 59, 66, 78, 90]);
  const reversed = () => setArr([90, 78, 66, 59, 47, 35, 28, 20, 12, 5]);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔍 Step Compare — เปรียบเทียบทีละ step แบบ sync</div>
        เลือก algorithm หลายตัว แล้วเลื่อน timeline เดียวกัน — เห็นว่า <b>ณ step ที่ N</b> แต่ละ algo ทำอะไรอยู่
        และทำไม Merge sort ถึงเสร็จก่อน Bubble sort ทั้งๆ ที่จำนวน step "ดูเหมือนเยอะกว่า"
      </div>

      {/* Pickers */}
      <div style={{ marginTop: 18, padding: 14, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: '0.08em', marginBottom: 8 }}>ALGORITHMS (เลือก 1–4)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SORT_ALGOS.map(a => {
            const on = picked.includes(a.key);
            return (
              <button key={a.key} onClick={() => toggleAlgo(a.key)} style={{
                background: on ? a.color : 'var(--bg-2)',
                color: on ? '#0a0e14' : 'var(--text-1)',
                border: '1px solid ' + (on ? a.color : 'var(--border)'),
                padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
                fontSize: 12, fontWeight: 600,
              }}>
                {window.AlgorithmGenerators[a.key].name}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: '0.08em', margin: '14px 0 6px' }}>INPUT</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <window.ArrayInput value={arr} onChange={setArr} max={14} />
          <button className="btn btn-ghost btn-sm" onClick={randomize}>🎲 Random</button>
          <button className="btn btn-ghost btn-sm" onClick={sortedInput}>↗ Sorted</button>
          <button className="btn btn-ghost btn-sm" onClick={reversed}>↘ Reversed</button>
        </div>
      </div>

      {/* Master timeline */}
      <div style={{ marginTop: 14, padding: 14, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { setStep(0); setPlaying(false); }}>⏮ Reset</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setStep(s => Math.max(0, s - 1)); setPlaying(false); }}>◀ Back</button>
          <button className="btn btn-primary btn-sm" onClick={() => {
            if (step >= maxLen - 1) setStep(0);
            setPlaying(p => !p);
          }}>{playing ? '⏸ Pause' : '▶ Play'}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setStep(s => Math.min(maxLen - 1, s + 1)); setPlaying(false); }}>Step ▶</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setStep(maxLen - 1); setPlaying(false); }}>End ⏭</button>
          <div className="ctrl-group" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 11 }}>Speed</span>
            <input className="slider" type="range" min="0.25" max="4" step="0.25" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} />
            <span style={{ fontSize: 11, minWidth: 30 }}>{speed}x</span>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <input type="range" min="0" max={maxLen - 1} value={step}
            onChange={e => { setStep(parseInt(e.target.value)); setPlaying(false); }}
            style={{ width: '100%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-2)', marginTop: 4 }}>
            <span>step 0</span>
            <b style={{ color: 'var(--accent)' }}>{step} / {maxLen - 1}</b>
            <span>step {maxLen - 1}</span>
          </div>
        </div>
      </div>

      {/* Lanes */}
      <div style={{ marginTop: 14, display: 'grid', gap: 12, gridTemplateColumns: `repeat(${Math.min(picked.length, 2)}, minmax(0, 1fr))` }}>
        {picked.map(k => <Lane key={k} algoKey={k} input={arr} step={step} totalSync={maxLen} />)}
      </div>

      {/* Insight */}
      <div className="callout tip" style={{ marginTop: 18 }}>
        <div className="ttl">💡 อ่านยังไง</div>
        <ul style={{ margin: '4px 0', paddingLeft: 18, color: 'var(--text-1)' }}>
          <li><b>frame count</b> = จำนวน step ทั้งหมดของ algo นั้น — Bubble/Selection มักมีเยอะกว่า Merge/Quick บน input เดียวกัน</li>
          <li><b>แท่งใต้ชื่อ</b> = สัดส่วน frames เทียบกับ algo ที่ยาวสุด — เห็นชัดว่าใครจบเร็ว</li>
          <li><b>cmp / swap counter</b> = ตัวเลขที่ Big-O วัด — ลอง input <i>Sorted</i> ดู แล้วเทียบ Insertion (น้อยมาก) vs Bubble (ปกติ)</li>
        </ul>
      </div>

      <h3 style={{ marginTop: 28 }}>โจทย์สังเกต</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>ลอง input <b>Sorted</b> — algo ไหนจบใน step น้อยที่สุด? (ฮินต์: Insertion Sort)</li>
        <li>ลอง input <b>Reversed</b> — ทำไม Quick Sort ถึง degrade?</li>
        <li>ที่ <b>step เดียวกัน</b> Merge sort กับ Bubble sort ทำอะไรต่างกัน?</li>
      </ol>
    </React.Fragment>
  );
};


/* ============================================================
   2)  CODE BRIDGE — write JS, run it, drive the animation
============================================================ */

const STARTER_TEMPLATES = {
  bubble: `// Bubble Sort — เปรียบเทียบทีละคู่ แล้ว swap ถ้าผิดลำดับ
// ใช้ cmp(i, j) → คืนค่าผลเปรียบเทียบ + emit frame
// ใช้ swap(i, j) → สลับ + emit frame
// ใช้ note("ข้อความ") → จด comment บน timeline (optional)
function sort(a) {
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (cmp(j, j + 1) > 0) {
        swap(j, j + 1);
      }
    }
    note("รอบ " + (i+1) + " เสร็จ — ตัวใหญ่สุดไปอยู่ขวาแล้ว");
  }
}`,

  selection: `// Selection Sort — หาตัวน้อยสุดในส่วนที่เหลือ แล้วเอามาไว้หน้า
function sort(a) {
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (cmp(j, minIdx) < 0) {
        minIdx = j;
      }
    }
    if (minIdx !== i) swap(i, minIdx);
  }
}`,

  insertion: `// Insertion Sort — แทรกเข้าตำแหน่งที่ถูก เหมือนเรียงไพ่
function sort(a) {
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && cmp(j - 1, j) > 0) {
      swap(j - 1, j);
      j--;
    }
  }
}`,

  custom: `// เขียน sort algorithm ของคุณเอง!
// API:
//   cmp(i, j)   → -1 / 0 / 1   (ทำหน้าที่เป็น comparison + record)
//   swap(i, j)  → สลับสองช่อง  (record swap)
//   get(i)      → อ่านค่า (ไม่นับเป็น comparison)
//   set(i, v)   → เขียนค่า (เช่นใช้ใน merge / counting sort)
//   note(text)  → จด annotation
//   mark(i, "compare"|"swap"|"sorted"|"cursor"|"pivot")
//   commit()    → emit frame เพิ่ม โดยไม่ทำ op (ไว้ debug)

function sort(a) {
  // ลองเขียน Gnome Sort:
  let i = 0;
  while (i < a.length) {
    if (i === 0 || cmp(i - 1, i) <= 0) {
      i++;
    } else {
      swap(i - 1, i);
      i--;
    }
  }
}`,
};

function runUserSort(code, input) {
  const a = [...input];
  const frames = [];
  let comparisons = 0, swaps = 0;
  let pendingNote = null;

  const emit = (marks, extra) => {
    frames.push({
      arr: [...a],
      marks: { ...marks },
      vars: { comparisons, swaps, ...(extra || {}) },
      note: pendingNote,
    });
    pendingNote = null;
  };

  const api = {
    cmp: (i, j) => {
      comparisons++;
      emit({ [i]: 'compare', [j]: 'compare' }, { cmp: `a[${i}]=${a[i]} vs a[${j}]=${a[j]}` });
      return a[i] < a[j] ? -1 : a[i] > a[j] ? 1 : 0;
    },
    swap: (i, j) => {
      emit({ [i]: 'swap', [j]: 'swap' }, { op: `swap(${i},${j})` });
      [a[i], a[j]] = [a[j], a[i]];
      swaps++;
      emit({ [i]: 'swap', [j]: 'swap' }, { op: `swap(${i},${j})` });
    },
    get: (i) => a[i],
    set: (i, v) => {
      a[i] = v;
      emit({ [i]: 'cursor' }, { op: `a[${i}]=${v}` });
    },
    note: (text) => { pendingNote = String(text); },
    mark: (i, kind) => emit({ [i]: kind }, {}),
    commit: () => emit({}, {}),
  };

  emit({}, {}); // initial frame

  // hard limits to keep things responsive
  let stepCount = 0;
  const limit = 5000;
  const origPush = frames.push;
  frames.push = function(...args) {
    if (frames.length > limit) throw new Error(`เกินขีดจำกัด ${limit} frames — มี infinite loop หรือเปล่า?`);
    return origPush.apply(this, args);
  };

  try {
    const fn = new Function('a', 'cmp', 'swap', 'get', 'set', 'note', 'mark', 'commit', code + '\nreturn sort(a);');
    fn(a, api.cmp, api.swap, api.get, api.set, api.note, api.mark, api.commit);
  } catch (e) {
    return { error: e.message || String(e), frames };
  }

  // final frame — all sorted check
  const isSorted = a.every((v, i) => i === 0 || a[i - 1] <= v);
  const finalMarks = {};
  for (let i = 0; i < a.length; i++) finalMarks[i] = isSorted ? 'sorted' : 'dim';
  frames.push = origPush;
  frames.push({ arr: [...a], marks: finalMarks, vars: { comparisons, swaps, final: isSorted ? '✓ SORTED' : '✗ NOT SORTED' } });
  return { frames, isSorted, comparisons, swaps };
}

Lessons13["code-bridge"] = function () {
  const [tplKey, setTplKey] = useS13('bubble');
  const [code, setCode] = useS13(STARTER_TEMPLATES.bubble);
  const [arr, setArr] = useS13([42, 7, 19, 88, 3, 56, 31, 64]);
  const [running, setRunning] = useS13(null);
  const [step, setStep] = useS13(0);
  const [playing, setPlaying] = useS13(false);
  const [speed, setSpeed] = useS13(1);
  const editorRef = useR13(null);

  const loadTemplate = (k) => {
    setTplKey(k);
    setCode(STARTER_TEMPLATES[k]);
    setRunning(null);
    setStep(0);
  };

  const run = () => {
    const r = runUserSort(code, arr);
    setRunning(r);
    setStep(0);
    setPlaying(false);
  };

  useE13(() => {
    if (!playing || !running) return;
    if (step >= running.frames.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => Math.min(running.frames.length - 1, s + 1)), 500 / speed);
    return () => clearTimeout(t);
  }, [playing, step, speed, running]);

  const f = running && running.frames[step];

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">💻 Code → Animation Bridge</div>
        เขียน sort algorithm ของคุณเอง (JavaScript) แล้วกดรัน — โค้ดจะถูกขับเคลื่อน animation เดียวกับในบทเรียน
        ใช้ <code>cmp(i,j)</code>, <code>swap(i,j)</code>, <code>note(...)</code> เพื่อให้ระบบ record ทุก step
      </div>

      {/* Templates */}
      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: '0.08em', marginRight: 4 }}>TEMPLATE</span>
        {Object.keys(STARTER_TEMPLATES).map(k => (
          <button key={k} onClick={() => loadTemplate(k)} style={{
            background: tplKey === k ? 'var(--accent)' : 'var(--bg-2)',
            color: tplKey === k ? '#0a0e14' : 'var(--text-1)',
            border: '1px solid ' + (tplKey === k ? 'var(--accent)' : 'var(--border)'),
            padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
            textTransform: 'capitalize',
          }}>{k}</button>
        ))}
      </div>

      {/* Editor */}
      <div style={{ marginTop: 12, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border-soft)', background: 'var(--bg-2)' }}>
          <span style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>your-sort.js</span>
          <div style={{ flex: 1 }}></div>
          <window.ArrayInput value={arr} onChange={setArr} max={14} />
          <button className="btn btn-primary btn-sm" style={{ marginLeft: 8 }} onClick={run}>▶ Run</button>
        </div>
        <textarea
          ref={editorRef}
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          style={{
            width: '100%', minHeight: 280,
            background: 'transparent', color: 'var(--text-0)',
            border: 'none', outline: 'none',
            padding: 14, fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.6,
            resize: 'vertical', tabSize: 2,
          }}
        />
      </div>

      {/* Result */}
      {running && running.error && (
        <div className="callout warn" style={{ marginTop: 14 }}>
          <div className="ttl">⚠️ Runtime error</div>
          <pre style={{ margin: 0, fontSize: 12, color: 'var(--danger)' }}>{running.error}</pre>
        </div>
      )}

      {running && running.frames && running.frames.length > 1 && (
        <div style={{ marginTop: 14, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-soft)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setStep(0); setPlaying(false); }}>⏮</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setStep(s => Math.max(0, s - 1)); setPlaying(false); }}>◀</button>
            <button className="btn btn-primary btn-sm" onClick={() => {
              if (step >= running.frames.length - 1) setStep(0);
              setPlaying(p => !p);
            }}>{playing ? '⏸' : '▶'}</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setStep(s => Math.min(running.frames.length - 1, s + 1)); setPlaying(false); }}>▶|</button>
            <div className="ctrl-group" style={{ marginLeft: 8 }}>
              <span style={{ fontSize: 11 }}>Speed</span>
              <input className="slider" type="range" min="0.25" max="4" step="0.25" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} />
              <span style={{ fontSize: 11, minWidth: 30 }}>{speed}x</span>
            </div>
            <div style={{ flex: 1 }}></div>
            <span style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>step {step + 1} / {running.frames.length}</span>
          </div>

          {/* Stage */}
          <div style={{ padding: '20px 18px' }}>
            <MiniBars data={f.arr} marks={f.marks} accent="#7dd3fc" />
            {f.note && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(167,139,250,0.08)', borderLeft: '2px solid var(--accent-2)', fontSize: 12, color: 'var(--text-1)', fontStyle: 'italic' }}>
                💬 {f.note}
              </div>
            )}
          </div>

          {/* Scrubber */}
          <div style={{ padding: '4px 14px 10px' }}>
            <input type="range" min="0" max={running.frames.length - 1} value={step}
              onChange={e => { setStep(parseInt(e.target.value)); setPlaying(false); }}
              style={{ width: '100%' }} />
          </div>

          {/* Vars */}
          <div style={{ padding: '8px 14px 14px', borderTop: '1px solid var(--border-soft)', display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-2)' }}>
            {Object.entries(f.vars || {}).map(([k, v]) => (
              <span key={k}>{k}: <b style={{ color: 'var(--text-0)' }}>{String(v)}</b></span>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {running && !running.error && (
        <div className={"callout " + (running.isSorted ? 'success' : 'warn')} style={{ marginTop: 14 }}>
          <div className="ttl">{running.isSorted ? '✓ Sorted correctly' : '✗ Array ยังไม่ sorted!'}</div>
          ใช้ <b>{running.comparisons}</b> comparisons, <b>{running.swaps}</b> swaps,
          ทั้งหมด <b>{running.frames.length}</b> frames
          {running.isSorted ? ' — ลอง input อื่น / template อื่นต่อ' : ' — เช็ค logic อีกที'}
        </div>
      )}

      <h3 style={{ marginTop: 28 }}>API Reference</h3>
      <table className="cmp">
        <thead><tr><th>Function</th><th>ทำอะไร</th></tr></thead>
        <tbody>
          <tr><td className="mono">cmp(i, j)</td><td>เปรียบเทียบ a[i] กับ a[j] → -1 / 0 / 1 (record เป็น compare frame)</td></tr>
          <tr><td className="mono">swap(i, j)</td><td>สลับสองช่อง + record</td></tr>
          <tr><td className="mono">get(i)</td><td>อ่านค่า ไม่นับ comparison (เช่นใช้ดึง pivot)</td></tr>
          <tr><td className="mono">set(i, v)</td><td>เขียนค่า (สำหรับ merge / counting / shift)</td></tr>
          <tr><td className="mono">note("...")</td><td>annotate frame ถัดไปด้วยข้อความ</td></tr>
          <tr><td className="mono">mark(i, kind)</td><td>highlight ช่อง — kind = compare/swap/sorted/cursor/pivot</td></tr>
          <tr><td className="mono">commit()</td><td>emit frame เปล่า (debug)</td></tr>
        </tbody>
      </table>

      <div className="callout warn" style={{ marginTop: 14 }}>
        <div className="ttl">⚠️ ข้อจำกัด</div>
        โค้ดถูกรันใน sandbox — มี frame limit ที่ 5000 (กัน infinite loop) ห้ามใช้ <code>fetch</code> / <code>setTimeout</code> /
        access globals ภายนอก
      </div>
    </React.Fragment>
  );
};


/* ============================================================
   3)  PROOF VISUALIZER — animated proofs of complexity
============================================================ */

/* --- 3a) Binary Search = O(log₂ n) --- */
function ProofBinarySearch() {
  const [n, setN] = useS13(64);
  const [steps, setSteps] = useS13(0);
  const [auto, setAuto] = useS13(false);

  const halves = useM13(() => {
    const out = [{ size: n, k: 0 }];
    let s = n;
    while (s > 1) { s = Math.floor(s / 2); out.push({ size: s, k: out.length }); }
    return out;
  }, [n]);

  useE13(() => { setSteps(0); }, [n]);
  useE13(() => {
    if (!auto) return;
    if (steps >= halves.length - 1) { setAuto(false); return; }
    const t = setTimeout(() => setSteps(s => s + 1), 600);
    return () => clearTimeout(t);
  }, [auto, steps, halves]);

  const cur = halves[steps];
  const log2 = Math.log2(n);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>n =</span>
        <input type="range" min="4" max="1024" step="4" value={n}
               onChange={e => setN(parseInt(e.target.value))}
               style={{ width: 200 }} />
        <b style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>{n}</b>
        <button className="btn btn-ghost btn-sm" onClick={() => { setSteps(0); setAuto(true); }}>▶ Halve until 1</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setSteps(s => Math.min(halves.length - 1, s + 1))}>Step</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setSteps(0)}>Reset</button>
      </div>

      {/* Bar diagram showing range halving */}
      <div style={{ background: 'var(--bg-0)', border: '1px solid var(--border-soft)', borderRadius: 10, padding: 16 }}>
        {halves.slice(0, steps + 1).map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)', minWidth: 50 }}>k = {h.k}</span>
            <div style={{
              height: 22,
              width: `${(h.size / n) * 100}%`,
              minWidth: 4,
              background: i === steps
                ? 'linear-gradient(90deg, var(--accent), var(--accent-2))'
                : 'var(--bg-3)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              paddingRight: 8,
              color: i === steps ? '#0a0e14' : 'var(--text-1)',
              fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
              transition: 'width .35s',
            }}>{h.size}</div>
            {i === steps && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent-2)' }}>
                = n / 2<sup>{h.k}</sup> = {n} / {Math.pow(2, h.k)}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: 14, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.9 }}>
        <div style={{ color: 'var(--text-2)' }}>// proof</div>
        <div>หลัง k iterations, ขนาดช่วงเหลือ = <b style={{ color: 'var(--accent)' }}>n / 2<sup>k</sup></b></div>
        <div>หยุดเมื่อ n / 2<sup>k</sup> ≤ 1  ⇔  2<sup>k</sup> ≥ n  ⇔  <b style={{ color: 'var(--accent-2)' }}>k ≥ log₂ n</b></div>
        <div>∴ จำนวน iterations สูงสุด = <b style={{ color: 'var(--accent-3)' }}>⌈log₂ {n}⌉ = {Math.ceil(log2)}</b></div>
        <div style={{ marginTop: 8, color: 'var(--text-2)' }}>// ที่ใช้จริง: {steps} step{steps !== 1 ? 's' : ''}</div>
      </div>
    </div>
  );
}

/* --- 3b) Merge Sort recurrence tree = O(n log n) --- */
function ProofMergeSort() {
  const [n, setN] = useS13(16);
  const [level, setLevel] = useS13(0);
  const levels = Math.ceil(Math.log2(n));

  useE13(() => { setLevel(0); }, [n]);

  // generate tree rows
  const rows = [];
  for (let L = 0; L <= levels; L++) {
    const nodes = Math.pow(2, L);
    const nodeSize = n / nodes;
    rows.push({ L, nodes, nodeSize, work: n });
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>n =</span>
        {[8, 16, 32, 64].map(v => (
          <button key={v} onClick={() => setN(v)} className="btn btn-ghost btn-sm"
                  style={{ background: n === v ? 'var(--accent)' : '', color: n === v ? '#0a0e14' : '' }}>{v}</button>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setLevel(l => Math.min(levels, l + 1))}>Expand ↓</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setLevel(0)}>Collapse</button>
        <button className="btn btn-primary btn-sm" onClick={() => setLevel(levels)}>Show all</button>
      </div>

      {/* Tree visualization */}
      <div style={{ background: 'var(--bg-0)', border: '1px solid var(--border-soft)', borderRadius: 10, padding: 18 }}>
        {rows.slice(0, level + 1).map(r => (
          <div key={r.L} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)', minWidth: 70 }}>Level {r.L}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-2)' }}>
                {r.nodes} nodes × size {r.nodeSize} = <b style={{ color: 'var(--accent-3)' }}>{r.nodes * r.nodeSize} = n work</b>
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: r.nodes }, (_, i) => (
                <div key={i} style={{
                  flex: 1, minWidth: 8,
                  height: 26,
                  background: r.L === level
                    ? 'linear-gradient(180deg, var(--accent), var(--accent-2))'
                    : 'var(--bg-3)',
                  borderRadius: 4,
                  display: 'grid', placeItems: 'center',
                  color: r.L === level ? '#0a0e14' : 'var(--text-2)',
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600,
                  transition: 'background .3s',
                }}>{r.nodeSize >= 2 ? r.nodeSize : ''}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: 14, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.9 }}>
        <div style={{ color: 'var(--text-2)' }}>// proof</div>
        <div>แต่ละ level มี work รวม = <b style={{ color: 'var(--accent-3)' }}>n</b> (เพราะ merge ทุก node รวมกันแตะทุกตัวพอดี 1 ครั้ง)</div>
        <div>จำนวน level = <b style={{ color: 'var(--accent-2)' }}>log₂ {n} = {Math.log2(n)}</b> (เพราะแบ่งครึ่งทุกครั้ง)</div>
        <div>Total = <b style={{ color: 'var(--accent)' }}>n × log n = {n} × {Math.log2(n)} = {n * Math.log2(n)}</b></div>
        <div style={{ marginTop: 6 }}>∴ T(n) = <b style={{ color: 'var(--accent)' }}>O(n log n)</b></div>
      </div>
    </div>
  );
}

/* --- 3c) Master Theorem cases --- */
function ProofMasterTheorem() {
  const [a, setA] = useS13(2);
  const [b, setB] = useS13(2);
  const [d, setD] = useS13(1);

  const logBa = Math.log(a) / Math.log(b);
  let kase, kaseText, result;
  if (Math.abs(logBa - d) < 0.001) {
    kase = 2; kaseText = "Case 2: balanced — log_b(a) = d";
    result = `O(n^${d} · log n) = O(n^${d} log n)`;
  } else if (logBa < d) {
    kase = 3; kaseText = "Case 3: root dominates — log_b(a) < d";
    result = `O(n^${d})`;
  } else {
    kase = 1; kaseText = "Case 1: leaves dominate — log_b(a) > d";
    result = `O(n^log_b(a)) ≈ O(n^${logBa.toFixed(3)})`;
  }

  // Compute work per level for visualization
  const levels = 5;
  const n = Math.pow(b, levels); // so we can show nice sizes
  const rows = [];
  for (let L = 0; L <= levels; L++) {
    const nodes = Math.pow(a, L);
    const sz = n / Math.pow(b, L);
    const work = nodes * Math.pow(sz, d);
    rows.push({ L, nodes, sz, work });
  }
  const maxWork = Math.max(...rows.map(r => r.work));

  return (
    <div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        <div className="ctrl-group">
          <span style={{ fontSize: 11 }}>a (branches)</span>
          <input type="number" value={a} min="1" max="9" onChange={e => setA(parseInt(e.target.value) || 1)} style={{ width: 50 }} />
        </div>
        <div className="ctrl-group">
          <span style={{ fontSize: 11 }}>b (shrink)</span>
          <input type="number" value={b} min="2" max="9" onChange={e => setB(parseInt(e.target.value) || 2)} style={{ width: 50 }} />
        </div>
        <div className="ctrl-group">
          <span style={{ fontSize: 11 }}>d (work exponent)</span>
          <input type="number" value={d} min="0" max="4" step="0.5" onChange={e => setD(parseFloat(e.target.value) || 0)} style={{ width: 60 }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { setA(2); setB(2); setD(1); }}>Merge sort (2,2,1)</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setA(8); setB(2); setD(2); }}>Naive matrix (8,2,2)</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setA(7); setB(2); setD(2); }}>Strassen (7,2,2)</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setA(1); setB(2); setD(0); }}>Binary search (1,2,0)</button>
        </div>
      </div>

      <div style={{ padding: '10px 14px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 14, marginBottom: 14 }}>
        T(n) = <b style={{ color: 'var(--accent)' }}>{a}</b>·T(n/<b style={{ color: 'var(--accent-2)' }}>{b}</b>) + O(n<sup style={{ color: 'var(--accent-3)' }}>{d}</sup>)
        <span style={{ marginLeft: 14, color: 'var(--text-2)' }}>log_b(a) = log<sub>{b}</sub>({a}) = <b style={{ color: 'var(--warn)' }}>{logBa.toFixed(3)}</b></span>
      </div>

      {/* Work per level */}
      <div style={{ background: 'var(--bg-0)', border: '1px solid var(--border-soft)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 10 }}>WORK PER LEVEL (ขนาด bar = สัดส่วน work ของ level นั้น)</div>
        {rows.map(r => {
          const pct = (r.work / maxWork) * 100;
          return (
            <div key={r.L} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-3)', minWidth: 56 }}>L={r.L}</span>
              <div style={{ flex: 1, height: 22, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  width: pct + '%',
                  height: '100%',
                  background: kase === 1 && r.L === levels
                    ? 'linear-gradient(90deg, var(--accent-3), var(--accent))'
                    : kase === 3 && r.L === 0
                    ? 'linear-gradient(90deg, var(--danger), var(--warn))'
                    : 'linear-gradient(90deg, var(--accent-2), var(--accent))',
                  transition: 'width .35s',
                }}></div>
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-2)', minWidth: 140, textAlign: 'right' }}>
                {r.nodes} × ({r.sz.toFixed(1)})<sup>{d}</sup> ≈ {r.work.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      <div className={"callout " + (kase === 2 ? 'info' : kase === 1 ? 'success' : 'warn')} style={{ marginTop: 14 }}>
        <div className="ttl">📐 {kaseText}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 14 }}>
          T(n) = <b style={{ color: 'var(--accent)' }}>{result}</b>
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-1)' }}>
          {kase === 1 && '👇 work รวมที่ leaves (level ลึกสุด) มากกว่าด้านบน → leaves dominate → answer = n^log_b(a)'}
          {kase === 2 && '⚖️ work รวมเท่ากันทุก level → คูณด้วย log n → answer = n^d · log n'}
          {kase === 3 && '👆 work รวมที่ root มากกว่าด้านล่าง → root dominates → answer = n^d'}
        </div>
      </div>
    </div>
  );
}

/* Main proof viz lesson */
Lessons13["proof-viz"] = function ({ initialTab } = {}) {
  const [tab, setTab] = useS13(initialTab || 'binary');
  const tabs = [
    { key: 'binary', label: '🔍 Binary Search = O(log n)' },
    { key: 'merge',  label: '🌲 Merge Sort = O(n log n)' },
    { key: 'master', label: '📐 Master Theorem (3 cases)' },
  ];
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🧠 Proof Visualizer — เห็นที่มาของ Big-O</div>
        ส่วนใหญ่เราจำผลลัพธ์ (Binary Search = O(log n)) แต่ไม่เห็นที่มา — หน้านี้ animate proof ทีละ step
        ให้เห็นว่า "ทำไม" มันถึงเป็นแบบนั้นจริงๆ
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 4, borderBottom: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: tab === t.key ? 'var(--bg-1)' : 'transparent',
            color: tab === t.key ? 'var(--accent)' : 'var(--text-2)',
            border: 'none',
            borderBottom: '2px solid ' + (tab === t.key ? 'var(--accent)' : 'transparent'),
            padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            fontFamily: 'inherit',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        {tab === 'binary' && <ProofBinarySearch />}
        {tab === 'merge' && <ProofMergeSort />}
        {tab === 'master' && <ProofMasterTheorem />}
      </div>

      <h3 style={{ marginTop: 32 }}>ทำไมต้องเรียน proof?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>ตอบข้อสอบเก่ง</b> — โจทย์ "วิเคราะห์ T(n) = …" ต้องเห็นภาพ recursion tree ในหัว</li>
        <li><b>ออกแบบ algorithm ใหม่</b> — รู้ว่าจะลด work ที่ level ไหน (Strassen ลด a จาก 8 → 7 ที่ level เดียวกัน)</li>
        <li><b>กันลืม</b> — ผลลัพธ์จะติดถาวรเมื่อเข้าใจที่มา ไม่ใช่แค่ท่อง</li>
      </ul>
    </React.Fragment>
  );
};


// Part 13 — embed-only tools (proof-viz, step-compare, code-bridge)
// ไม่ expose ผ่าน window.LessonsPart13 เพื่อไม่ให้ app.jsx routing chain เจอ
// — กัน user เข้า /step-compare ตรงๆ แล้วเจอหน้าเปล่า
// embed13() ใช้ closure ของ Lessons13 ภายใน ไม่ต้องผ่าน window


/* ============================================================
   EMBED these tools into existing relevant lessons (not as separate sidebar entries)
============================================================ */
function embed13(lessonKey, items) {
  // items: [{ id, label, only? }]  — only filters which tab of proof-viz to show (optional)
  // ค้นใน part 1-31 ทั้งหมด เพื่อรองรับการย้ายบทเรียน
  const PARTS = Array.from({ length: 31 }, (_, i) => 'LessonsPart' + (i + 1));
  let lib = null;
  for (const k of PARTS) {
    if (window[k] && window[k][lessonKey]) { lib = k; break; }
  }
  if (!lib) return;
  const Original = window[lib][lessonKey];

  const Wrapped = function () {
    const [open, setOpen] = useS13(null);
    return (
      <React.Fragment>
        <Original />
        <div style={{
          marginTop: 36, padding: 18,
          background: 'linear-gradient(135deg, rgba(94,234,212,0.04), rgba(168,139,250,0.04))',
          border: '1px solid var(--border)', borderRadius: 14
        }}>
          <div style={{ fontSize: 11, color: 'var(--accent-2)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>
            ✨ INTERACTIVE TOOLS — ที่เกี่ยวกับบทนี้
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>
            กดเปิดเพื่อทดลองสด ๆ
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(item => {
              const Comp = Lessons13[item.id];
              if (!Comp) return null;
              const isOpen = open === item.id;
              return (
                <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-1)' }}>
                  <button onClick={() => setOpen(isOpen ? null : item.id)} style={{
                    width: '100%', textAlign: 'left',
                    background: isOpen ? 'var(--bg-3)' : 'transparent',
                    color: 'var(--text-0)', border: 'none',
                    padding: '12px 14px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: 14, fontWeight: 500,
                  }}>
                    <span>{item.label}</span>
                    <span style={{ color: 'var(--text-2)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>▶</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: 14, borderTop: '1px solid var(--border)' }}>
                      <Comp initialTab={item.only} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </React.Fragment>
    );
  };
  window[lib][lessonKey] = Wrapped;
}

setTimeout(() => {
  // Proof Visualizer → ลงในบทที่เกี่ยว Big-O & complexity
  embed13('big-o', [
    { id: 'proof-viz', label: '🧠 Proof Visualizer — ที่มาของ Big-O' },
  ]);
  embed13('master-theorem', [
    { id: 'proof-viz', label: '🧠 Proof Visualizer — โดยเฉพาะ Master Theorem 3 cases', only: 'master' },
  ]);
  embed13('binary-search', [
    { id: 'proof-viz', label: '🧠 ทำไม Binary Search ถึง O(log n)?', only: 'binary' },
  ]);
  embed13('merge-sort', [
    { id: 'proof-viz', label: '🧠 ทำไม Merge Sort ถึง O(n log n)?', only: 'merge' },
    { id: 'step-compare', label: '🔍 Step Compare — เทียบ Merge กับ algorithm อื่น sync timeline เดียว' },
  ]);

  // Step Compare → ลงในบทที่เกี่ยวการเปรียบเทียบ algorithm
  embed13('compare', [
    { id: 'step-compare', label: '🔍 Step Compare — sync timeline (อัปเกรดจาก Compare Mode)' },
  ]);
  ['bubble-sort', 'quick-sort', 'heap-sort', 'selection-sort', 'insertion-sort'].forEach(id => {
    embed13(id, [
      { id: 'step-compare', label: '🔍 Step Compare — sync timeline กับ algo อื่น' },
    ]);
  });

  // Code Bridge → ลงในบทที่ให้ทดลองเขียน
  embed13('playground', [
    { id: 'code-bridge', label: '💻 Code → Animation Bridge — เขียน sort JS ของคุณเอง' },
  ]);
  embed13('sandbox', [
    { id: 'code-bridge', label: '💻 Code → Animation Bridge (JS, animate ได้)' },
  ]);
}, 30);

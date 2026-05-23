/* Lessons Part 12 — Polish: AskAI floating, embedded tools, design refresh */

const { useState: useS12, useEffect: useE12, useRef: useR12 } = React;

/* ============================================================
   ASK AI — floating button + chat popup
============================================================ */
function AskAI() {
  // Disable entirely when running outside claude.ai (no LLM available on
  // a static host like GitHub Pages). The whole floating button is hidden
  // so the rest of the site stays clean.
  if (typeof window.claude?.complete !== 'function') return null;

  const route = window.location.hash.replace(/^#\/?/, '') || 'home';
  const [open, setOpen] = useS12(false);
  const [input, setInput] = useS12('');
  const [chat, setChat] = useS12([]);
  const [loading, setLoading] = useS12(false);
  const endRef = useR12(null);

  useE12(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' }); }, [chat, loading]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const lesson = (window.ALL_LESSONS || []).find(l => l.id === route);
    const ctx = lesson ? `\n(บทเรียนปัจจุบัน: ${lesson.title} — ${lesson.desc})\n` : '';
    setChat(c => [...c, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const sys = `คุณคือติวเตอร์อัลกอริทึมภาษาไทย เป็นมิตร อธิบายกระชับ ตรงประเด็น ไม่เกิน 200 คำ ใช้ markdown ได้ (**bold** \`code\` \`\`\`block\`\`\`)${ctx}`;
      const r = await window.claude.complete(sys + '\n\nคำถาม: ' + text);
      setChat(c => [...c, { role: 'assistant', content: r }]);
    } catch (e) {
      setChat(c => [...c, { role: 'assistant', content: '⚠️ ' + (e.message || e) }]);
    }
    setLoading(false);
  };

  const renderMd = (txt) => {
    // simple markdown: **bold**, `inline`, ```block```
    const out = [];
    let i = 0, key = 0;
    const parts = txt.split(/(```[\s\S]*?```)/g);
    for (const part of parts) {
      if (part.startsWith('```')) {
        const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
        out.push(<pre key={key++} style={{ background: '#0a0e14', padding: 10, borderRadius: 6, fontSize: 12, overflow: 'auto', margin: '6px 0' }}><code>{code}</code></pre>);
      } else {
        const segs = part.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        out.push(<span key={key++}>{segs.map((s, j) => {
          if (s.startsWith('**')) return <b key={j}>{s.slice(2, -2)}</b>;
          if (s.startsWith('`')) return <code key={j} style={{ background: 'rgba(94,234,212,0.1)', padding: '1px 5px', borderRadius: 3, fontSize: 12 }}>{s.slice(1, -1)}</code>;
          return s;
        })}</span>);
      }
    }
    return out;
  };

  return (
    <React.Fragment>
      {/* Floating button */}
      <button onClick={() => setOpen(!open)} title="ถาม AI"
        style={{
          position: 'fixed', right: 20, bottom: 20, zIndex: 150,
          background: open ? 'var(--bg-2)' : 'linear-gradient(135deg, #5eead4, #a78bfa)',
          color: open ? 'var(--text-1)' : '#0a0e14',
          border: '1px solid ' + (open ? 'var(--border)' : 'transparent'),
          padding: '12px 18px', borderRadius: 24, cursor: 'pointer',
          fontWeight: 600, fontSize: 14, fontFamily: 'inherit',
          boxShadow: open ? '0 4px 12px rgba(0,0,0,0.3)' : '0 8px 28px rgba(167,139,250,0.45)',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'all .2s'
        }}>
        {open ? '✕' : '🤖'} <span>{open ? 'ปิด' : 'ถาม AI'}</span>
      </button>

      {open && (
        <div style={{
          position: 'fixed', right: 20, bottom: 76, zIndex: 150,
          width: 'min(420px, calc(100vw - 40px))', height: 'min(560px, calc(100vh - 120px))',
          background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 14,
          boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-2)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #5eead4, #a78bfa)', display: 'grid', placeItems: 'center', fontSize: 16 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>ติวเตอร์ AI</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>ถามอะไรเกี่ยวกับ algorithm ก็ได้</div>
            </div>
            {chat.length > 0 && (
              <button onClick={() => setChat([])} title="ล้าง"
                style={{ background: 'transparent', color: 'var(--text-2)', border: 'none', padding: 6, cursor: 'pointer', fontSize: 14 }}>🗑</button>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
            {chat.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 40 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
                <div style={{ color: 'var(--text-1)', fontWeight: 500, marginBottom: 16 }}>ลองถาม:</div>
                {[
                  'อธิบาย Big-O แบบง่าย',
                  'เลือก algorithm ใน graph ยังไง?',
                  'ทำไม Quick sort ถึง worst O(n²)?',
                  route !== 'home' ? 'อธิบายบทนี้ให้ฟัง' : null,
                ].filter(Boolean).map((p, i) => (
                  <button key={i} onClick={() => send(p)}
                    style={{ display: 'block', width: '100%', textAlign: 'left', background: 'var(--bg-2)', color: 'var(--text-1)', border: '1px solid var(--border)', padding: 10, borderRadius: 8, cursor: 'pointer', marginBottom: 6, fontSize: 13 }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
            {chat.map((m, i) => (
              <div key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  background: m.role === 'user' ? 'linear-gradient(135deg, #5eead4, #7dd3fc)' : 'var(--bg-2)',
                  color: m.role === 'user' ? '#0a0e14' : 'var(--text-0)',
                  padding: '10px 12px', borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                  border: m.role === 'assistant' ? '1px solid var(--border)' : 'none'
                }}>
                  {m.role === 'user' ? m.content : renderMd(m.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 4, padding: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-2)', animation: 'pulse 1.4s infinite' }}></span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-2)', animation: 'pulse 1.4s infinite .2s' }}></span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-2)', animation: 'pulse 1.4s infinite .4s' }}></span>
              </div>
            )}
            <div ref={endRef}></div>
          </div>

          {/* Input */}
          <div style={{ padding: 12, borderTop: '1px solid var(--border)', background: 'var(--bg-2)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                placeholder="พิมพ์คำถาม..."
                style={{ flex: 1, padding: '10px 12px', fontSize: 13, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <button onClick={() => send(input)} disabled={loading || !input.trim()}
                style={{ background: 'linear-gradient(135deg, #5eead4, #a78bfa)', color: '#0a0e14', border: 'none', padding: '10px 14px', borderRadius: 8, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: loading || !input.trim() ? 0.4 : 1 }}>
                ↑
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </React.Fragment>
  );
}

window.AskAI = AskAI;

/* ============================================================
   Reposition floating widgets: stack vertically right side
============================================================ */
// Override NotesPanel position to align with new layout
const _origNotes = window.NotesPanel;
window.NotesPanel = function () {
  const route = window.location.hash.replace(/^#\/?/, '') || 'home';
  const [notes, setNotes] = useS12(() => {
    try { return JSON.parse(localStorage.getItem('algo-notes') || '{}'); } catch { return {}; }
  });
  const [open, setOpen] = useS12(false);
  const text = notes[route] || '';
  const save = (v) => {
    const next = { ...notes, [route]: v };
    setNotes(next);
    localStorage.setItem('algo-notes', JSON.stringify(next));
  };
  if (route === 'home') return null;
  return (
    <React.Fragment>
      <button onClick={() => setOpen(!open)} title="โน้ตของบทนี้"
        style={{
          position: 'fixed', right: 20, bottom: 80, zIndex: 100,
          background: open ? '#fbbf24' : 'var(--bg-2)',
          color: open ? '#000' : 'var(--text-1)',
          border: '1px solid ' + (open ? '#fbbf24' : 'var(--border)'),
          width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 18,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'grid', placeItems: 'center',
          transition: 'all .15s'
        }}>
        {text ? '📝' : '📄'}
      </button>
      {open && (
        <div style={{ position: 'fixed', right: 76, bottom: 80, zIndex: 100, width: 360, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, boxShadow: '0 16px 36px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--accent-2)', fontWeight: 700, letterSpacing: '0.06em' }}>📝 NOTES · {route}</span>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
          <textarea value={text} onChange={e => save(e.target.value)}
            placeholder="โน้ตของคุณ — auto save"
            style={{ width: '100%', height: 200, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, fontSize: 13, fontFamily: 'monospace', resize: 'vertical' }} />
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>💾 {text.length} chars</div>
        </div>
      )}
    </React.Fragment>
  );
};

// Override Bookmark position
window.Bookmark = function () {
  const route = window.location.hash.replace(/^#\/?/, '') || 'home';
  const [bm, setBm] = useS12(() => {
    try { return JSON.parse(localStorage.getItem('algo-bookmarks') || '[]'); } catch { return []; }
  });
  if (route === 'home') return null;
  const isMarked = bm.includes(route);
  const toggle = () => {
    const next = isMarked ? bm.filter(x => x !== route) : [...bm, route];
    setBm(next);
    localStorage.setItem('algo-bookmarks', JSON.stringify(next));
  };
  return (
    <button onClick={toggle} title={isMarked ? 'เอาออก' : 'Bookmark'}
      style={{
        position: 'fixed', right: 20, bottom: 132, zIndex: 100,
        background: isMarked ? '#fbbf24' : 'var(--bg-2)',
        color: isMarked ? '#000' : 'var(--text-1)',
        border: '1px solid ' + (isMarked ? '#fbbf24' : 'var(--border)'),
        width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 18,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'grid', placeItems: 'center',
        transition: 'all .15s'
      }}>
      {isMarked ? '⭐' : '☆'}
    </button>
  );
};

// Search hint button (Cmd+K)
window.SearchHint = function () {
  const [hover, setHover] = useS12(false);
  return (
    <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      title="ค้นหา (Cmd+K)"
      style={{
        position: 'fixed', right: 20, bottom: 184, zIndex: 100,
        background: 'var(--bg-2)', color: 'var(--text-1)',
        border: '1px solid var(--border)',
        width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'grid', placeItems: 'center',
        transition: 'all .15s'
      }}>
      🔍
    </button>
  );
};

/* ============================================================
   EMBED relevant tools into lessons
============================================================ */
function embedToolsInLesson(lessonKey, toolKeys) {
  // ค้นใน part 1-31 ทั้งหมด — ไม่ยึดติด part เฉพาะ ป้องกัน silently fail ถ้าย้ายบทเรียน
  const ALL_PARTS = Array.from({ length: 31 }, (_, i) => 'LessonsPart' + (i + 1));
  const findOrig = (id) => {
    for (const k of ALL_PARTS) {
      if (window[k] && window[k][id]) return { lib: k, comp: window[k][id] };
    }
    return null;
  };
  const orig = findOrig(lessonKey);
  if (!orig) return;
  const tools = toolKeys.map(t => {
    for (const k of ALL_PARTS) {
      if (window[k] && window[k][t]) return { id: t, comp: window[k][t] };
    }
    return null;
  }).filter(Boolean);

  const Original = orig.comp;
  const Wrapped = function () {
    const [openTool, setOpenTool] = useS12(null);
    return (
      <React.Fragment>
        <Original />
        {tools.length > 0 && (
          <div style={{ marginTop: 36, padding: 18, background: 'linear-gradient(135deg, rgba(94,234,212,0.04), rgba(168,139,250,0.04))', border: '1px solid var(--border)', borderRadius: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--accent-2)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>🛠️ TOOLS — สำหรับบทนี้</div>
            <div style={{ fontSize: 14, color: 'var(--text-1)', marginBottom: 12 }}>เครื่องมือที่ช่วยฝึก / เช็คคำตอบในบทนี้</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tools.map(t => {
                const labelMap = {
                  'master-calc': '🧮 Master Theorem Calculator',
                  'recurrence-solver': '🔁 Recurrence Solver',
                  'bigo-analyzer': '📐 Big-O Analyzer (ทีละบรรทัด)',
                  'pattern-trainer': '🎯 Pattern Trainer',
                  'race': '🏎️ Algorithm Race',
                  'compare': '⚖️ Compare Mode',
                  'playground': '▶️ Sorting Playground',
                  'advanced-viz': '🔬 Advanced Visualizers',
                  'practice-bank': '🧪 Practice Bank',
                  'code-solutions': '💾 Code Solutions',
                };
                const isOpen = openTool === t.id;
                const Comp = t.comp;
                return (
                  <div key={t.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-1)' }}>
                    <button onClick={() => setOpenTool(isOpen ? null : t.id)}
                      style={{ width: '100%', textAlign: 'left', background: isOpen ? 'var(--bg-3)' : 'transparent', color: 'var(--text-0)', border: 'none', padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 500 }}>
                      <span>{labelMap[t.id] || t.id}</span>
                      <span style={{ color: 'var(--text-2)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>▶</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: 14, borderTop: '1px solid var(--border)' }}>
                        <Comp />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  };
  window[orig.lib][lessonKey] = Wrapped;
}

// Wait one tick for all parts to register, then embed
setTimeout(() => {
  // Big-O lesson — gets Master Calc + Recurrence Solver + Big-O Analyzer
  embedToolsInLesson('big-o', ['bigo-analyzer', 'master-calc', 'recurrence-solver']);
  embedToolsInLesson('master-theorem', ['master-calc', 'recurrence-solver']);

  // Sort lessons → Race + Compare
  ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'heap-sort'].forEach(id => {
    embedToolsInLesson(id, ['race', 'compare']);
  });

  // DAC lessons → Advanced Visualizers
  embedToolsInLesson('strassen', ['advanced-viz']);
  embedToolsInLesson('matrix-mult', ['advanced-viz']);
  embedToolsInLesson('quick-select', ['advanced-viz']);

  // Recursion → Pattern Trainer + Practice
  embedToolsInLesson('recursion', ['pattern-trainer']);

  // DP / Greedy / Backtracking → Code Solutions + Practice
  ['dp', 'greedy', 'backtracking'].forEach(id => {
    embedToolsInLesson(id, ['code-solutions', 'practice-bank']);
  });

  // Graph → Practice Bank
  ['bfs', 'dfs', 'dijkstra', 'topo-sort', 'cycle-detect'].forEach(id => {
    embedToolsInLesson(id, ['practice-bank']);
  });
}, 0);

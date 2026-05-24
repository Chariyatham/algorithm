/* Lesson pages — content + embedded visualizers + quizzes */

const { useState: useStateL, useMemo: useMemoL } = React;

// helper: รองรับทั้ง `line` (convention เก่า ใน algorithms.js) และ `codeLine` (convention ใหม่ใน part29)
function _frameLine(f) {
  const v = f.line !== undefined ? f.line : f.codeLine;
  return v !== undefined ? [v] : [];
}

/* ===== CodeViewToggle =====
 * Renders pseudocode with optional "เต็ม / สั้น" toggle.
 * Props:
 *   code         — full code array (required)
 *   line         — current line to highlight (in FULL coords), can be undefined
 *   codeShort    — short code array (optional; if absent, toggle hidden)
 *   lineMapShort — { fullLine: shortLine }, used to remap highlight in short mode
 *   helperName   — label for short mode button (e.g., "merge()")
 *   storageKey   — persist mode across re-renders (optional)
 */
function CodeViewToggle({ code, line, codeShort, lineMapShort, helperName, storageKey }) {
  const [mode, setMode] = useStateL('full'); // 'full' | 'short'
  const hasShort = !!codeShort;
  const showShort = mode === 'short' && hasShort;
  const codeToShow = showShort ? codeShort : code;
  let hiLine = line;
  if (showShort && lineMapShort && line !== undefined) {
    hiLine = lineMapShort[line];
  }
  const highlight = (hiLine !== undefined && hiLine !== null && hiLine >= 0) ? [hiLine] : [];

  return (
    <React.Fragment>
      {hasShort && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: 0.5, marginRight: 4 }}>โหมดโค้ด:</span>
          <button
            onClick={() => setMode('full')}
            style={{
              background: mode === 'full' ? 'var(--accent)' : 'var(--bg-3)',
              color: mode === 'full' ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)',
              padding: '4px 12px',
              borderRadius: 14,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: mode === 'full' ? 600 : 400,
            }}>📖 เต็ม (มี {helperName || 'helper'})</button>
          <button
            onClick={() => setMode('short')}
            style={{
              background: mode === 'short' ? 'var(--accent)' : 'var(--bg-3)',
              color: mode === 'short' ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)',
              padding: '4px 12px',
              borderRadius: 14,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: mode === 'short' ? 600 : 400,
            }}>🎯 สั้น (เรียก {helperName || 'helper'} เป็น call)</button>
          <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 'auto' }}>
            {showShort ? `${codeToShow.length} บรรทัด` : `${codeToShow.length} บรรทัด`}
          </span>
        </div>
      )}
      <CodeBlock code={codeToShow} highlight={highlight} />
    </React.Fragment>
  );
}

function SortLessonViz({ algoKey }) {
  const [arr, setArr] = useStateL([42, 7, 19, 88, 3, 56, 31, 64]);
  const A = window.AlgorithmGenerators[algoKey];
  const player = usePlayer(() => A.gen(arr), [arr, algoKey]);
  const f = player.frame || { arr, marks: {}, vars: {} };
  const line = f.line !== undefined ? f.line : f.codeLine;
  return (
    <div className="viz">
      <PlayerToolbar player={player} extraLeft={<ArrayInput value={arr} onChange={setArr} />} />
      <div className="viz-stage">
        <Bars data={f.arr || arr} marks={f.marks || {}} />
      </div>
      <VarsPanel vars={f.vars || {}} />
      <div style={{ borderTop: '1px solid var(--border-soft)', padding: '14px 18px' }}>
        <CodeViewToggle
          code={A.code}
          codeShort={A.codeShort}
          lineMapShort={A.lineMapShort}
          helperName={A.helperName}
          line={line}
        />
      </div>
    </div>
  );
}

function SearchLessonViz({ algoKey, defaultArr, target }) {
  const [arr, setArr] = useStateL(defaultArr);
  const [t, setT] = useStateL(target);
  const A = window.AlgorithmGenerators[algoKey];
  const player = usePlayer(() => A.gen(arr, t), [arr, t, algoKey]);
  const f = player.frame || { arr, marks: {}, vars: {} };
  const line = f.line !== undefined ? f.line : f.codeLine;
  return (
    <div className="viz">
      <PlayerToolbar player={player} extraLeft={
        <React.Fragment>
          <ArrayInput value={arr} onChange={setArr} max={20} />
          <div className="ctrl-group">
            <span style={{ fontSize: 11 }}>target</span>
            <input type="number" value={t} onChange={e => setT(parseInt(e.target.value) || 0)} style={{ width: 60 }} />
          </div>
        </React.Fragment>
      } />
      <div className="viz-stage" style={{ flexDirection: 'column', gap: 8 }}>
        <Cells data={f.arr || arr} marks={f.marks || {}} labels={f.labels || {}} />
      </div>
      <VarsPanel vars={f.vars || {}} />
      <div style={{ borderTop: '1px solid var(--border-soft)', padding: '14px 18px' }}>
        <CodeViewToggle
          code={A.code}
          codeShort={A.codeShort}
          lineMapShort={A.lineMapShort}
          helperName={A.helperName}
          line={line}
        />
      </div>
    </div>
  );
}

/* ===== Quiz component =====
 * Accepts EITHER flat props: <Quiz q="..." options={[...]} answer={i} explain="..." />
 * OR object form: <Quiz q={{ question, options, answer, explain }} />
 */
function Quiz(props) {
  let { q, options, answer, explain } = props;
  // Object form: q is an object with { question, options, answer, explain }
  if (q && typeof q === 'object' && !React.isValidElement(q)) {
    options = q.options;
    answer = q.answer;
    explain = q.explain;
    q = q.question;
  }
  const [picked, setPicked] = useStateL(null);
  const [show, setShow] = useStateL(false);
  // Render q as HTML if it contains tags (common in object form)
  const qContent = (typeof q === 'string' && /<[a-z][\s\S]*>/i.test(q))
    ? <span dangerouslySetInnerHTML={{ __html: q }} />
    : q;
  return (
    <div className="quiz">
      <div className="quiz-q"><span className="qnum">QUIZ</span>{qContent}</div>
      {options.map((o, i) => {
        let cls = "quiz-opt";
        if (show) {
          if (i === answer) cls += " correct";
          else if (i === picked) cls += " wrong";
        } else if (i === picked) cls += " selected";
        return (
          <div key={i} className={cls} onClick={() => !show && setPicked(i)}>
            <span className="quiz-opt-key">{String.fromCharCode(65 + i)}</span>
            <span>{o}</span>
          </div>
        );
      })}
      {!show ? (
        <button className="btn btn-primary btn-sm" disabled={picked === null} onClick={() => setShow(true)} style={{ marginTop: 8 }}>ตรวจคำตอบ</button>
      ) : (
        <div className="quiz-explain"><b style={{ color: picked === answer ? 'var(--accent-3)' : 'var(--danger)' }}>{picked === answer ? '✓ ถูกต้อง' : '✗ ยังไม่ถูก'}</b> — {explain}</div>
      )}
    </div>
  );
}

/* ===== Drag-drop step ordering ===== */
function DragOrder({ items, correct, prompt }) {
  const [order, setOrder] = useStateL(() => [...items].sort(() => Math.random() - 0.5));
  const [drag, setDrag] = useStateL(null);
  const [show, setShow] = useStateL(false);

  const onDrag = i => setDrag(i);
  const onDrop = i => {
    if (drag === null) return;
    const next = [...order];
    const [m] = next.splice(drag, 1);
    next.splice(i, 0, m);
    setOrder(next); setDrag(null);
  };

  const isCorrect = JSON.stringify(order) === JSON.stringify(correct);

  return (
    <div className="quiz">
      <div className="quiz-q"><span className="qnum">LAB</span>{prompt}</div>
      <div className="dd-zone">
        {order.map((it, i) => (
          <div
            key={it}
            draggable
            onDragStart={() => onDrag(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className={"dd-item " + (drag === i ? 'dragging' : '')}
            style={show ? { borderColor: order[i] === correct[i] ? 'var(--accent-3)' : 'var(--danger)' } : {}}
          >
            {i + 1}. {it}
          </div>
        ))}
      </div>
      {!show ? (
        <button className="btn btn-primary btn-sm" onClick={() => setShow(true)} style={{ marginTop: 4 }}>ตรวจคำตอบ</button>
      ) : (
        <div className="quiz-explain">
          <b style={{ color: isCorrect ? 'var(--accent-3)' : 'var(--danger)' }}>{isCorrect ? '✓ ถูกต้อง!' : '✗ ลองใหม่'}</b>
          {!isCorrect && <span> ลำดับที่ถูกคือ: {correct.map((c, i) => `${i + 1}. ${c}`).join(' → ')}</span>}
          {!isCorrect && <button className="btn btn-ghost btn-sm" style={{ marginLeft: 12 }} onClick={() => { setShow(false); }}>ลองอีกครั้ง</button>}
        </div>
      )}
    </div>
  );
}

window.LessonComponents = { SortLessonViz, SearchLessonViz, Quiz, DragOrder, CodeViewToggle };
window.CodeViewToggle = CodeViewToggle;

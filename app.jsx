/* Main app: routing, sidebar, home page, lesson router, progress tracking */

const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp } = React;

const PROGRESS_KEY = "algo-academy-progress-v1";
const STREAK_KEY   = "algo-academy-streak-v1";

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"days":0,"last":""}'); }
  catch { return { days: 0, last: "" }; }
}
function saveStreak(s) { try { localStorage.setItem(STREAK_KEY, JSON.stringify(s)); } catch {} }
function tickStreak() {
  const s = loadStreak();
  const t = todayKey();
  if (s.last === t) return s;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yKey = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
  const next = { days: s.last === yKey ? s.days + 1 : 1, last: t };
  saveStreak(next);
  return next;
}

const BADGES = [
  { id: "first-step",  threshold: 1,  icon: "🌱", title: "First Step",   desc: "เรียน 1 บท" },
  { id: "explorer",    threshold: 5,  icon: "🧭", title: "Explorer",     desc: "เรียน 5 บท" },
  { id: "committed",   threshold: 10, icon: "🎯", title: "Committed",    desc: "เรียน 10 บท" },
  { id: "halfway",     threshold: 25, icon: "⚡", title: "Halfway Hero", desc: "เรียน 25 บท" },
  { id: "scholar",     threshold: 50, icon: "📚", title: "Scholar",      desc: "เรียน 50 บท" },
];
const PROBLEM_BADGES = [
  { id: "first-solve",   threshold: 1,  icon: "🔓", title: "First Solve",   desc: "ผ่าน 1 โจทย์" },
  { id: "coder",         threshold: 5,  icon: "💻", title: "Coder",         desc: "ผ่าน 5 โจทย์" },
  { id: "problem-solver",threshold: 15, icon: "🧩", title: "Problem Solver",desc: "ผ่าน 15 โจทย์" },
  { id: "master",        threshold: 25, icon: "👑", title: "Master",        desc: "ผ่านครบทุกโจทย์" },
];

function useRoute() {
  const get = () => {
    const h = window.location.hash.replace(/^#\/?/, "");
    return h || "home";
  };
  const [route, setRoute] = useStateApp(get);
  useEffectApp(() => {
    const onHash = () => setRoute(get());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const nav = (r) => { window.location.hash = "/" + r; window.scrollTo({ top: 0 }); };
  return [route, nav];
}

function Sidebar({ route, nav, progress }) {
  const completedCount = Object.values(progress).filter(Boolean).length;
  const pct = Math.round((completedCount / window.TOTAL_LESSONS) * 100);

  return (
    <aside className="sidebar">
      <div className="brand" onClick={() => nav("home")}>
        <div className="brand-logo">A</div>
        <div>
          <div className="brand-name">Algorithm Academy</div>
          <div className="brand-sub">DARK MODE · TH</div>
        </div>
      </div>

      <div className="nav-item" onClick={() => nav("home")} style={route === "home" ? { background: 'var(--bg-3)', color: 'var(--accent)' } : {}}>
        <span className="nav-num" style={{ width: 22, height: 22 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg>
        </span>
        <span>หน้าแรก</span>
      </div>

      <div className="nav-item" onClick={() => nav("playground")} style={route === "playground" ? { background: 'var(--bg-3)', color: 'var(--accent)' } : {}}>
        <span className="nav-num" style={{ width: 22, height: 22 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
        </span>
        <span>Code Playground</span>
      </div>

      <div className="nav-item" onClick={() => nav("problems")} style={route === "problems" || route.startsWith("problem/") ? { background: 'var(--bg-3)', color: 'var(--accent)' } : {}}>
        <span className="nav-num" style={{ width: 22, height: 22 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </span>
        <span>โจทย์ฝึก</span>
        {window.PROBLEMS && (
          <span className="badge" style={{ marginLeft: 'auto' }}>{window.PROBLEMS.length}</span>
        )}
      </div>

      {window.CURRICULUM.map(sec => (
        <div className="nav-section" key={sec.id}>
          <div className="nav-section-title">
            <span>{sec.title}</span>
            <span className="badge">{sec.lessons.length}</span>
          </div>
          {sec.lessons.map(l => {
            const done = !!progress[l.id];
            return (
              <div
                key={l.id}
                className={"nav-item" + (route === l.id ? " active" : "") + (done ? " done" : "")}
                onClick={() => nav(l.id)}
              >
                <span className="nav-num">{done ? "✓" : l.num}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
              </div>
            );
          })}
        </div>
      ))}

      <div className="progress-card">
        <div className="label">
          <span>ความคืบหน้ารวม</span>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: pct + '%' }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8, fontFamily: 'var(--mono)' }}>
          {completedCount} / {window.TOTAL_LESSONS} บทเรียน
        </div>
      </div>
    </aside>
  );
}

function HomePage({ nav, progress }) {
  const completedCount = Object.values(progress).filter(Boolean).length;
  const solved = window.loadSolved ? window.loadSolved() : {};
  const solvedCount = Object.values(solved).filter(Boolean).length;
  const totalProblems = (window.PROBLEMS || []).length;
  const streak = loadStreak();

  const earnedLesson = BADGES.filter(b => completedCount >= b.threshold);
  const earnedProblem = PROBLEM_BADGES.filter(b => solvedCount >= (b.id === "master" ? totalProblems : b.threshold));
  const allBadges = [...earnedLesson, ...earnedProblem];

  return (
    <div className="content">
      <div className="hero">
        <div className="hero-eyebrow">ALGORITHM · DATA STRUCTURES · LAB</div>
        <h1>เรียน <span className="accent">Algorithm</span> ผ่าน animation<br />ตั้งแต่ basic ถึง advanced</h1>
        <p>
          เว็บเรียนอัลกอริทึมโครงสร้างข้อมูลภาษาไทย พร้อม animation ทีละ step,
          pseudocode ที่ highlight ตามการรัน, lab ให้ทดลองเอง, และโจทย์ฝึกที่รัน JS ได้ใน browser —
          เป้าหมายคือ <b>basic → เซียนแก้โจทย์ได้</b>
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => nav("what-is-algo")}>
            เริ่มเรียน
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
          </button>
          <button className="btn btn-ghost" onClick={() => nav("problems")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/></svg>
            ฝึกแก้โจทย์ ({totalProblems})
          </button>
          <button className="btn btn-ghost" onClick={() => nav("playground")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
            Playground
          </button>
          <button className="btn btn-ghost" onClick={() => nav("compare")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            Compare Mode
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">{window.TOTAL_LESSONS}</div>
            <div className="lbl">บทเรียน</div>
          </div>
          <div className="hero-stat">
            <div className="num">{totalProblems}</div>
            <div className="lbl">โจทย์ฝึก</div>
          </div>
          <div className="hero-stat">
            <div className="num">{completedCount}</div>
            <div className="lbl">เรียนแล้ว</div>
          </div>
          <div className="hero-stat">
            <div className="num">{solvedCount}</div>
            <div className="lbl">โจทย์ผ่าน</div>
          </div>
          <div className="hero-stat" title="วันต่อเนื่อง">
            <div className="num">🔥 {streak.days}</div>
            <div className="lbl">วันต่อเนื่อง</div>
          </div>
        </div>

        {allBadges.length > 0 && (
          <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10, letterSpacing: 0.5 }}>🏆 BADGES ({allBadges.length})</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {allBadges.map(b => (
                <div key={b.id} title={b.desc} style={{
                  background: 'linear-gradient(135deg, var(--bg-3), var(--bg-1))',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                }}>
                  <span style={{ fontSize: 18 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-0)' }}>{b.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="section">
        <div className="section-head">
          <div className="section-eyebrow">ทำไมเว็บนี้?</div>
          <h2>เครื่องมือเรียนที่ครบครัน</h2>
        </div>
        <div className="module-grid">
          <FeatureCard icon="play" title="Step-by-Step Animation" desc="เห็นทุกขั้นตอนการทำงาน เล่นได้ ปรับความเร็ว ย้อนกลับได้" />
          <FeatureCard icon="code" title="Pseudocode Highlight" desc="โค้ด C ไฮไลท์บรรทัดที่กำลังทำ ตาม animation จริง" />
          <FeatureCard icon="lab" title="Interactive Lab" desc="ป้อน input ของตัวเอง ทดลอง insert/delete/search สด ๆ" />
          <FeatureCard icon="cmp" title="Compare 2 Algorithms" desc="รัน 2 อัลกอริทึมพร้อมกันด้วยข้อมูลชุดเดียว เห็นความต่างชัด" />
          <FeatureCard icon="quiz" title="Quiz + Lab รวมทุกบท" desc="ตรวจสอบความเข้าใจหลังเรียน drag-and-drop และ multiple choice" />
          <FeatureCard icon="track" title="Progress Tracking" desc="ติดตามว่าเรียนถึงไหน เก็บไว้ในเครื่องคุณเอง" />
        </div>
      </div>

      {/* Learning path */}
      <div className="section">
        <div className="section-head">
          <div className="section-eyebrow">หลักสูตร</div>
          <h2>เส้นทางการเรียน · {window.TOTAL_LESSONS} บท</h2>
          <p style={{ color: 'var(--text-2)', marginTop: 4 }}>เรียงจาก basic → intermediate → advanced</p>
        </div>
        {window.CURRICULUM.map(sec => (
          <div key={sec.id} style={{ marginBottom: 28 }}>
            <h3 style={{ marginTop: 28, color: 'var(--text-1)', fontSize: 16, fontWeight: 500 }}>{sec.title}</h3>
            <div className="module-grid">
              {sec.lessons.map(l => {
                const done = !!progress[l.id];
                const lvl = l.level === "basic" ? "level-basic" : l.level === "inter" ? "level-inter" : "level-adv";
                const lvlText = l.level === "basic" ? "BASIC" : l.level === "inter" ? "INTERMEDIATE" : "ADVANCED";
                return (
                  <div key={l.id} className={"module-card " + (done ? "done" : "")} onClick={() => nav(l.id)}>
                    {done && <div className="done-mark">✓</div>}
                    <div className="num">LESSON · {l.num}<span className={"level-pill " + lvl}>{lvlText}</span></div>
                    <h4>{l.title}</h4>
                    <div className="desc">{l.desc}</div>
                    <div className="meta">
                      <span>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                        {l.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  const icons = {
    play: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8V4z"/></svg>,
    code: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>,
    lab: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3M9 3h6"/></svg>,
    cmp: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3l4 4-4 4M20 7H8M8 21l-4-4 4-4M4 17h12"/></svg>,
    quiz: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4M12 17h.01"/></svg>,
    track: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l5 5 13-13"/></svg>,
  };
  return (
    <div className="module-card" style={{ cursor: 'default' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: 'var(--bg-3)', color: 'var(--accent)',
        display: 'grid', placeItems: 'center', marginBottom: 12
      }}>{icons[icon]}</div>
      <h4>{title}</h4>
      <div className="desc">{desc}</div>
    </div>
  );
}

function LessonPage({ lessonId, nav, onComplete, progress }) {
  const lesson = window.ALL_LESSONS.find(l => l.id === lessonId);
  const Comp = (window.LessonsPart1 && window.LessonsPart1[lessonId])
    || (window.LessonsPart2 && window.LessonsPart2[lessonId])
    || (window.LessonsPart3 && window.LessonsPart3[lessonId])
    || (window.LessonsPart4 && window.LessonsPart4[lessonId])
    || (window.LessonsPart5 && window.LessonsPart5[lessonId])
    || (window.LessonsPart6 && window.LessonsPart6[lessonId])
    || (window.LessonsPart7 && window.LessonsPart7[lessonId])
    || (window.LessonsPart8 && window.LessonsPart8[lessonId])
    || (window.LessonsPart9 && window.LessonsPart9[lessonId])
    || (window.LessonsPart10 && window.LessonsPart10[lessonId])
    || (window.LessonsPart11 && window.LessonsPart11[lessonId])
    || (window.LessonsPart12 && window.LessonsPart12[lessonId])
    || (window.LessonsPart13 && window.LessonsPart13[lessonId])
    || (window.LessonsPart14 && window.LessonsPart14[lessonId])
    || (window.LessonsPart15 && window.LessonsPart15[lessonId])
    || (window.LessonsPart16 && window.LessonsPart16[lessonId])
    || (window.LessonsPart17 && window.LessonsPart17[lessonId])
    || (window.LessonsPart18 && window.LessonsPart18[lessonId])
    || (window.LessonsPart19 && window.LessonsPart19[lessonId])
    || (window.LessonsPart20 && window.LessonsPart20[lessonId])
    || (window.LessonsPart21 && window.LessonsPart21[lessonId])
    || (window.LessonsPart22 && window.LessonsPart22[lessonId])
    || (window.LessonsPart23 && window.LessonsPart23[lessonId])
    || (window.LessonsPart24 && window.LessonsPart24[lessonId])
    || (window.LessonsPart25 && window.LessonsPart25[lessonId])
    || (window.LessonsPart26 && window.LessonsPart26[lessonId])
    || (window.LessonsPart27 && window.LessonsPart27[lessonId])
    || (window.LessonsPart28 && window.LessonsPart28[lessonId])
    || (window.LessonsPart29 && window.LessonsPart29[lessonId])
    || (window.LessonsPart30 && window.LessonsPart30[lessonId])
    || (window.LessonsPart31 && window.LessonsPart31[lessonId]);

  if (!lesson || !Comp) {
    return (
      <div className="content">
        <div className="empty">
          <div style={{ fontSize: 18, marginBottom: 8 }}>ไม่พบบทเรียน</div>
          <button className="btn btn-primary btn-sm" onClick={() => nav("home")}>กลับหน้าแรก</button>
        </div>
      </div>
    );
  }

  const done = !!progress[lessonId];
  const lvlText = lesson.level === "basic" ? "BASIC" : lesson.level === "inter" ? "INTERMEDIATE" : "ADVANCED";

  return (
    <div className="content">
      <div className="lesson-head">
        <div className="eyebrow">{lesson.sectionTitle.toUpperCase()} · LESSON {lesson.num} · {lvlText}</div>
        <h1>{lesson.title}</h1>
        <div className="lede">{lesson.desc}</div>
        <div className="lesson-meta">
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            {lesson.time}
          </span>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 11V7a4 4 0 0 0-8 0v4M5 11h14v10H5z"/></svg>
            ภาษา C
          </span>
          {done && (
            <span style={{ color: 'var(--accent-3)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7"/></svg>
              เรียนแล้ว
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <Comp />
      </div>

      <div style={{ marginTop: 40, padding: '20px 0', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className={"btn " + (done ? "btn-ghost" : "btn-primary")} onClick={() => onComplete(lessonId, !done)}>
          {done ? (
            <React.Fragment>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7"/></svg>
              เรียนแล้ว · กดอีกครั้งเพื่อยกเลิก
            </React.Fragment>
          ) : (
            <React.Fragment>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7"/></svg>
              ทำเครื่องหมายว่าเรียนแล้ว
            </React.Fragment>
          )}
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
          ความคืบหน้าจะเก็บไว้ในเครื่องของคุณ
        </span>
      </div>

      <div className="lesson-nav">
        {lesson.prev ? (
          <div className="lesson-nav-card" onClick={() => nav(lesson.prev.id)}>
            <div className="lbl">← บทก่อนหน้า</div>
            <div className="ttl">{lesson.prev.num}. {lesson.prev.title}</div>
          </div>
        ) : <div className="lesson-nav-card disabled"><div className="lbl">—</div><div className="ttl">เริ่มต้นแล้ว</div></div>}
        {lesson.next ? (
          <div className="lesson-nav-card next" onClick={() => nav(lesson.next.id)}>
            <div className="lbl">บทถัดไป →</div>
            <div className="ttl">{lesson.next.num}. {lesson.next.title}</div>
          </div>
        ) : <div className="lesson-nav-card next disabled"><div className="lbl">—</div><div className="ttl">จบหลักสูตรแล้ว 🎉</div></div>}
      </div>
    </div>
  );
}

function App() {
  const [route, nav] = useRoute();
  const [progress, setProgress] = useStateApp(loadProgress);

  useEffectApp(() => { saveProgress(progress); }, [progress]);
  useEffectApp(() => { tickStreak(); }, []);

  const onComplete = (id, val) => {
    setProgress(p => ({ ...p, [id]: val }));
  };

  // Special routes (playground, problems, problem/<id>)
  const isPlayground = route === "playground";
  const isProblemsHub = route === "problems";
  const isProblemPage = route.startsWith("problem/");
  const problemId = isProblemPage ? route.slice("problem/".length) : null;

  const lesson = window.ALL_LESSONS.find(l => l.id === route);
  const isLesson = !!lesson;

  return (
    <div className="app">
      <Sidebar route={route} nav={nav} progress={progress} />
      <div className="main">
        <div className="topbar">
          <div className="crumb">
            {isLesson ? (
              <React.Fragment>
                <span style={{ cursor: 'pointer' }} onClick={() => nav("home")}>หน้าแรก</span>
                <span style={{ margin: '0 8px', color: 'var(--text-3)' }}>/</span>
                <span>{lesson.sectionTitle}</span>
                <span style={{ margin: '0 8px', color: 'var(--text-3)' }}>/</span>
                <b>{lesson.title}</b>
              </React.Fragment>
            ) : isPlayground ? (
              <React.Fragment>
                <span style={{ cursor: 'pointer' }} onClick={() => nav("home")}>หน้าแรก</span>
                <span style={{ margin: '0 8px', color: 'var(--text-3)' }}>/</span>
                <b>Code Playground</b>
              </React.Fragment>
            ) : isProblemsHub || isProblemPage ? (
              <React.Fragment>
                <span style={{ cursor: 'pointer' }} onClick={() => nav("home")}>หน้าแรก</span>
                <span style={{ margin: '0 8px', color: 'var(--text-3)' }}>/</span>
                <span style={{ cursor: 'pointer' }} onClick={() => nav("problems")}>โจทย์ฝึก</span>
                {isProblemPage && (
                  <React.Fragment>
                    <span style={{ margin: '0 8px', color: 'var(--text-3)' }}>/</span>
                    <b>{(window.PROBLEMS || []).find(p => p.id === problemId)?.title || problemId}</b>
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : (
              <b>หน้าแรก · Algorithm Academy</b>
            )}
          </div>
          <div className="topbar-actions">
            {isLesson && lesson.prev && (
              <button className="btn btn-ghost btn-sm" onClick={() => nav(lesson.prev.id)} title="บทก่อนหน้า">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
              </button>
            )}
            {isLesson && lesson.next && (
              <button className="btn btn-ghost btn-sm" onClick={() => nav(lesson.next.id)} title="บทถัดไป">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => {
              if (confirm("รีเซ็ตความคืบหน้าทั้งหมด (บทเรียน + โจทย์ + streak)?")) {
                setProgress({});
                try { localStorage.removeItem("algo-academy-solved-v1"); } catch {}
                try { localStorage.removeItem(STREAK_KEY); } catch {}
                window.location.reload();
              }
            }} title="รีเซ็ต progress">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          </div>
        </div>

        {route === "home" ? (
          <HomePage nav={nav} progress={progress} />
        ) : isPlayground && window.CodePlayground ? (
          <window.CodePlayground />
        ) : isProblemsHub && window.ProblemsHub ? (
          <window.ProblemsHub nav={nav} />
        ) : isProblemPage && window.ProblemPage ? (
          <window.ProblemPage problemId={problemId} nav={nav} />
        ) : (
          <LessonPage lessonId={route} nav={nav} onComplete={onComplete} progress={progress} />
        )}
      </div>
      {window.NotesPanel && <window.NotesPanel />}
      {window.Bookmark && <window.Bookmark />}
      {window.SearchHint && <window.SearchHint />}
      {window.AskAI && <window.AskAI />}
      {window.GlobalSearch && <window.GlobalSearch />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

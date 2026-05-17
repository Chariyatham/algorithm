# Algorithm Academy

เว็บเรียน Algorithm + Data Structures ภาษาไทย — animation ทีละ step, pseudocode highlight, lab โต้ตอบ, โจทย์ฝึกที่รัน JS ใน browser

## ฟีเจอร์

- 📖 **บทเรียน 80+ บท** — basic → intermediate → advanced
- 🎬 **Animation** — เห็นทุก step ของแต่ละ algorithm
- 💻 **Code Playground** — เขียน JavaScript รันใน browser
- 🧩 **โจทย์ฝึก 25+ ข้อ** — มี test runner + เฉลย
- 🏆 **Badges + Streak** — ติดตามความคืบหน้า
- 🤖 **AI Tutor** — ใช้ได้บน claude.ai เท่านั้น (จะ hidden อัตโนมัติบน GitHub Pages)

## รันบน local

ไม่ต้องมี build step — เปิด `index.html` ผ่าน HTTP server:

```bash
# Python
python3 -m http.server 8000

# หรือ Node
npx serve .
```

แล้วเปิด `http://localhost:8000`

## โครงสร้างไฟล์

```
index.html              ← entry point (โหลด React + Babel จาก CDN)
styles.css              ← theme + layout
curriculum.js           ← lesson metadata
algorithms.js           ← algorithm generators
app.jsx                 ← routing, sidebar, home, streak, badges
player.jsx              ← animation controls
ds-viz.jsx              ← data structure visualizers
lesson-components.jsx   ← shared (Quiz, DragOrder, etc)
lessons-part1..13.jsx   ← lesson content
lessons-part12.jsx      ← AskAI floating button (AI-gated)
code-playground.jsx     ← Code Playground + Problems Hub (no AI)
```

## License

MIT

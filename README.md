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

## Deploy บน GitHub Pages (ฟรี)

### วิธีที่ 1 — GitHub Actions (recommended, auto deploy ทุก push)

1. สร้าง GitHub repo และ push code นี้ขึ้นไป (branch ชื่อ `main`)
2. ไปที่ **Settings → Pages**
3. ที่ "Source" เลือก **GitHub Actions**
4. Push ครั้งต่อไป workflow `.github/workflows/deploy.yml` จะ deploy อัตโนมัติ
5. ดู URL ของเว็บที่ `https://<username>.github.io/<repo-name>/`

### วิธีที่ 2 — Branch deploy (manual)

1. ไปที่ **Settings → Pages**
2. ที่ "Source" เลือก **Deploy from a branch** → branch = `main`, folder = `/ (root)`
3. รอ 1-2 นาที แล้วเข้า `https://<username>.github.io/<repo-name>/`

## เรื่อง AI tokens — ใครจ่าย?

โค้ดเรียก `window.claude.complete(...)` ซึ่งเป็น API ของ **Claude.ai artifact runtime** — มีให้ใช้ฟรีเฉพาะตอนรันบน claude.ai เท่านั้น (Anthropic จ่ายให้)

เมื่อ host บน GitHub Pages: `window.claude` จะไม่มี → ปุ่ม "ถาม AI" และบทเรียน AI Tutor จะ **ซ่อนตัวอัตโนมัติ** ไม่ทำให้เว็บพัง

ถ้าต้องการให้ AI ใช้ได้บน GitHub Pages ต้องเพิ่ม proxy เอง — เช่น:
- Cloudflare Workers + Anthropic/OpenAI API key (คุณจ่าย)
- ให้ user กรอก API key เอง เก็บใน localStorage
- ใช้ Gemini API free tier

(โครงสร้าง code อยู่ที่ `lessons-part12.jsx` — modify `AskAI` ตามต้องการ)

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

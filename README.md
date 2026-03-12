# Medical Billing Denial Analyzer

AI-powered tool covering all CARC & RARC denial codes. Get instant True/False verdicts with actionable next steps.

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1 — Get your free Gemini API Key
1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — you'll need it in Step 4

### Step 2 — Upload this project to GitHub
1. Go to your GitHub repo
2. Click **"uploading an existing file"**
3. Drag and drop ALL these files into GitHub
4. Click **"Commit changes"**

### Step 3 — Connect to Vercel
1. Go to **https://vercel.com**
2. Click **"Add New Project"**
3. Select your GitHub repo
4. Click **"Import"**

### Step 4 — Add your API Key in Vercel
1. Before clicking Deploy, scroll to **"Environment Variables"**
2. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** paste your Gemini API key here
3. Click **"Deploy"**

### Step 5 — Done! 🎉
Your tool will be live at `https://your-project-name.vercel.app`

---

## 📁 Project Structure

```
denial-analyzer/
├── pages/
│   ├── index.js          ← Main tool UI
│   ├── _app.js           ← Next.js app wrapper
│   └── api/
│       └── analyze.js    ← Secure API route (Gemini key lives here)
├── styles/
│   └── globals.css
├── .env.local            ← Local dev only (never uploaded to GitHub)
├── .gitignore            ← Keeps your API key safe
├── next.config.js
└── package.json
```

---

## 💡 Notes

- **Free tier:** Gemini allows 1,500 requests/day for free
- **API key security:** The key is stored as an environment variable — never exposed to users
- **Local development:** Run `npm install` then `npm run dev` to test locally

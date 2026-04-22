# 🕌 Sukun - Islamic Panic Relief Telegram Mini App

Sukun is a Telegram Mini App that provides immediate relief from panic attacks and anxiety through Islamic practices. Users can access two guided paths: one with Quranic verses and breathing dhikr, and another with du'as and grounding techniques.

## ✨ Features

✅ **3D Green Panic Button** - Eye-catching, interactive relief trigger  
✅ **Two Guided Paths** - Quran (4 steps) or Calm (3 steps)  
✅ **Manual Breathing Counter** - User presses button for each breath  
✅ **Quranic Integration** - Verses and du'as from authentic sources  
✅ **Session Tracking** - Backend tracks all relief sessions  
✅ **Telegram Notifications** - Users get feedback after each session  
✅ **Zero Installation** - Works instantly inside Telegram  
✅ **Production Ready** - Deploy to Railway in 10 minutes  

---

## 🚀 Quick Start on Railway

### Step 1: Create GitHub Repo

1. Go to https://github.com/new
2. Create repo: `sukun-telegram-app`
3. Make it **Public**
4. Click "Create repository"

### Step 2: Push Files to GitHub

```bash
git init
git add .
git commit -m "Initial Sukun telegram mini app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sukun-telegram-app.git
git push -u origin main
```

### Step 3: Get Telegram Bot Token

1. Open Telegram
2. Search: `@BotFather`
3. Send: `/newbot`
4. Follow instructions
5. Copy your bot token

### Step 4: Deploy on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "GitHub Repo"
4. Connect your GitHub account
5. Select `sukun-telegram-app`
6. Wait for build (2-3 minutes)
7. Copy the deployment URL

### Step 5: Add Environment Variables

In Railway dashboard:

1. Go to your project
2. Click "Variables"
3. Add variable:
   - **Key:** `TELEGRAM_BOT_TOKEN`
   - **Value:** (your bot token)
4. Add variable:
   - **Key:** `WEBHOOK_URL`
   - **Value:** (your Railway URL, e.g., `https://sukun-xxx.up.railway.app`)
5. Redeploy

### Step 6: Test

1. In Telegram, find your bot (e.g., `@SukunBot`)
2. Send `/start`
3. Tap "🆘 Open Sukun Relief App"
4. ✅ App should open!

---

## 📋 Project Structure

```
sukun-telegram-app/
├── server.js              # Express + Telegram Bot
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── public/
    └── index.html        # Mini app frontend (vanilla JS)
```

---

## 🎯 How It Works

### User Flow:

1. **Home** - Tap ❤️ panic button
2. **Path Select** - Choose "Quran" or "Calm"
3. **Quran Path** (4 steps):
   - Breathing with Dhikr (30x count)
   - Quranic Verse (Innallaha ma'ana)
   - Reflection (write thoughts)
   - Du'a (recite together)
4. **Calm Path** (3 steps):
   - Grounding (15x count)
   - Du'as (choose which resonates)
   - Soothing Audio
5. **Finish Session** → Success screen
6. **Telegram Notification** → Session saved

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Vanilla JavaScript (no React, no Tailwind) |
| **Backend** | Node.js + Express |
| **Bot** | node-telegram-bot-api |
| **Hosting** | Railway (free tier) |
| **Database** | In-memory (can add MongoDB) |

---

## 📱 API Endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/session/start` | Start new session |
| POST | `/api/session/breath-count` | Update breath counter |
| POST | `/api/session/complete` | Finish session |
| GET | `/api/user/stats/:userId` | Get user stats |
| GET | `/health` | Health check |

---

## 🤖 Bot Commands

Users can use these commands in Telegram:

```
/start    - Open the Sukun relief app
/stats    - View relief session statistics
/help     - Show help message
```

---

## 🌍 Telegram Mini App Integration

The app uses Telegram's Mini App SDK for:
- Auto-expand to full screen
- User ID detection
- Mobile viewport optimization
- Native Telegram feel

---

## 💻 Local Development

### Install

```bash
npm install
```

### Development with Ngrok

To test locally with Telegram:

```bash
# Install ngrok
brew install ngrok

# Start ngrok
ngrok http 3000

# Run server
npm start

# Copy ngrok URL and set as WEBHOOK_URL
```

### Environment

Create `.env`:

```
TELEGRAM_BOT_TOKEN=your_token
WEBHOOK_URL=https://your-ngrok-url.ngrok.io
PORT=3000
NODE_ENV=development
```

---

## 🚢 Deploy on Railway

Railway handles all the hard work:

✅ Auto-detects Node.js  
✅ Runs `npm install`  
✅ Runs `npm start`  
✅ Free SSL/HTTPS  
✅ Auto-scales  
✅ 24/7 uptime  

Just push to GitHub and Railway deploys automatically!

---

## 📊 Monitoring

### Check logs on Railway:

1. Go to your project
2. Click "Deployments"
3. Click latest deployment
4. View "Logs"

### Check sessions:

Currently stored in memory. To persist, add MongoDB:

```javascript
// Example: Add MongoDB connection
const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
  userId: Number,
  path: String,
  duration: Number,
  completed: Boolean,
  createdAt: { type: Date, default: Date.now }
});
```

---

## 🎨 Customization

### Change Colors

In `public/index.html`, update CSS:

```css
/* Primary green */
--primary: #2ecc71;

/* Dark green */
--dark: #27ae60;

/* Blue accent */
--blue: #006397;
```

### Add More Quranic Verses

In `public/index.html`, add to Step 2:

```javascript
const verses = [
  { arabic: 'Innallaha ma'ana', ref: 'At-Tawbah 9:40', translation: 'Surely Allah is with us' },
  { arabic: 'Your new verse', ref: 'New Reference', translation: 'Translation' }
];
```

### Add More Du'as

In Step 2 (Calm path), add buttons for more du'as:

```html
<button onclick="alert('📿 Your du\'a here')">Your Du\'a</button>
```

---

## 🔒 Security

- ✅ Bot token in environment variables (never in code)
- ✅ Webhook URL verification
- ✅ HTTPS only in production
- ✅ No sensitive data stored
- ✅ User IDs only from Telegram

---

## 📈 Next Steps

### Phase 2 (Week 2-4):
- Add prayer time reminders
- Add session history/journal
- Add more Quranic verses

### Phase 3 (Month 1-2):
- Add premium features (Telegram Stars)
- Premium du'as and lessons
- Remove ads for premium users

### Phase 4 (If validated):
- Convert to Flutter native app
- Launch on Google Play Store
- Scale to millions globally

---

## 🆘 Troubleshooting

### Issue: Bot not responding

**Solution:**
- Check `TELEGRAM_BOT_TOKEN` is correct
- Verify Railway deployment is running
- Check logs in Railway dashboard

### Issue: Mini app not opening

**Solution:**
- Check `WEBHOOK_URL` is correct and starts with `https://`
- Redeploy on Railway
- Wait 2 minutes for webhook to register

### Issue: Counter not incrementing

**Solution:**
- Check browser console (F12) for errors
- Verify Railway backend is running
- Check network tab to see API calls

### Issue: Build fails on Railway

**Solution:**
- Check `.gitignore` doesn't exclude `package.json`
- Check `package.json` syntax is valid
- Check Node.js version is 18.x or higher

---

## 📞 Support

- **Telegram Bot Documentation:** https://core.telegram.org/bots
- **Mini App Documentation:** https://core.telegram.org/bots/webapps
- **Node.js Documentation:** https://nodejs.org/docs
- **Railway Documentation:** https://docs.railway.app

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🙏 About Sukun

Sukun means "peace" or "tranquility" in Arabic. This app is built with the intention to provide immediate relief to Muslims experiencing panic attacks through:

- 📖 Quranic guidance
- 🕌 Islamic practices
- 🧘 Evidence-based techniques
- 💖 Compassionate design

**Disclaimer:** Sukun is not a substitute for professional mental health care. If you're experiencing severe anxiety or panic disorder, please consult a mental health professional.

---

**Made with ❤️ for the Sukun project**

Questions? Open an issue on GitHub!

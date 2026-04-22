const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

let bot = null;

// Initialize bot only if token is available
if (BOT_TOKEN) {
    const TelegramBot = require('node-telegram-bot-api');
    bot = new TelegramBot(BOT_TOKEN, { polling: false });
    console.log('✅ Telegram Bot initialized');
} else {
    console.log('⚠️ WARNING: TELEGRAM_BOT_TOKEN not set. Bot will not respond to Telegram.');
}

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory session storage
const userSessions = {};

// ============ API ROUTES ============

// Start session
app.post('/api/session/start', (req, res) => {
    const { userId, path: sessionPath } = req.body;
    
    if (!userSessions[userId]) {
        userSessions[userId] = {
            sessions: [],
            totalSessions: 0
        };
    }
    
    const newSession = {
        id: Date.now(),
        path: sessionPath,
        startTime: new Date(),
        breathCount: 0,
        completed: false
    };
    
    userSessions[userId].sessions.push(newSession);
    
    res.json({ 
        success: true, 
        sessionId: newSession.id,
        message: `Started ${sessionPath} path session`
    });
});

// Update breath count
app.post('/api/session/breath-count', (req, res) => {
    const { userId, sessionId, count } = req.body;
    
    if (userSessions[userId]) {
        const session = userSessions[userId].sessions.find(s => s.id == sessionId);
        if (session) {
            session.breathCount = count;
            res.json({ success: true, currentCount: count });
            return;
        }
    }
    
    res.status(404).json({ success: false, error: 'Session not found' });
});

// Complete session
app.post('/api/session/complete', (req, res) => {
    const { userId, sessionId } = req.body;
    
    if (userSessions[userId]) {
        const session = userSessions[userId].sessions.find(s => s.id == sessionId);
        if (session) {
            session.completed = true;
            session.endTime = new Date();
            session.duration = (session.endTime - session.startTime) / 1000;
            userSessions[userId].totalSessions++;
            
            // Send Telegram notification if bot is available
            if (bot) {
                const minutes = Math.round(session.duration / 60);
                const message = `✨ Session Complete!\n\nYou completed a ${session.path} relief session.\nDuration: ${minutes} minutes\n\nTotal sessions: ${userSessions[userId].totalSessions}\n\n"Verily, with hardship comes ease." - Surah Al-Inshirah 94:5`;
                
                bot.sendMessage(userId, message, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🆘 Open Sukun', web_app: { url: WEBHOOK_URL } }]
                        ]
                    }
                }).catch(err => console.log('Notification error:', err));
            }
            
            res.json({ success: true, message: 'Session completed' });
            return;
        }
    }
    
    res.status(404).json({ success: false, error: 'Session not found' });
});

// Get user stats
app.get('/api/user/stats/:userId', (req, res) => {
    const { userId } = req.params;
    
    if (userSessions[userId]) {
        res.json({
            totalSessions: userSessions[userId].totalSessions,
            recentSessions: userSessions[userId].sessions.slice(-5)
        });
    } else {
        res.json({ totalSessions: 0, recentSessions: [] });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ TELEGRAM BOT HANDLERS ============

if (bot) {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        
        bot.sendMessage(chatId, 
            '🕌 Welcome to Sukun - Islamic Panic Relief\n\n' +
            'When you\'re experiencing panic or anxiety, tap the button below to access immediate relief through Islamic practices.\n\n' +
            'Sukun guides you through Quranic verses, breathing exercises with dhikr, and du\'as (supplications) tailored for acute anxiety.\n\n' +
            'Remember: "Unquestionably, by the remembrance of Allah hearts find rest." - Surah Ar-Ra\'d 13:28',
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🆘 Open Sukun Relief App', web_app: { url: WEBHOOK_URL } }]
                    ]
                }
            }
        );
    });

    bot.onText(/\/stats/, (msg) => {
        const userId = msg.chat.id;
        
        if (userSessions[userId] && userSessions[userId].totalSessions > 0) {
            const stats = userSessions[userId];
            bot.sendMessage(userId, 
                `📊 Your Sukun Statistics\n\n` +
                `Total relief sessions: ${stats.totalSessions}\n\n` +
                `✨ You're building strength with every session!\n` +
                `Each time you practice these techniques, you\'re training your mind and heart to find peace.`
            );
        } else {
            bot.sendMessage(userId, 
                '📊 No sessions yet.\n\n' +
                'Start your first relief session when you need it. Sukun is here for you whenever panic strikes.',
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🆘 Open Sukun Relief App', web_app: { url: WEBHOOK_URL } }]
                        ]
                    }
                }
            );
        }
    });

    bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        
        bot.sendMessage(chatId,
            `ℹ️ Sukun Commands\n\n` +
            `/start - Open the Sukun relief app\n` +
            `/stats - View your session statistics\n` +
            `/help - Show this help message\n\n` +
            `About Sukun:\n` +
            `Sukun is an Islamic panic relief app that combines:\n` +
            `📖 Quranic verses\n` +
            `🕌 Du\'as (supplications)\n` +
            `🧘 Breathing exercises with dhikr\n` +
            `🌿 Grounding techniques\n\n` +
            `Use Sukun when you experience panic attacks, anxiety, or moments when you need spiritual comfort.`
        );
    });
}

// ============ WEBHOOK HANDLING ============

app.post('/webhook', (req, res) => {
    if (bot) {
        bot.processUpdate(req.body);
    }
    res.sendStatus(200);
});

// Set webhook if in production and bot is available
if (bot && process.env.NODE_ENV === 'production' && WEBHOOK_URL) {
    bot.setWebHook(WEBHOOK_URL + '/webhook').catch(err => {
        console.log('Webhook setup error:', err);
    });
}

// ============ ERROR HANDLING ============

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ============ START SERVER ============

app.listen(PORT, () => {
    console.log(`🚀 Sukun Telegram Mini App running on port ${PORT}`);
    console.log(`📱 Webhook URL: ${WEBHOOK_URL}`);
    console.log(`🤖 Bot Token: ${BOT_TOKEN ? 'Configured' : 'NOT SET'}`);
});

module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sendWhatsAppMessage = require('./services/whatsapp')
const { connectDB, User } = require('./mdb');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ─── Connect DB ───────────────────────────────────────────────────────────────
connectDB();

// ─── Routes ───────────────────────────────────────────────────────────────────

// Register a new user
app.post('/api/register', async (req, res) => {

    const { name, password, mobile } = req.body;

    if (!name || !password || !mobile) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }

    try {
        const existing = await User.findOne({ mobile });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Mobile number already registered.'
            });
        }
        // const formattedMobile = mobile.replace(/\D/g, '');
        const user = await User.create({
            name,
            password,
            mobile
        });
    
        // Send WhatsApp message
        await sendWhatsAppMessage(mobile, name);
    
        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            userId: user._id
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors)
                .map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(' ')
            });
        }
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
});

// Login an existing user
app.post('/api/login', async (req, res) => {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
        return res.status(400).json({ success: false, message: 'Mobile and password are required.' });
    }

    try {
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        res.json({ success: true, message: 'Login successful.', name: user.name, userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

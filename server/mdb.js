const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

// ─── User Schema ──────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        mobile: {
            type: String,
            required: [true, 'Mobile number is required'],
            unique: true,
            // match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits'],
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Helper: compare plain password with stored hash
userSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = { connectDB, User };

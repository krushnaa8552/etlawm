'use strict';
/**
 * ─── OTP Service ─────────────────────────────────────────────────────────────
 * Handles generation, hashing, verification, and delivery of one-time passwords.
 * OTPs are NEVER stored or transmitted in plaintext — only bcrypt hashes land
 * in the database.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import * as wa from '../scrap.js';

const OTP_LENGTH = 6;
const BCRYPT_ROUNDS = 10;
const WA_OTP_TEMPLATE = process.env.WA_OTP_TEMPLATE || 'otp_auth'; // Meta-approved template name

/**
 * Generate a cryptographically random numeric OTP.
 * @returns {string} Zero-padded 6-digit string, e.g. "048291"
 */
function generateOtp() {
    // Random integer in [0, 999999], zero-padded to OTP_LENGTH digits
    const raw = crypto.randomInt(0, 10 ** OTP_LENGTH);
    return String(raw).padStart(OTP_LENGTH, '0');
}

/**
 * Hash an OTP with bcrypt.
 * @param {string} otp
 * @returns {Promise<string>} bcrypt hash
 */
async function hashOtp(otp) {
    return bcrypt.hash(otp, BCRYPT_ROUNDS);
}

/**
 * Securely compare a plaintext OTP against its stored bcrypt hash.
 * @param {string} otp       Plaintext OTP supplied by the user
 * @param {string} hash      bcrypt hash from the database
 * @returns {Promise<boolean>}
 */
async function verifyOtp(otp, hash) {
    return bcrypt.compare(otp, hash);
}

/**
 * Send an OTP to the given phone number.
 *
 * In production: calls the WhatsApp Cloud API via an approved OTP template.
 * In development (ACCESS_TOKEN not set): logs the OTP to the console so you
 *   can test without a real WhatsApp integration.
 *
 * @param {string} phone   E.164-formatted number, e.g. "919876543210"
 * @param {string} otp     Plaintext OTP to deliver
 */
async function sendOtp(phone, otp) {
    // ── ALWAYS print OTP to console during building/testing ──
    console.log(`\n[OTP Service] ── DEBUG/DEV ──`);
    console.log(`[OTP Service] Phone : ${phone}`);
    console.log(`[OTP Service] OTP   : ${otp}`);
    console.log(`[OTP Service] ───────────────────\n`);

    const token = process.env.WHATSAPP_TOKEN || process.env.YOUR_ACCESS_TOKEN;

    if (!token) {
        return;
    }

    // ── Production: WhatsApp OTP template ────────────────────────────────────
    // The template must be named per WA_OTP_TEMPLATE and pre-approved in Meta
    // Business Manager with one body parameter containing the OTP code.
    try {
        await wa.sendWhatsAppMessage(phone, otp, WA_OTP_TEMPLATE);
    } catch (err) {
        // Non-fatal: log the error but don't crash the request.
        // The caller will still return the generic "OTP sent" response.
        console.error('[OTP Service] WhatsApp delivery failed:', err.message);
    }
}

const otpService = { generateOtp, hashOtp, verifyOtp, sendOtp };

export default otpService;

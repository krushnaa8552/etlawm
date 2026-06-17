import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { colours, fonts } from '../theme/theme.js';
import CustomSelect from '../Components/CustomSelect';

const API = import.meta.env.VITE_SERVER_API;

/* ── Icons ── */
const IconPhone = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
);
const IconUser = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
const IconGoogle = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);
const IconApple = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1d1d1f">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
);
const IconFacebook = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

/* ── Shared input class ── */
const INPUT_CLS = "w-full border px-[14px] py-[11px] pl-[38px] text-[13px] outline-none tracking-[0.3px] transition-all duration-200 placeholder:text-[#C4BAB3] placeholder:font-light";
const LABEL_CLS = "text-[10px] font-bold tracking-[1.5px] uppercase";
const BTN_CLS   = "mt-[6px] py-[13px] border-none text-[12px] font-bold tracking-[2px] uppercase cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

/* ── OTP digit input box ── */
function OtpBox({ idx, value, onChange, onKeyDown, inputRef }) {
    const [focused, setFocused] = useState(false);
    return (
        <input
            ref={inputRef}
            id={`otp-digit-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={e => onChange(idx, e.target.value)}
            onKeyDown={e => onKeyDown(idx, e)}
            className="w-11 h-12 text-center text-[28px] font-semibold border outline-none transition-all duration-200 tracking-widest"
            style={{
                fontFamily: fonts.primary,
                borderColor: focused ? colours.accent : colours.border,
                background: colours.background,
                color: colours.text,
                boxShadow: focused ? `0 0 0 3px ${colours.hover}33` : 'none',
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="one-time-code"
        />
    );
}

/* ── Status banner ── */
function StatusBanner({ msg, type }) {
    if (!msg) return null;
    const cls = type === 'success'
        ? 'bg-[rgba(80,180,120,0.08)] text-[#4a9e6e] border-[rgba(80,180,120,0.2)]'
        : 'bg-[rgba(200,70,70,0.07)] text-[#b85555] border-[rgba(200,70,70,0.18)]';
    return (
        <p className={`text-[12px] px-[13px] py-[9px] tracking-[0.2px] leading-[1.5] border ${cls}`}>
            {msg}
        </p>
    );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   step 0 = phone entry
   step 1 = OTP verification
   step 2 = name entry (new users only)
   ════════════════════════════════════════════════════════════════════════════ */
const Login = () => {
    const navigate  = useNavigate();
    const { login, token, user, loading: authLoading, isAdmin } = useAuth();

    const [step,    setStep]    = useState(0);
    const [phone,   setPhone]   = useState('');
    const [cc,      setCc]      = useState('+91');
    const [digits,  setDigits]  = useState(Array(6).fill(''));
    const [name,    setName]    = useState({ first: '', last: '' });
    const [status,  setStatus]  = useState({ msg: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [resend,  setResend]  = useState(0);   // countdown seconds
    const [pendingToken, setPendingToken] = useState(null);
    const [pendingUser,  setPendingUser]  = useState(null);

    const digitRefs = useRef([]);

    /* Redirect if already logged in */
    useEffect(() => {
        if (!authLoading && token && user) {
            if (isAdmin) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [token, user, authLoading, isAdmin, navigate]);

    /* Resend countdown timer */
    useEffect(() => {
        if (resend <= 0) return;
        const t = setTimeout(() => setResend(r => r - 1), 1000);
        return () => clearTimeout(t);
    }, [resend]);

    const err  = (msg) => setStatus({ msg, type: 'error' });
    const ok   = (msg) => setStatus({ msg, type: 'success' });
    const clr  = ()    => setStatus({ msg: '', type: '' });

    /* ── Step 0: Send OTP ── */
    const handleSendOtp = async (e) => {
        e?.preventDefault();
        clr();
        const raw = phone.replace(/\D/g, '');
        if (raw.length < 7) return err('Please enter a valid phone number.');
        setLoading(true);
        try {
            const res  = await fetch(`${API}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: raw, country_code: cc }),
            });
            const data = await res.json();
            if (!data.success) return err(data.message);
            ok('OTP sent! Check your WhatsApp.');
            setStep(1);
            setResend(60);
            setTimeout(() => digitRefs.current[0]?.focus(), 100);
        } catch {
            err('Could not reach server. Is it running?');
        } finally {
            setLoading(false);
        }
    };

    /* ── OTP box change / backspace ── */
    const handleDigitChange = (idx, val) => {
        const char = val.replace(/\D/g, '').slice(-1);
        const next = [...digits];
        next[idx]  = char;
        setDigits(next);
        if (char && idx < 5) digitRefs.current[idx + 1]?.focus();
    };

    const handleDigitKeyDown = (idx, e) => {
        if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
            digitRefs.current[idx - 1]?.focus();
        }
    };

    /* Paste full OTP */
    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const next = Array(6).fill('');
        pasted.split('').forEach((c, i) => { next[i] = c; });
        setDigits(next);
        const lastFilled = Math.min(pasted.length, 5);
        setTimeout(() => digitRefs.current[lastFilled]?.focus(), 50);
    };

    /* ── Step 1: Verify OTP ── */
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        clr();
        const otp = digits.join('');
        if (otp.length !== 6) return err('Please enter all 6 digits.');
        setLoading(true);
        try {
            const raw = phone.replace(/\D/g, '');
            const res  = await fetch(`${API}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: raw, country_code: cc, otp }),
            });
            const data = await res.json();
            if (!data.success) return err(data.message);

            if (data.isNewUser || !data.user.first_name) {
                /* New user or existing user without name — save token/user temporarily, go to name step */
                setPendingToken(data.token);
                setPendingUser(data.user);
                clr();
                setStep(2);
            } else {
                /* Existing user — log in immediately */
                login(data.token, data.user);
                if (data.user.is_admin) {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }
            }
        } catch {
            err('Could not reach server. Is it running?');
        } finally {
            setLoading(false);
        }
    };

    /* ── Step 2: Save name (onboarding) ── */
    const handleOnboard = async (e) => {
        e.preventDefault();
        clr();
        if (!name.first.trim()) return err('First name is required.');
        setLoading(true);
        try {
            const res  = await fetch(`${API}/api/auth/onboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${pendingToken}`,
                },
                body: JSON.stringify({ first_name: name.first.trim(), last_name: name.last.trim() || undefined }),
            });
            const data = await res.json();
            if (!data.success) return err(data.message);
            login(data.token, data.user);
            if (data.user.is_admin) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch {
            err('Could not reach server. Is it running?');
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: (r) => console.log(r),
        onError:   ()  => console.log('Google login failed'),
    });

    /* ── Helpers for UI text ── */
    const headings = ['Welcome', 'Verify OTP', 'Almost There'];
    const subtitles = [
        'Enter your mobile number to get started.',
        `We sent a 6-digit code to ${cc} ${phone}.`,
        'Just one more step — tell us your name.',
    ];

    const LoginButton = ({ children, onClick, disabled, type = "submit" }) => {
        const [hovered, setHovered] = useState(false);
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={BTN_CLS}
                style={{
                    fontFamily: fonts.secondary,
                    background: hovered ? colours.secondary : colours.accent,
                    color: colours.background,
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {children}
            </button>
        );
    };

    const LoginInput = ({ id, name, type, placeholder, value, onChange, required, maxLength, autoComplete, icon }) => {
        const [focused, setFocused] = useState(false);
        return (
            <div className="relative flex items-center flex-1">
                {icon && (
                    <span className="absolute left-[14px] pointer-events-none" style={{ color: colours.border, display: 'flex', alignItems: 'center' }}>
                        {icon}
                    </span>
                )}
                <input
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    className={INPUT_CLS}
                    style={{
                        fontFamily: fonts.secondary,
                        background: colours.background,
                        borderColor: focused ? colours.accent : colours.border,
                        color: colours.text,
                        boxShadow: focused ? `0 0 0 3px ${colours.hover}33` : 'none',
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            </div>
        );
    };

    if (authLoading || (token && user)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-mainBackground" style={{ fontFamily: fonts.secondary }}>
                <p className="text-[12px] text-textSecondary tracking-[2px] uppercase font-bold" style={{ color: colours.mutedText }}>Loading session...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-mainBackground" style={{ fontFamily: fonts.secondary }}>
            <div className="w-full max-w-[860px] min-h-[560px] flex bg-white shadow-[0_32px_80px_rgba(43,27,14,0.14)] overflow-hidden animate-[fadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_both] max-sm:max-w-[420px]">

                {/* ── LEFT PANEL ── */}
                <div className="relative flex-[0_0_42%] bg-softSecondary flex-col items-center justify-end px-9 py-10 overflow-hidden max-sm:hidden flex">
                    <div className="absolute inset-0 opacity-50 pointer-events-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")` }}
                    />
                    <div className="absolute top-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-60 bg-[radial-gradient(circle,_var(--color-highlight)_0%,_transparent_70%)]" />
                    <div className="absolute top-8 left-9 text-[11px] font-bold tracking-[5px] uppercase text-deepAccent z-10" style={{ color: colours.secondary }}>ETLAWM</div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] text-[200px] leading-none font-light italic tracking-[-8px] select-none pointer-events-none" style={{ fontFamily: fonts.primary, color: colours.border }}>E</div>

                    {/* Step indicator dots */}
                    <div className="relative z-10 flex flex-col items-center gap-4 mb-6">
                        <div className="flex gap-2">
                            {[0,1,2].map(i => (
                                <span key={i} className="block rounded-full transition-all duration-300" style={{ width: i === step ? '20px' : '8px', height: '8px', background: i === step ? colours.accent : colours.border }} />
                            ))}
                        </div>
                        <p className="text-[16px] italic font-light leading-[1.6] text-center" style={{ fontFamily: fonts.primary, color: colours.mutedText }}>
                            Rooted in nature,<br />refined by ritual.
                        </p>
                        <span className="block w-8 h-px" style={{ background: colours.accent }} />
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="flex-1 flex flex-col justify-center px-12 py-[52px] bg-white max-sm:px-7 max-sm:py-10">

                    <h2 className="text-[34px] font-semibold mb-[6px] leading-[1.15]" style={{ fontFamily: fonts.primary, color: colours.text }}>
                        {headings[step]}
                    </h2>
                    <p className="text-[12px] font-normal tracking-[0.3px] mb-8 leading-[1.6]" style={{ fontFamily: fonts.secondary, color: colours.mutedText }}>
                        {subtitles[step]}
                    </p>

                    {/* ══ STEP 0 — Phone entry ══ */}
                    {step === 0 && (
                        <form className="flex flex-col gap-4" onSubmit={handleSendOtp} noValidate>
                            <div className="flex flex-col gap-[6px]">
                                <label className={LABEL_CLS} style={{ fontFamily: fonts.primary, color: colours.mutedText }}>Mobile Number</label>
                                <div className="flex gap-2">
                                    {/* Country code */}
                                    <CustomSelect
                                        value={cc}
                                        onChange={(val) => setCc(val)}
                                        options={[
                                            { value: "+91", label: "🇮🇳 +91" },
                                            { value: "+1", label: "🇺🇸 +1" },
                                            { value: "+44", label: "🇬🇧 +44" },
                                            { value: "+971", label: "🇦🇪 +971" },
                                            { value: "+65", label: "🇸🇬 +65" },
                                            { value: "+61", label: "🇦🇺 +61" },
                                        ]}
                                        inputClassName="border px-2 py-[11px] text-[13px] outline-none transition-all duration-200 cursor-pointer min-w-[84px] h-auto rounded-none"
                                        optionClassName="px-3 py-2 text-[13px]"
                                    />
                                    {/* Phone */}
                                    <LoginInput
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="10-digit number"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        required
                                        maxLength={12}
                                        autoComplete="tel"
                                        icon={<IconPhone />}
                                    />
                                </div>
                            </div>

                            <StatusBanner {...status} />

                            <LoginButton disabled={loading}>
                                {loading ? 'Sending…' : 'Send OTP'}
                            </LoginButton>
                        </form>
                    )}

                    {/* ══ STEP 1 — OTP verification ══ */}
                    {step === 1 && (
                        <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp} noValidate>
                            {/* 6 digit boxes */}
                            <div className="flex flex-col gap-[6px]">
                                <label className={LABEL_CLS} style={{ fontFamily: fonts.secondary, color: colours.mutedText }}>Enter OTP</label>
                                <div
                                    className="flex gap-2"
                                    onPaste={handleOtpPaste}
                                >
                                    {digits.map((d, i) => (
                                        <OtpBox
                                            key={i}
                                            idx={i}
                                            value={d}
                                            onChange={handleDigitChange}
                                            onKeyDown={handleDigitKeyDown}
                                            inputRef={el => digitRefs.current[i] = el}
                                        />
                                    ))}
                                </div>
                            </div>

                            <StatusBanner {...status} />

                            <LoginButton disabled={loading}>
                                {loading ? 'Verifying…' : 'Verify OTP'}
                            </LoginButton>

                            {/* Resend row */}
                            <p className="text-[12px] text-center tracking-[0.2px]" style={{ fontFamily: fonts.secondary, color: colours.mutedText }}>
                                {resend > 0
                                    ? `Resend in ${resend}s`
                                    : <>Didn't receive it?{' '}
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            className="bg-none border-none text-[12px] font-bold tracking-[0.5px] cursor-pointer underline underline-offset-[3px]"
                                            style={{ color: colours.secondary }}
                                            onMouseEnter={e => e.currentTarget.style.color = colours.accent}
                                            onMouseLeave={e => e.currentTarget.style.color = colours.secondary}
                                        >
                                            Resend OTP
                                        </button>
                                    </>}
                            </p>

                            <button
                                type="button"
                                onClick={() => { setStep(0); setDigits(Array(6).fill('')); clr(); }}
                                className="text-[11px] underline underline-offset-[3px] cursor-pointer bg-none border-none text-center"
                                style={{ fontFamily: fonts.secondary, color: colours.mutedText }}
                                onMouseEnter={e => e.currentTarget.style.color = colours.accent}
                                onMouseLeave={e => e.currentTarget.style.color = colours.mutedText}
                            >
                                ← Change number
                            </button>
                        </form>
                    )}

                    {/* ══ STEP 2 — Name onboarding ══ */}
                    {step === 2 && (
                        <form className="flex flex-col gap-4" onSubmit={handleOnboard} noValidate>
                            <div className="flex flex-col gap-[6px]">
                                <label htmlFor="first_name" className={LABEL_CLS} style={{ fontFamily: fonts.secondary, color: colours.mutedText }}>First Name <span style={{ color: colours.accent }}>*</span></label>
                                <LoginInput
                                    id="first_name"
                                    type="text"
                                    placeholder="Your first name"
                                    value={name.first}
                                    onChange={e => setName(p => ({ ...p, first: e.target.value }))}
                                    required
                                    autoComplete="given-name"
                                    icon={<IconUser />}
                                />
                            </div>

                            <div className="flex flex-col gap-[6px]">
                                <label htmlFor="last_name" className={LABEL_CLS} style={{ fontFamily: fonts.secondary, color: colours.mutedText }}>Last Name <span className="font-normal normal-case tracking-normal" style={{ color: colours.border }}>(optional)</span></label>
                                <LoginInput
                                    id="last_name"
                                    type="text"
                                    placeholder="Your last name"
                                    value={name.last}
                                    onChange={e => setName(p => ({ ...p, last: e.target.value }))}
                                    autoComplete="family-name"
                                    icon={<IconUser />}
                                />
                            </div>

                            <StatusBanner {...status} />

                            <LoginButton disabled={loading}>
                                {loading ? 'Saving…' : 'Continue to Dashboard →'}
                            </LoginButton>
                        </form>
                    )}

                    {/* ── Social divider (steps 0 only) ── */}
                    {step === 0 && (<>
                        <div className="flex items-center gap-3 my-5 before:content-[''] before:flex-1 before:h-px after:content-[''] after:flex-1 after:h-px" style={{ contentVisibility: 'auto' }}>
                            <span className="text-[10px] tracking-[1px] uppercase whitespace-nowrap" style={{ fontFamily: fonts.secondary, color: colours.border }}>or Continue With</span>
                        </div>
                        <div className="flex items-center justify-center gap-[14px] mb-1">
                            {[
                                { icon: <IconGoogle />,   label: 'Google',   action: () => googleLogin() },
                                { icon: <IconApple />,    label: 'Apple',    action: () => {} },
                                { icon: <IconFacebook />, label: 'Facebook', action: () => {} },
                            ].map(({ icon, label, action }) => {
                                return (
                                    <SocialButton key={label} icon={icon} label={label} onClick={action} />
                                );
                            })}
                        </div>
                    </>)}
                </div>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

/* ── Social button helper with internal state for hover ── */
function SocialButton({ icon, label, onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`Continue with ${label}`}
            className="flex items-center justify-center w-11 h-11 border bg-white rounded-full transition-all duration-200"
            style={{
                borderColor: hovered ? colours.accent : colours.border,
                boxShadow: hovered ? `0 4px 14px ${colours.hover}33` : 'none',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {icon}
        </button>
    );
}

export default Login;
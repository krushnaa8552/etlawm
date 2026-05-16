import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const API = 'http://localhost:5000/api';

/* ── tiny inline SVG icons ── */
const IconPhone = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
);

const IconLock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);

const IconUser = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);

/* ── Social login icons ── */
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

const Login = () => {
    const [mode, setMode] = useState('register');
    const [form, setForm] = useState({ name: '', password: '', mobile: '' });
    const [status, setStatus] = useState({ msg: '', type: '' });
    const [loading, setLoading] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: (credentialResponse) => console.log(credentialResponse),
        onError: () => console.log('Login Failed'),
    });

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ msg: '', type: '' });
        setLoading(true);

        const endpoint = mode === 'register' ? '/register' : '/login';

        const body =
            mode === 'register'
                ? {
                      name: form.name,
                      password: form.password,
                      mobile: form.mobile,
                  }
                : {
                      mobile: form.mobile,
                      password: form.password,
                  };

        try {
            const res = await fetch(`${API}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            setStatus({
                msg: data.message,
                type: data.success ? 'success' : 'error',
            });
        } catch {
            setStatus({
                msg: 'Could not reach server. Is it running?',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const toggle = () => {
        setMode((m) => (m === 'register' ? 'login' : 'register'));
        setStatus({ msg: '', type: '' });
        setForm({ name: '', password: '', mobile: '' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F3EE] p-6 font-['Josefin_Sans']">
            <div className="w-full max-w-[860px] min-h-[560px] flex bg-white shadow-[0_32px_80px_rgba(43,27,14,0.14)] overflow-hidden animate-[fadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_both] max-sm:max-w-[420px]">

                {/* LEFT PANEL */}
                <div className="relative flex-[0_0_42%] bg-[#EFE7DE] flex-col items-center justify-end px-9 py-10 overflow-hidden max-sm:hidden flex">

                    {/* Grain texture */}
                    <div
                        className="absolute inset-0 opacity-50 pointer-events-none"
                        style={{
                            backgroundImage:
                                `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Decorative circle */}
                    <div className="absolute top-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-60 bg-[radial-gradient(circle,_#F5DCC8_0%,_transparent_70%)]" />

                    <div className="absolute top-8 left-9 text-[11px] font-bold tracking-[5px] uppercase text-[#8B6B5A] z-10">
                        ETLAWM
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] text-[200px] leading-none font-['Cormorant_Garamond'] font-light italic text-[#DDD2C7] tracking-[-8px] select-none pointer-events-none">
                        E
                    </div>

                    <div className="relative z-10 text-center">
                        <p className="font-['Cormorant_Garamond'] text-[16px] italic font-light text-[#6E6A67] leading-[1.6]">
                            Rooted in nature,
                            <br />
                            refined by ritual.
                        </p>

                        <span className="block w-8 h-px bg-[#C7A58A] mt-[14px] mx-auto" />
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex-1 flex flex-col justify-center px-12 py-[52px] bg-white max-sm:px-7 max-sm:py-10">

                    <h2 className="font-['Cormorant_Garamond'] text-[34px] font-semibold text-[#2B2B2B] mb-[6px] leading-[1.15]">
                        {mode === 'register'
                            ? 'Create Account'
                            : 'Welcome Back'}
                    </h2>

                    <p className="text-[12px] font-normal tracking-[0.3px] text-[#6E6A67] mb-8 leading-[1.6]">
                        {mode === 'register'
                            ? 'Join us for an exclusive herbal hair care experience.'
                            : 'Sign in to continue your journey.'}
                    </p>

                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        {mode === 'register' && (
                            <div className="flex flex-col gap-[6px]">
                                <label
                                    htmlFor="name"
                                    className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#6E6A67]"
                                >
                                    Full Name
                                </label>

                                <div className="relative flex items-center">
                                    <span className="absolute left-[14px] text-[#DDD2C7] text-[14px] pointer-events-none">
                                        <IconUser />
                                    </span>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Your full name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        autoComplete="name"
                                        className="w-full bg-[#F7F3EE] border border-[#DDD2C7] px-[14px] py-[11px] pl-[38px] text-[13px] text-[#2B2B2B] outline-none tracking-[0.3px] transition-all duration-200 placeholder:text-[#C4BAB3] placeholder:font-light focus:border-[#C7A58A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(199,165,138,0.12)]"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-[6px]">
                            <label
                                htmlFor="mobile"
                                className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#6E6A67]"
                            >
                                Mobile Number
                            </label>

                            <div className="relative flex items-center">
                                <span className="absolute left-[14px] text-[#DDD2C7] text-[14px] pointer-events-none">
                                    <IconPhone />
                                </span>

                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="tel"
                                    placeholder="10-digit number"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    required
                                    maxLength={12}
                                    autoComplete="tel"
                                    className="w-full bg-[#F7F3EE] border border-[#DDD2C7] px-[14px] py-[11px] pl-[38px] text-[13px] text-[#2B2B2B] outline-none tracking-[0.3px] transition-all duration-200 placeholder:text-[#C4BAB3] placeholder:font-light focus:border-[#C7A58A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(199,165,138,0.12)]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label
                                htmlFor="password"
                                className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#6E6A67]"
                            >
                                Password
                            </label>

                            <div className="relative flex items-center">
                                <span className="absolute left-[14px] text-[#DDD2C7] text-[14px] pointer-events-none">
                                    <IconLock />
                                </span>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete={
                                        mode === 'register'
                                            ? 'new-password'
                                            : 'current-password'
                                    }
                                    className="w-full bg-[#F7F3EE] border border-[#DDD2C7] px-[14px] py-[11px] pl-[38px] text-[13px] text-[#2B2B2B] outline-none tracking-[0.3px] transition-all duration-200 placeholder:text-[#C4BAB3] placeholder:font-light focus:border-[#C7A58A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(199,165,138,0.12)]"
                                />
                            </div>
                        </div>

                        {status.msg && (
                            <p
                                className={`text-[12px] px-[13px] py-[9px] tracking-[0.2px] leading-[1.5] border ${
                                    status.type === 'success'
                                        ? 'bg-[rgba(80,180,120,0.08)] text-[#4a9e6e] border-[rgba(80,180,120,0.2)]'
                                        : 'bg-[rgba(200,70,70,0.07)] text-[#b85555] border-[rgba(200,70,70,0.18)]'
                                }`}
                            >
                                {status.msg}
                            </p>
                        )}

                        <button
                            className="mt-[6px] py-[13px] border-none bg-[#C7A58A] text-white text-[12px] font-bold tracking-[2px] uppercase cursor-pointer transition-all duration-200 hover:bg-[#8B6B5A] hover:shadow-[0_4px_16px_rgba(139,107,90,0.28)] disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? 'Please wait…'
                                : mode === 'register'
                                ? 'Create Account'
                                : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5 before:content-[''] before:flex-1 before:h-px before:bg-[#DDD2C7] after:content-[''] after:flex-1 after:h-px after:bg-[#DDD2C7]">
                        <span className="text-[10px] tracking-[1px] uppercase text-[#C4BAB3] whitespace-nowrap">
                            or Continue With
                        </span>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center justify-center gap-[14px] mb-1">

                        <button
                            className="flex items-center justify-center w-11 h-11 border border-[#DDD2C7] bg-white rounded-full transition-all duration-200 hover:border-[#C7A58A] hover:shadow-[0_4px_14px_rgba(199,165,138,0.22)]"
                            aria-label="Continue with Google"
                            onClick={() => googleLogin()}
                        >
                            <IconGoogle />
                        </button>

                        <button
                            className="flex items-center justify-center w-11 h-11 border border-[#DDD2C7] bg-white rounded-full transition-all duration-200 hover:border-[#C7A58A] hover:shadow-[0_4px_14px_rgba(199,165,138,0.22)]"
                            aria-label="Continue with Apple"
                        >
                            <IconApple />
                        </button>

                        <button
                            className="flex items-center justify-center w-11 h-11 border border-[#DDD2C7] bg-white rounded-full transition-all duration-200 hover:border-[#C7A58A] hover:shadow-[0_4px_14px_rgba(199,165,138,0.22)]"
                            aria-label="Continue with Facebook"
                        >
                            <IconFacebook />
                        </button>

                    </div>

                    {/* Toggle */}
                    <p className="mt-5 text-[12px] text-[#6E6A67] text-center tracking-[0.2px]">
                        {mode === 'register'
                            ? 'Already have an account?'
                            : "Don't have an account?"}{' '}

                        <button
                            className="bg-none border-none text-[#8B6B5A] text-[12px] font-bold tracking-[0.5px] cursor-pointer underline underline-offset-[3px] transition-colors duration-200 hover:text-[#C7A58A]"
                            onClick={toggle}
                        >
                            {mode === 'register' ? 'Sign in' : 'Register'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Animation */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@300;400;600;700&display=swap');

                    @keyframes fadeUp {
                        from {
                            opacity: 0;
                            transform: translateY(28px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Login;
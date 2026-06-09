import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colours, fonts } from '../theme/theme.js';

const API = import.meta.env.VITE_SERVER_API;

const DashBoard = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profileDismissed, setProfileDismissed] = useState(false);
    const [whatsappOptIn, setWhatsappOptIn] = useState(user?.whatsapp_opt_in ?? false);
    const [whatsappSaved, setWhatsappSaved] = useState(false);

    const handleWhatsappToggle = (e) => {
        setWhatsappOptIn(e.target.checked);
        setWhatsappSaved(false);
    };

    const handleWhatsappSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/api/whatsapp/optin`, {
                method:  'PATCH',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ consent: whatsappOptIn }),
            });
            const data = await res.json();
            if (data.success) {
                setWhatsappOptIn(data.whatsapp_opt_in);
                setWhatsappSaved(true);
            } else {
                console.error('[whatsapp-optin]', data.message);
            }
        } catch (err) {
            console.error('[whatsapp-optin] network error', err);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const firstName   = user?.first_name || 'there';
    const isIncomplete = !user?.email; // prompt if email not set yet

    return (
        <div className="min-h-screen bg-mainBackground" style={{ fontFamily: fonts.secondary }}>

            {/* ── Top Bar ── */}
            <header className="flex items-center justify-between px-10 py-5 bg-white border-b border-softSecondary shadow-[0_2px_12px_rgba(43,27,14,0.06)]">
                <span className="text-[13px] font-bold tracking-[4px] uppercase text-deepAccent" style={{ fontFamily: fonts.secondary }}>ETLAWM</span>
                <div className="flex items-center gap-4">
                    <span className="text-[12px] text-textSecondary tracking-[0.3px]" style={{ fontFamily: fonts.secondary }}>
                        {user?.phone_number}
                    </span>
                    <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="px-5 py-[9px] text-[11px] font-bold tracking-[2px] uppercase border transition-all duration-200 cursor-pointer"
                        style={{
                            fontFamily: fonts.secondary,
                            borderColor: colours.border,
                            color: colours.secondary,
                            background: colours.background,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = colours.accent;
                            e.currentTarget.style.color = colours.accent;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = colours.border;
                            e.currentTarget.style.color = colours.secondary;
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-[900px] mx-auto px-6 pt-14 pb-20">

                {/* ── Welcome heading ── */}
                <div className="mb-10">
                    <p className="text-[11px] font-bold tracking-[4px] uppercase text-primaryAccent mb-2" style={{ fontFamily: fonts.secondary }}>Welcome back</p>
                    <h1 className="text-[42px] leading-[1.1] font-semibold text-textPrimary"
                        style={{ fontFamily: fonts.primary }}>
                        Hello, {firstName}.
                    </h1>
                    <span className="block w-12 h-px bg-primaryAccent mt-4" style={{ background: colours.accent }} />
                </div>

                {/* ── Profile completion prompt (non-blocking) ── */}
                {isIncomplete && !profileDismissed && (
                    <div className="mb-8 flex items-start justify-between gap-4 border border-borderColor bg-white px-6 py-5 shadow-[0_4px_20px_rgba(43,27,14,0.06)]">
                        <div>
                            <p className="text-[11px] font-bold tracking-[2px] uppercase text-primaryAccent mb-1" style={{ fontFamily: fonts.secondary }}>Complete your profile</p>
                            <p className="text-[13px] text-textSecondary leading-[1.6]" style={{ fontFamily: fonts.secondary }}>
                                Add your email and address to enjoy faster checkout and order updates.
                            </p>
                        </div>
                        <button
                            onClick={() => setProfileDismissed(true)}
                            aria-label="Dismiss"
                            className="text-[18px] text-[#C4BAB3] hover:text-deepAccent cursor-pointer bg-none border-none leading-none mt-[2px] shrink-0"
                            style={{ fontFamily: fonts.secondary }}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* ── Quick links ── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                        { label: 'Shop Collection', href: '/collection', sub: 'Browse all products' },
                        { label: 'My Cart',         href: '/cart',       sub: 'View saved items' },
                        { label: 'My Orders',       href: '#',           sub: 'Coming soon' },
                    ].map(({ label, href, sub }) => (
                        <a
                            key={label}
                            href={href}
                            className="group block border border-borderColor bg-white px-6 py-5 transition-all duration-200 hover:border-primaryAccent hover:shadow-[0_6px_24px_rgba(199,165,138,0.16)] no-underline"
                        >
                            <p className="text-[12px] font-bold tracking-[1.5px] uppercase text-textPrimary group-hover:text-deepAccent transition-colors duration-200" style={{ fontFamily: fonts.secondary }}>{label}</p>
                            <p className="text-[12px] text-[#C4BAB3] mt-1" style={{ fontFamily: fonts.secondary }}>{sub}</p>
                        </a>
                    ))}
                </div>

                {/* ── WhatsApp Opt-In ── */}
                <div className="mt-8 border border-borderColor bg-white px-6 py-6 shadow-[0_4px_20px_rgba(43,27,14,0.06)]">
                    <p className="text-[11px] font-bold tracking-[3px] uppercase text-primaryAccent mb-3" style={{ fontFamily: fonts.secondary }}>Notifications</p>
                    <label
                        htmlFor="whatsapp-optin"
                        className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                        {/* custom checkbox */}
                        <span className="relative flex-shrink-0 w-[18px] h-[18px]">
                            <input
                                id="whatsapp-optin"
                                type="checkbox"
                                checked={whatsappOptIn}
                                onChange={handleWhatsappToggle}
                                className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            />
                            <span
                                className="block w-[18px] h-[18px] border border-borderColor bg-white
                                           peer-checked:border-primaryAccent peer-checked:bg-primaryAccent
                                           transition-all duration-200 flex items-center justify-center"
                                style={{
                                    borderColor: colours.border,
                                }}
                            >
                                {whatsappOptIn && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </span>
                        </span>
                        <span className="text-[13px] text-textSecondary leading-[1.6] group-hover:text-textPrimary transition-colors duration-200" style={{ fontFamily: fonts.secondary }}>
                            I agree to receive WhatsApp updates
                        </span>
                    </label>
                    <p className="text-[11px] text-[#C4BAB3] mt-2 ml-[27px] leading-[1.5]" style={{ fontFamily: fonts.secondary }}>
                        Get order confirmations, shipping updates, and exclusive offers directly on WhatsApp.
                    </p>
                    <div className="flex items-center gap-3 mt-4 ml-[27px]">
                        <button
                            id="whatsapp-optin-save"
                            onClick={handleWhatsappSave}
                            disabled={whatsappSaved}
                            className="px-5 py-[9px] text-[11px] font-bold tracking-[2px] uppercase border bg-white
                                       transition-all duration-200 cursor-pointer
                                       disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                                fontFamily: fonts.secondary,
                                borderColor: colours.accent,
                                color: colours.accent,
                            }}
                            onMouseEnter={e => {
                                if (!whatsappSaved) {
                                    e.currentTarget.style.background = colours.accent;
                                    e.currentTarget.style.color = colours.background;
                                }
                            }}
                            onMouseLeave={e => {
                                if (!whatsappSaved) {
                                    e.currentTarget.style.background = colours.background;
                                    e.currentTarget.style.color = colours.accent;
                                }
                            }}
                        >
                            Save Preferences
                        </button>
                        {whatsappSaved && (
                            <span className="flex items-center gap-1 text-[11px] text-primaryAccent font-bold tracking-[1px] uppercase" style={{ fontFamily: fonts.secondary }}>
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 5L4.5 8.5L11 1" stroke={colours.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Saved
                            </span>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashBoard;
/**
 * Enterprise Design System Tokens
 * Inspired by Linear, Framer, Vercel, and Stripe
 */

export const colors = {
    // Backgrounds
    bg: {
        primary: '#0B0E14',
        secondary: '#151922',
        tertiary: '#1E2330',
        elevated: '#252B3B',
    },

    // Accents
    accent: {
        blue: '#3B82F6',
        violet: '#8B5CF6',
        cyan: '#06B6D4',
        teal: '#14B8A6',
        purple: '#A855F7',
    },

    // Gradients
    gradient: {
        primary: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        secondary: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
        success: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
        glow: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 50%)',
    },

    // Text
    text: {
        primary: '#E2E8F0',
        secondary: '#CBD5E1',
        muted: '#94A3B8',
        disabled: '#64748B',
    },

    // Semantic
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Borders
    border: {
        subtle: 'rgba(255, 255, 255, 0.05)',
        default: 'rgba(255, 255, 255, 0.1)',
        strong: 'rgba(255, 255, 255, 0.2)',
    },
} as const;

export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
} as const;

export const animation = {
    // Durations
    duration: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
        slower: '500ms',
    },

    // Easings
    easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },

    // Framer Motion Variants
    variants: {
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
        },
        slideDown: {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
        },
        slideLeft: {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 20 },
        },
        scale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
        },
    },

    // Stagger delays for page load
    stagger: {
        background: 0,
        sidebar: 100,
        header: 200,
        cards: 300,
        cardDelay: 80, // delay between each card
    },
} as const;

export const typography = {
    fontFamily: {
        sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        mono: "'JetBrains Mono', 'Fira Code', monospace",
    },

    fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
    },

    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },

    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
} as const;

export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)',
    glowCyan: '0 0 20px rgba(6, 182, 212, 0.3)',
    glowViolet: '0 0 20px rgba(139, 92, 246, 0.3)',
} as const;

export const borderRadius = {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
} as const;

// Glass effect utilities
export const glass = {
    default: {
        background: 'rgba(21, 25, 34, 0.6)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    strong: {
        background: 'rgba(21, 25, 34, 0.8)',
        backdropFilter: 'blur(25px) saturate(200%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
    },
    subtle: {
        background: 'rgba(21, 25, 34, 0.4)',
        backdropFilter: 'blur(15px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
    },
} as const;

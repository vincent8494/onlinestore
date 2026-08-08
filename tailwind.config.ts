import type { Config } from "tailwindcss";

/** Category hues exposed as `brand-*`. Each reads a CSS var so light/dark
 *  swap automatically, and each stays alpha-composable (`bg-brand-pink/10`). */
const brand = {
	blue: 'hsl(var(--hue-blue) / <alpha-value>)',
	violet: 'hsl(var(--hue-violet) / <alpha-value>)',
	pink: 'hsl(var(--hue-pink) / <alpha-value>)',
	amber: 'hsl(var(--hue-amber) / <alpha-value>)',
	teal: 'hsl(var(--hue-teal) / <alpha-value>)',
	lime: 'hsl(var(--hue-lime) / <alpha-value>)',
	orange: 'hsl(var(--hue-orange) / <alpha-value>)',
	cyan: 'hsl(var(--hue-cyan) / <alpha-value>)',
	rose: 'hsl(var(--hue-rose) / <alpha-value>)',
	indigo: 'hsl(var(--hue-indigo) / <alpha-value>)',
};

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				brand,
				/* Retail brand anchors */
				gold: {
					DEFAULT: 'hsl(var(--gold) / <alpha-value>)',
					deep: 'hsl(var(--gold-deep) / <alpha-value>)',
					/* Only gold safe for type on light surfaces */
					ink: 'hsl(var(--gold-ink) / <alpha-value>)',
				},
				ink: {
					DEFAULT: 'hsl(var(--ink) / <alpha-value>)',
					soft: 'hsl(var(--ink-soft) / <alpha-value>)',
				},
				sale: 'hsl(var(--sale) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontSize: {
				'2xs': ['0.6875rem', { lineHeight: '1rem' }],
			},
			boxShadow: {
				/* Coloured glows — the lift under every hovered card */
				'glow-blue': '0 12px 32px -8px hsl(var(--hue-blue) / 0.45)',
				'glow-violet': '0 12px 32px -8px hsl(var(--hue-violet) / 0.45)',
				'glow-pink': '0 12px 32px -8px hsl(var(--hue-pink) / 0.45)',
				'glow-amber': '0 12px 32px -8px hsl(var(--hue-amber) / 0.45)',
				'glow-teal': '0 12px 32px -8px hsl(var(--hue-teal) / 0.45)',
				'glow-lime': '0 12px 32px -8px hsl(var(--hue-lime) / 0.45)',
				'glow-orange': '0 12px 32px -8px hsl(var(--hue-orange) / 0.45)',
				'glow-cyan': '0 12px 32px -8px hsl(var(--hue-cyan) / 0.45)',
				'glow-rose': '0 12px 32px -8px hsl(var(--hue-rose) / 0.45)',
				'glow-indigo': '0 12px 32px -8px hsl(var(--hue-indigo) / 0.45)',
				'glow-gold': '0 12px 32px -8px hsl(var(--gold) / 0.55)',
				'glow-sale': '0 12px 32px -8px hsl(var(--sale) / 0.45)',
				/* Neutral lift — the default card shadow now reads charcoal, not violet */
				'lift': '0 18px 40px -14px hsl(var(--ink) / 0.28)',
				'lift-sm': '0 6px 18px -8px hsl(var(--ink) / 0.20)',
			},
			backgroundImage: {
				/* The brand gradient is now gold; category gradients keep their hues */
				'brand-gradient': 'linear-gradient(120deg, hsl(var(--gold)), hsl(var(--gold-deep)))',
				'ink-gradient': 'linear-gradient(120deg, hsl(var(--ink)), hsl(var(--ink-soft)))',
				'sunrise': 'linear-gradient(120deg, hsl(var(--hue-amber)), hsl(var(--hue-orange)), hsl(var(--hue-rose)))',
				'ocean': 'linear-gradient(120deg, hsl(var(--hue-cyan)), hsl(var(--hue-blue)), hsl(var(--hue-indigo)))',
				'candy': 'linear-gradient(120deg, hsl(var(--hue-pink)), hsl(var(--hue-violet)))',
				'mint': 'linear-gradient(120deg, hsl(var(--hue-lime)), hsl(var(--hue-teal)))',
				'grid-fade': 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
			},
			backgroundSize: {
				'grid': '48px 48px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				/* Entrance */
				'fade-up': {
					from: { opacity: '0', transform: 'translateY(16px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.94)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				/* Ambient */
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-12px)' }
				},
				'blob': {
					'0%, 100%': { transform: 'translate(0, 0) scale(1)' },
					'33%': { transform: 'translate(30px, -40px) scale(1.1)' },
					'66%': { transform: 'translate(-24px, 24px) scale(0.94)' }
				},
				'spin-slow': {
					to: { transform: 'rotate(360deg)' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '0.55' },
					'50%': { opacity: '1' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				/* Effects */
				'shimmer': {
					'100%': { transform: 'translateX(100%)' }
				},
				'marquee': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-50%)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
				'fade-in': 'fade-in 0.5s ease-out both',
				'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
				'float': 'float 6s ease-in-out infinite',
				'blob': 'blob 18s ease-in-out infinite',
				'spin-slow': 'spin-slow 22s linear infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite',
				'marquee': 'marquee 30s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

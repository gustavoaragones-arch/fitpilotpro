import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			accent: '#CCFF00',
  			'accent-hover': '#B8E600',
  			card: '#2A2A2A',
  			'border-subtle': '#3A3A3A',
  			'text-primary': '#FFFFFF',
  			'text-secondary': '#A0A0A0',
  			success: '#4ADE80',
  			warning: '#FACC15',
  			error: '#EF4444',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

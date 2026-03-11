/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0a0a0b",
                foreground: "#f8f9fa",
                card: {
                    DEFAULT: "#141417",
                    border: "#232328",
                },
                accent: {
                    DEFAULT: "#3b82f6",
                    hover: "#2563eb",
                },
                success: "#10b981",
                warning: "#f59e0b",
                danger: "#ef4444",
                muted: "#71717a",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 0 20px rgba(59, 130, 246, 0.1)',
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}

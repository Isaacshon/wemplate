import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        cobalt: "var(--cobalt)",
        acid: "var(--acid)",
        coral: "var(--coral)",
        muted: "var(--muted)",
        line: "var(--line)",
        background: "var(--paper)",
        foreground: "var(--ink)",
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "8px",
        "2xl": "8px",
      },
      boxShadow: {
        editorial: "0 18px 50px rgba(23, 23, 23, 0.12)",
        press: "0 8px 0 rgba(23, 23, 23, 0.92)",
      },
    },
  },
  plugins: [],
};
export default config;

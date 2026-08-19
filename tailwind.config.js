/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces and ink are driven by CSS custom properties so the
        // whole site flips theme by swapping four values, not by having
        // every component know about light and dark.
        ground: "rgb(var(--ground) / <alpha-value>)",
        raised: "rgb(var(--raised) / <alpha-value>)",
        sunk: "rgb(var(--sunk) / <alpha-value>)",

        // Text hierarchy is one ink at four opacities — the thing that
        // makes this family of sites feel like a system rather than a
        // pile of greys.
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-2": "rgb(var(--ink) / 0.62)",
        "ink-3": "rgb(var(--ink) / 0.34)",
        "ink-4": "rgb(var(--ink) / 0.16)",
        line: "rgb(var(--ink) / 0.14)",
        "line-2": "rgb(var(--ink) / 0.26)",

        // Kairo's own blue, sampled from the product: #3b82f6 is the
        // primary button, #5ea3f0 the logo mark. The site and the
        // software now use the same accent.
        brand: "#3b82f6",
        "brand-lift": "#5ea3f0",
        "brand-deep": "#2f6fd8",

        // Also the product's, for status only.
        money: "#0f9d63",
        alert: "#b9760d",
      },
      fontFamily: {
        sans: ['"Inter Tight"', "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      transitionTimingFunction: {
        // The signature curve: slow to leave, very fast through the
        // middle, long settle.
        "66": "cubic-bezier(.66,0,.01,1)",
        "out-soft": "cubic-bezier(0,0,.2,1)",
      },
      transitionDuration: { "660": "660ms", "1200": "1200ms" },
      maxWidth: { shell: "1560px" },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translateY(110%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        blink: { "0%,55%": { opacity: "1" }, "56%,100%": { opacity: "0.15" } },
      },
      animation: {
        "rise-in": "rise-in 900ms cubic-bezier(.66,0,.01,1) both",
        marquee: "marquee 42s linear infinite",
        blink: "blink 1.6s step-end infinite",
      },
    },
  },
  plugins: [],
};

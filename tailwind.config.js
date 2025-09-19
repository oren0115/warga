/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom Green Palette for RT/RW Fee Management
        "primary-green": "#16A34A", // hijau tosca tua
        "secondary-green": "#22C55E", // hijau cerah
        "accent-blue": "#2563EB", // biru untuk link/CTA
        "warning-yellow": "#F59E0B", // kuning
        "danger-red": "#DC2626", // merah
        "main-background": "#F9FAFB", // abu terang
        "main-dark": "#111827", // abu gelap hampir hitam
      },
      backgroundColor: {
        "main-background": "#F9FAFB",
      },
      textColor: {
        "main-dark": "#111827",
      },
    },
  },
  plugins: [],
};

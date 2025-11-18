// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind가 클래스를 스캔할 모든 파일의 경로
  content: [
  './src/**/*.{html,js,ts,jsx,tsx}',
  './components/**/*.{js,ts}',
  './node_modules/@some-lib/**/*.{js}',
    "./index.html", 
    "./core.js",
    "./Language.js",
  ],
  safelist: [
    // 🚨 여기에 문제가 되는 임의의 값 클래스를 추가합니다.
    // 필요하다면 다른 클래스도 추가할 수 있습니다.
    // 'bg-red-500', 
    'max-h-[60vh]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
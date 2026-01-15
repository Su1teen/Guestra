/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#050A30',
        surface: '#FFFFFF',
        'status-success': '#27AE60',
      },
      fontFamily: {
        sans: ['"SF Pro Display"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'interactive': '12px',
      },
      spacing: {
        // 8pt grid system
        '0': '0px',
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '56px',
        '8': '64px',
        '9': '72px',
        '10': '80px',
        '11': '88px',
        '12': '96px',
        '13': '104px',
        '14': '112px',
        '15': '120px',
        '16': '128px',
        '17': '136px',
        '18': '144px',
        '19': '152px',
        '20': '160px',
      },
      width: {
        'mobile': '390px',
      },
      height: {
        'mobile': '844px',
      },
      aspectRatio: {
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
}

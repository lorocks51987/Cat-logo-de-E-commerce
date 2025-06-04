/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // blue-500
        success: '#10B981',    // green-500
        background: '#FFFFFF', // white
        text: '#1F2937',      // gray-800
        secondary: '#F3F4F6',  // gray-100
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 
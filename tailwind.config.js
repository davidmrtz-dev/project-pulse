/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#0D47A1',
          light: '#42A5F5',
          dark: '#1565C0',
        },
        secondary: {
          DEFAULT: '#42A5F5',
          dark: '#64B5F6',
        },
        success: {
          DEFAULT: '#00C896',
          dark: '#00E5A0',
        },
        warning: {
          DEFAULT: '#FFC107',
          dark: '#FFD54F',
        },
        error: {
          DEFAULT: '#EF5350',
          dark: '#FF6F61',
        },
        // Text colors
        text: {
          primary: '#1E1E1E',
          secondary: '#555555',
          'primary-dark': '#F5F5F5',
          'secondary-dark': '#B0BEC5',
        },
        // Background colors
        bg: {
          base: '#F8F9FA',
          panel: '#FFFFFF',
          'base-dark': '#0A1929',
          'panel-dark': '#132F4C',
        },
        // Border colors
        border: {
          DEFAULT: '#E0E0E0',
          dark: '#1E3A5F',
        },
      },
    },
  },
  plugins: [],
}

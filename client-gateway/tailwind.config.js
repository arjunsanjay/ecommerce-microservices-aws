/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c3d66',
          },
          secondary: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
          },
        },
        fontFamily: {
          sans: ['Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
          heading: ['Inter', 'Segoe UI', 'sans-serif'],
        },
        fontSize: {
          xs: ['12px', { lineHeight: '16px' }],
          sm: ['14px', { lineHeight: '20px' }],
          base: ['16px', { lineHeight: '24px' }],
          lg: ['18px', { lineHeight: '28px' }],
          xl: ['20px', { lineHeight: '28px' }],
          '2xl': ['24px', { lineHeight: '32px' }],
          '3xl': ['30px', { lineHeight: '36px' }],
          '4xl': ['36px', { lineHeight: '40px' }],
        },
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        borderRadius: {
          lg: '12px',
          xl: '16px',
          '2xl': '20px',
        },
        boxShadow: {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
    plugins: [],
  }
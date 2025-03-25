module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF7E5F',
          DEFAULT: '#FF5F40',
          dark: '#E04D31',
        },
        secondary: {
          light: '#FEB692',
          DEFAULT: '#FFA978',
          dark: '#E89869',
        },
        dark: {
          light: '#2D3748',
          DEFAULT: '#1A202C',
          dark: '#171923',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
} 
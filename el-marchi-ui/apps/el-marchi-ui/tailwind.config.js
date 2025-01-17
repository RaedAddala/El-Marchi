const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    fontFamily: {
      sans: ['Inter var', 'ui-sans-serif', 'system-ui', '-apple-system'],
      serif: ['Inter var', 'ui-serif', 'Georgia'],
    },
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],
      'sm': ['0.875rem', { lineHeight: '1.25rem' }],
      'base': ['1rem', { lineHeight: '1.5rem' }],
      'lg': ['1.125rem', { lineHeight: '1.75rem' }],
      'xl': ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
    },
    extend: {
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
      colors: {
        primary: {
          50: '#e6e6ff',
          100: '#c7c7ff',
          200: '#a8a8ff',
          300: '#8989ff',
          400: '#6b6bff',
          500: '#0000ff',
          600: '#0000e6',
          700: '#0000cc',
          800: '#0000b3',
          900: '#000099',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  daisyui: {
    themes: [
      {
        fantasy: {
          ...require('daisyui/src/theming/themes')['fantasy'],
          primary: '#0000ff',
          'primary-content': '#ffffff',
          secondary: '#f6f6f6',
          neutral: '#e8e8e8',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#f3f4f6',
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    logs: false,
    themeRoot: ':root',
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
};

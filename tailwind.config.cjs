/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          600: 'var(--color-primary-600)'
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          600: 'var(--color-secondary-600)'
        },
        foreground: 'var(--color-foreground)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        border: 'var(--color-border)',
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-foreground)'
        },
        popover: 'var(--color-surface)',
        'popover-foreground': 'var(--color-foreground)',
        input: 'var(--color-surface-2)',
        ring: 'var(--color-primary-600)',
        accent: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-foreground)'
        },
        destructive: {
          DEFAULT: 'var(--color-destructive, #ef4444)'
        }
      }
    }
  },
  plugins: []
}

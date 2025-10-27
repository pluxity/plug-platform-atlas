import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('@plug-atlas/ui/tailwind.preset')],
} satisfies Config

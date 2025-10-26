import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-(blue|purple|green|orange|pink|indigo|red|yellow|teal)-(50|100|200|300|400|500|600|700|800)/,
    },
    {
      pattern: /text-(blue|purple|green|orange|pink|indigo|red|yellow|teal)-(50|100|200|300|400|500|600|700|800)/,
    },
    {
      pattern: /border-(blue|purple|green|orange|pink|indigo|red|yellow|teal)-(50|100|200|300|400|500|600|700|800)/,
    },
  ],
}
export default config

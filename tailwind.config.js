/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Blue for CTA buttons
        success: '#10b981', // Green for positive actions
        danger: '#ef4444',  // Red for delete
        neutral: '#6b7280', // Gray for secondary
      },
      fontSize: {
        // Make sure Hindi text is readable
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
      },
      spacing: {
        // Larger touch targets for mobile
        'touch': '48px',
      }
    },
  },
  plugins: [],
}

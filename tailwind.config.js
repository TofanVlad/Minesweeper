/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,,vue}",
  ],
  theme: {
    extend: {
      fontFamily:{
        counter: ['Technology']
      },
      colors:{
        revealed: '#384048',
        bleeq: '#788088',
        body: '#464e56',
        shadow: '#1e262e' 
      }
    },
  },
  plugins: [],
}


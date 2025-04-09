module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        narutoOrange: '#f57c00',
        narutoYellow: '#fbc02d',
        narutoDark: '#212121',
        narutoLight: '#f4e2c3',
      },
      fontFamily: {
        righteous: ['Righteous', 'cursive'], // Fuente estilo Naruto
        sans: ['Arial', 'sans-serif'],
      },
      backgroundImage: {
        'papiro': "nsh-calculator\public\fondo\cream-paper.png", // Ruta relativa al directorio `public`
      },
    },
  },
  plugins: [],
};
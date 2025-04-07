// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'], // Asegúrate de incluir tus archivos
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
          'papiro': "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
        },
      },
    },
    plugins: [],
  };

//   /** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: [
//       "./src/**/*.{js,jsx,ts,tsx}", // Ajusta según tu estructura
//     ],
//     theme: {
//       extend: {},
//     },
//     plugins: [],
//   }
  
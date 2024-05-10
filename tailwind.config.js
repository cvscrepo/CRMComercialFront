/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors:{
        azulOscuro : '#02032',
        azulMar : '#003057',
        azulColvi : '#004A98',
        azulCielo : '#004A98',
        rojo : '#B12028',
        gris : '#B0B0B0',
        grisText: '#777777',
        grisBgClaro: '#f8f8f8e7',
        grisBg: '#E4E3E3',
        inputBg: '#D2D2FF',
        bgGreen: '#08f508',
        bgRed: '#f73e3e'
      }
    },
  },
  plugins: [],
}


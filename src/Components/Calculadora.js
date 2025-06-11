import React, { useState } from 'react';
import CalculadoraDeStats from './CalculadoraDeStats';
import Estadisticas from './Estadisticas';
import GestorDeTecnicas from './GestorDeTecnicas';
import CombateManager from './combate/CombateManager';
import CombateManagerNewDev from './combate/CombateManagerNewDev';
import ArmasNinja from './ArmasNinja';
import CalculadoraDaños from './CalculadoraDaños';
import GestionDeFicha from './GestionDeFicha'; // Nuevo componente



const Calculadora = () => {
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual

  // Función para cambiar de página
  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Contenido de la página */}

        {/* Botones de navegación */}
        <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-6 p-6 bg-papiro bg-cover bg-center bg-blend-multiply bg-narutoLight text-narutoDark max-w-screen-2xl mx-auto">
          <button
            onClick={() => cambiarPagina(1)}
            className={`py-2 px-4 rounded-md ${
              paginaActual === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            Página 1: Stats y Estadísticas
          </button>
          <button
            onClick={() => cambiarPagina(2)}
            className={`py-2 px-4 rounded-md ${
              paginaActual === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            Página 2: Combate Manager
          </button>
        </div>

        {paginaActual === 1 && (
          <>
          <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-6 p-6 bg-papiro bg-cover bg-center bg-blend-multiply bg-narutoLight text-narutoDark max-w-screen-2xl mx-auto">
            <CalculadoraDeStats />
          <div className="flex flex-col w-full lg:w-1/3">
            <Estadisticas />
            <ArmasNinja />
          </div>
          <div className="flex flex-col gap-9 w-full lg:w-1/3">
            <CalculadoraDaños />
            <GestionDeFicha /> {/* Nuevo componente */}
          </div>
          </div>
          <div className="flex flex-col gap-6 p-6 bg-papiro bg-cover bg-center bg-blend-multiply bg-narutoLight text-narutoDark max-w-screen-2xl mx-auto">
            <GestorDeTecnicas />
          </div>
          </>
        )}

        {paginaActual === 2 && (
          <div className="flex flex-col gap-6 p-6 bg-papiro bg-cover bg-center bg-blend-multiply bg-narutoLight text-narutoDark max-w-screen-2xl mx-auto">
            <CombateManager />
            {/* <CombateManagerNewDev /> */}
          </div>
        )}
      </main>

      <footer className="text-center text-sm text-gray-600 font-semibold mt-6">
        Work in progress by{' '}
        <a
          href="https://cabruja.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-narutoOrange hover:underline"
        >
          cabruja.dev
        </a>{' '}
        ®. 2025 ♡
      </footer>
    </div>
  );
};

export default Calculadora;
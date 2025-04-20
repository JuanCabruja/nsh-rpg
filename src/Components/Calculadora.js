import React, { useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';
import CalculadoraDaños from './CalculadoraDaños';
import CalculadoraDeStats from './CalculadoraDeStats';
import Estadisticas from './Estadisticas';
import GestorDeTecnicas from './GestorDeTecnicas';
import ArmasNinja from './ArmasNinja'; // Importar el nuevo componente
import GestionDeFicha from './GestionDeFicha';
import CombateManager from './CombateManager'; // Importar el nuevo componente

const Calculadora = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-6 p-6 bg-papiro bg-cover bg-center bg-blend-multiply bg-narutoLight text-narutoDark  max-w-screen-2xl mx-auto">
          <CalculadoraDeStats />
          <div className="flex flex-col w-full lg:w-1/3">
            <Estadisticas />
            <ArmasNinja />
          </div>
          <div className="flex flex-col gap-9 w-full lg:w-1/3">
            <CalculadoraDaños />
            <GestionDeFicha /> {/* Nuevo componente */}
          </div>
          <div className="flex flex-col gap-9 w-full lg:w-1/3">
            <CombateManager /> {/* Nuevo componente */}
          </div>
        </div>
        <div className="flex flex-col gap-6 p-6 bg-papiro bg-cover bg-center bg-blend-multiply bg-narutoLight text-narutoDark max-w-screen-2xl mx-auto">
          <GestorDeTecnicas />
        </div>
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
      </main>
    </div>
  );
};

export default Calculadora;
import React, { useState, useEffect } from 'react';
import { StatsContext } from '../Context/StatsContext';
import CalculadoraDaños from './CalculadoraDaños';
import CalculadoraDeStats from './CalculadoraDeStats';
import { useContext } from 'react';
import Estadisticas from './Estadisticas';


const Calculadora = () => {
  const {
    rango,
    maxStats,
    stats,
    resultados,
    mensaje,
    invalido,
    habilidad,
    resultadoHabilidad,
    handleMaxStatsChange,
    handleStatChange,
    resetStats,
    calcularHabilidad,
    statsNames,
  } = useContext(StatsContext);

  return (
    
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
    <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-6 p-6 bg-papiro bg-cover bg-center bg-blend-multiply bg-narutoLight text-narutoDark max-w-screen-xl mx-auto">
     <CalculadoraDeStats />
      {/* Columna derecha */}
      <div className="flex flex-col gap-6 w-full lg:w-1/3">
        <Estadisticas />
        <CalculadoraDaños />
      </div>
    </div>

  <footer className="text-center text-sm text-gray-600 font-semibold mt-6">
    Work in progress by <a href="https://cabruja.dev" target="_blank" rel="noopener noreferrer" className="text-narutoOrange hover:underline">cabruja.dev</a> ®. 2025 ♡
  </footer>
  </main>
</div>
  );
};

export default Calculadora;
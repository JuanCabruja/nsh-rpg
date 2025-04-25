import React, { useState, useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';

const CombateManager = () => {
  const { resultados, stats } = useContext(StatsContext);
  const [vit, setVit] = useState(resultados.vit);
  const [chakra, setChakra] = useState(resultados.chakra);
  const [formula, setFormula] = useState('');

  console.log('Valores iniciales:', resultados);
  console.log('Valores actuales:', { vit, chakra });
  console.log('Fórmula:', formula);

  // Función para aplicar la fórmula matemática
  const applyFormula = (target, value) => {
    try {
      const result = eval(`${value} ${formula}`);
      const updatedValue = Math.max(0, result);

      if (target === 'vit') {
        setVit(updatedValue);
      } else {
        setChakra(updatedValue);
      }

      setFormula('');
    } catch (error) {
      console.error('Error al aplicar la fórmula:', error);
      alert('Fórmula inválida. Por favor, revisa la sintaxis.');
    }
  };

  // Función para reiniciar los valores
  const resetValues = () => {
    setVit(resultados.vit);
    setChakra(resultados.chakra);
  };

  // Función para copiar los stats al portapapeles
  const copyStatsToClipboard = () => {
    const statsString = `[ NIN: ${stats.nin}n, TAI: ${stats.tai}, GEN: ${stats.gen}, INT: ${stats.int}, FUE: ${stats.fue}, AGI: ${stats.agi}, EST: ${stats.est}, SM: ${stats.sm} ]`;
    navigator.clipboard.writeText(statsString);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 border-2 border-yellow-600">
      <h2 className="text-narutoOrange font-bold text-lg mb-4 text-center">
        Gestión de Combate
      </h2>

      {/* Display de VIT y Chakra */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Vitalidad (VIT):
          </label>
          <span className="text-green-700 font-bold text-lg">{vit}</span>
          <button
            onClick={() => applyFormula('vit', vit)}
            className="mt-2 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition w-full text-sm"
          >
            Aplicar Fórmula a VIT
          </button>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Chakra:
          </label>
          <span className="text-blue-700 font-bold text-lg">{chakra}</span>
          <button
            onClick={() => applyFormula('chakra', chakra)}
            className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition w-full text-sm"
          >
            Aplicar Fórmula a Chakra
          </button>
        </div>
      </div>

      {/* Campo para la fórmula matemática */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Fórmula Matemática:
        </label>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Ejemplo: -400 * 0.8"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-2">
        <button
          onClick={resetValues}
          className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-gray-700 transition w-full text-sm"
        >
          Reiniciar Valores
        </button>
        <button
          onClick={copyStatsToClipboard}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition w-full text-sm"
        >
          Copiar Stats
        </button>
      </div>
    </div>
  );
};

export default CombateManager;
import React, { useContext, useState } from 'react';
import { StatsContext } from '../Context/StatsContext';

const CalculadoraDeStats = () => {
  const {
    rango,
    maxStats,
    stats,
    mensaje,
    handleMaxStatsChange,
    handleStatChange,
    resetStats,
    permitirExceder,
    handlePermitirExceder
  } = useContext(StatsContext);



  const limitesPorRango = {
    'D': { maxStats: 15, maxStatValue: 4, maxStaminaValue: 3 },
    'C': { maxStats: 19, maxStatValue: 4.5, maxStaminaValue: 3 },
    'B': { maxStats: 25, maxStatValue: 5, maxStaminaValue: 4.5 },
    'A': { maxStats: 29, maxStatValue: 5, maxStaminaValue: 4.5 },
    'S': { maxStats: 35.5, maxStatValue: 5, maxStaminaValue: 5 },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full border-2 border-yellow-600">
      <h1 className="text-narutoOrange font-righteous text-2xl mb-4 text-center">
        Calculadora de STATS
      </h1>

      {/* Información general */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold text-gray-700">
            Rango:
          </label>
          <p className="text-narutoDark font-semibold">{rango}</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700">
            Stats Totales:
          </label>
          <input
            type="number"
            min="15"
            max={permitirExceder ? 100 : 35.5} // Permitir exceder el límite
            step="0.5"
            value={maxStats}
            onChange={handleMaxStatsChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>
      </div>

      {/* Campos de stats */}
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(stats).map((stat) => (
          <div key={stat}>
            <label className="block text-sm font-bold text-gray-700">
              {stat.toUpperCase()}:
            </label>
            <input
              type="number"
              id={stat}
              step="0.5"
              min="0.5"
              max={permitirExceder ? 100 
                                   : stat === 'est' ? limitesPorRango[rango].maxStaminaValue
                                                    : limitesPorRango[rango].maxStatValue
                                  } // Permitir exceder el límite
              value={stats[stat]}
              onChange={handleStatChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
        ))}
      </div>

      {/* Resumen de stats */}
      <div className="mt-4 text-sm text-narutoDark">
        <p>
          <strong>Stats asignados:</strong>{' '}
          {Object.values(stats).reduce((acc, val) => acc + val, 0).toFixed(1)}
        </p>
        <p>
          <strong>Stats disponibles:</strong>{' '}
          {(
            maxStats - Object.values(stats).reduce((acc, val) => acc + val, 0)
          ).toFixed(1)}
        </p>
        {mensaje && <p className="text-red-500 font-bold">{mensaje}</p>}
      </div>

      {/* Botones */}
      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={resetStats}
          className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition w-full"
        >
          Resetear Stats
        </button>
        <button
          onClick={() => handlePermitirExceder()} // Alternar exceder límite
          className={`py-2 px-4 rounded-md transition w-full ${
            permitirExceder
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {permitirExceder ? 'Desactivar Exceder Límite' : 'Permitir Exceder Límite'}
        </button>
      </div>
    </div>
  );
};

export default CalculadoraDeStats;
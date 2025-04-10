import React, { useContext } from 'react';
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
      <div className="space-y-4">
        <label className="block">
          Rango: <strong>{rango}</strong>
        </label>
        <label className="block">
          Stats Totales:
          <input
            type="number"
            min="15"
            max="35.5"
            step="0.5"
            value={maxStats}
            onChange={handleMaxStatsChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </label>
        {Object.keys(stats).map((stat) => (
          <label key={stat} className="block">
            {stat.toUpperCase()}:
            <input
              type="number"
              id={stat}
              step="0.5"
              min="0.5"
              max={
                stat === "est"
                  ? limitesPorRango[rango].maxStaminaValue
                  : limitesPorRango[rango].maxStatValue
              }
              value={stats[stat]}
              onChange={handleStatChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </label>
        ))}
        <div className="text-sm text-narutoDark">
          <strong>Stats asignados:</strong>{" "}
          {Object.values(stats).reduce((acc, val) => acc + val, 0).toFixed(1)}
          <br />
          <strong>Stats disponibles:</strong>{" "}
          {(
            maxStats - Object.values(stats).reduce((acc, val) => acc + val, 0)
          ).toFixed(1)}
          <br />
          {mensaje && <p className="text-red-500 font-bold">{mensaje}</p>}
        </div>
        <button
          onClick={resetStats}
          className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition"
        >
          Resetear Stats
        </button>
      </div>
    </div>
  );
};

export default CalculadoraDeStats;
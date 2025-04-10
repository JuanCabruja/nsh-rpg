import React, { useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';

const Estadisticas = () => {
  const { resultados, statsNames } = useContext(StatsContext);

  const statColors = {
    vitalidad: "stat-vitalidad",
    chakra: "stat-chakra",
    velocidad: "stat-velocidad",
    resistencia: "stat-resistencia",
    reflejos: "stat-reflejos",
    percepcion: "stat-percepcion",
    voluntad: "stat-voluntad",
    consumoChakraReducido: "stat-consumo-chakra",
    objetosExtra: "stat-objetos-extra",
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border-2 border-yellow-600">
      <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
        ESTADÍSTICAS
      </h2>
      <div className="space-y-2">
        {Object.entries(resultados).map(([key, value]) => (
          <div key={key} className={`text-narutoDark ${statColors[key] || ""}`}>
            <strong>{statsNames[key]}:</strong>{" "}
            {key === "consumoChakraReducido" ? `${value}%` : value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Estadisticas;
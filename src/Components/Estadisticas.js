import React, { useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';

const Estadisticas = () => {
  const { resultados, statsNames } = useContext(StatsContext);

  const statColors = {
    vit: "text-green-500", // Verde
    chakra: "text-blue-500", // Azul
    velocidad: "text-yellow-500", // Amarillo
    resistencia: "text-red-500", // Rojo
    reflejos: "text-purple-500", // Morado
    percepcion: "text-teal-500", // Turquesa
    voluntad: "text-orange-500", // Naranja
    consumoChakraReducido: "text-indigo-500", // Índigo
    objetosExtra: "text-gray-500", // Gris
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 border-2 border-yellow-600">
      <h2 className="text-narutoOrange font-righteous text-xl mb-3 text-center">
        ESTADÍSTICAS
      </h2>
      <div className="space-y-2">
        {Object.entries(resultados).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center text-sm"
          >
            <span className="font-bold text-narutoDark">{statsNames[key]}:</span>
            <span className={`${statColors[key] || "text-black"} font-semibold`}>
              {key === "consumoChakraReducido" ? `${value}%` : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Estadisticas;
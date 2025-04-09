import React, { useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';

const Estadisticas = () => {
    const { resultados, statsNames } = useContext(StatsContext);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
                ESTADÍSTICAS
            </h2>
            <div className="space-y-2">
                {Object.entries(resultados).map(([key, value]) => (
                    <div key={key} className="text-narutoDark">
                        <strong>{statsNames[key]}:</strong>{" "}
                        {key === "consumoChakraReducido" ? `${value}%` : value}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Estadisticas;
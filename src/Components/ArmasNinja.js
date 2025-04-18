import React, { useContext, useState } from 'react';
import { StatsContext } from '../Context/StatsContext';

const ArmasNinja = () => {
  const { arma, updateArma } = useContext(StatsContext);
  const [nombre, setNombre] = useState(arma.nombre);
  const [daño, setDaño] = useState(arma.daño);

  const handleGuardar = () => {
    updateArma(nombre, parseFloat(daño) || 0);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full border-2 border-yellow-600 mt-6">
      <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
        Arma Ninja Equipada
      </h2>

      {/* Información del arma actual */}
      <div className="bg-gray-50 border border-gray-300 rounded-md p-4 mb-4">
        <p className="text-sm">
          <strong>Arma actual:</strong> {arma.nombre || 'Ninguna'}
        </p>
        <p className="text-sm">
          <strong>Daño:</strong> {arma.daño || 0}
        </p>
      </div>

      {/* Formulario compacto */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre del arma"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm"
        />
        <input
          type="number"
          placeholder="Daño del arma"
          value={daño}
          onChange={(e) => setDaño(e.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>

      {/* Botón guardar */}
      <button
        onClick={handleGuardar}
        className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition w-full mt-4"
      >
        Guardar Arma
      </button>
    </div>
  );
};

export default ArmasNinja;
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
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del arma"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <input
          type="number"
          placeholder="Daño del arma"
          value={daño}
          onChange={(e) => setDaño(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <button
          onClick={handleGuardar}
          className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition w-full"
        >
          Guardar Arma
        </button>
      </div>
      <div className="mt-4">
        <strong>Arma actual:</strong> {arma.nombre || 'Ninguna'} <br />
        <strong>Daño:</strong> {arma.daño || 0}
      </div>
    </div>
  );
};

export default ArmasNinja;
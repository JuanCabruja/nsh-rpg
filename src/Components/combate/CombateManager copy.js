import React, { useState, useContext } from 'react';
import { StatsContext } from '../../Context/StatsContext';
import CombateCard from './CombateCard';

const CombateManager = () => {
  const { resultados } = useContext(StatsContext);
  const [combatientes, setCombatientes] = useState([
    { id: 1, nombre: 'Usuario', vit: resultados.vit, chakra: resultados.chakra },
  ]);
  const [acciones, setAcciones] = useState([]);
  const [habilidad, setHabilidad] = useState('');
  const [daño, setDaño] = useState('');
  const [costeChakra, setCosteChakra] = useState('');
  const [ejecutor, setEjecutor] = useState('');
  const [receptor, setReceptor] = useState('');
  const [ronda, setRonda] = useState('');

  const agregarCombatiente = (nombre, vit, chakra) => {
    setCombatientes((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        nombre,
        vit: parseInt(vit, 10),
        chakra: parseInt(chakra, 10),
      },
    ]);
  };

  const manejarAccion = () => {
    if (!habilidad || !daño || !costeChakra || !ejecutor || !receptor || !ronda) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const ejecutorObj = combatientes.find((c) => c.nombre === ejecutor);
    const receptorObj = combatientes.find((c) => c.nombre === receptor);

    if (!ejecutorObj || !receptorObj) {
      alert('El ejecutor o receptor no existe.');
      return;
    }

    // Aplicar daño y coste de chakra
    ejecutorObj.chakra = Math.max(0, ejecutorObj.chakra - parseInt(costeChakra, 10));
    receptorObj.vit = Math.max(0, receptorObj.vit + parseInt(daño, 10));

    setCombatientes((prev) =>
      prev.map((c) => {
        if (c.nombre === ejecutor) return { ...c, chakra: ejecutorObj.chakra };
        if (c.nombre === receptor) return { ...c, vit: receptorObj.vit };
        console.log(c.nombre, c.vit, c.chakra);
        return c;
      })
    );

    // Registrar la acción
    setAcciones((prev) => [
      ...prev,
      {
        habilidad,
        daño,
        costeChakra,
        ejecutor,
        receptor,
        ronda,
      },
    ]);

    // Limpiar el formulario
    setHabilidad('');
    setDaño('');
    setCosteChakra('');
    setEjecutor('');
    setReceptor('');
    setRonda('');
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full border border-gray-300">
      <h2 className="text-red-600 font-bold text-lg mb-4 text-center">Gestión de Combate</h2>



      {/* Lista de combatientes */}
      <div className="flex flex-row flex-wrap gap-4 mt-4">
        <h3 className="text-gray-800 font-bold text-md mb-2 w-full">Combatientes Actuales</h3>
        {combatientes.map((combatiente) => (
          <div key={combatiente.id} className="flex-1 min-w-[22%]">
            <CombateCard
              nombreInicial={combatiente.nombre}
              vitInicial={combatiente.vit}
              chakraInicial={combatiente.chakra}
              onAction={() => {}}
            />
          </div>
        ))}
      </div>

            {/* Formulario para registrar acciones */}
      <div className="mb-4">
        <h3 className="text-gray-800 font-bold text-md mb-2">Registrar Acción</h3>
        <input
          type="text"
          value={habilidad}
          onChange={(e) => setHabilidad(e.target.value)}
          placeholder="Nombre de la habilidad"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        <input
          type="number"
          value={daño}
          onChange={(e) => setDaño(e.target.value)}
          placeholder="Daño (ejemplo: -200)"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        <input
          type="number"
          value={costeChakra}
          onChange={(e) => setCosteChakra(e.target.value)}
          placeholder="Coste de Chakra"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        <select
          value={ejecutor}
          onChange={(e) => setEjecutor(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        >
          <option value="">Seleccionar ejecutor</option>
          {combatientes.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          value={receptor}
          onChange={(e) => setReceptor(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        >
          <option value="">Seleccionar receptor</option>
          {combatientes.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={ronda}
          onChange={(e) => setRonda(e.target.value)}
          placeholder="Ronda"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        <button
          onClick={manejarAccion}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition w-full text-sm"
        >
          Registrar Acción
        </button>
      </div>

      {/* Lista de acciones */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-gray-800 font-bold text-md mb-2">Historial de Acciones</h3>
        {acciones.length > 0 ? (
          <ul className="space-y-2">
            {acciones.map((accion, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm border border-gray-300"
              >
                <div>
                  <span className="font-bold text-gray-700">{accion.habilidad}</span> -{' '}
                  <span className="text-sm text-gray-500">Ronda {accion.ronda}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {accion.ejecutor} → {accion.receptor}
                </div>
                <div className="text-sm text-gray-500">
                  Daño: {accion.daño}, Chakra: -{accion.costeChakra}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No hay acciones registradas.</p>
        )}
      </div>
    </div>
  );
};

export default CombateManager;
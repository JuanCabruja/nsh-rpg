import React, { useState, useContext, useEffect } from 'react';
import { StatsContext } from '../../Context/StatsContext';

const CombateManagerNewDev = () => {
  const { resultados } = useContext(StatsContext);

  const tiposDeAcciones = ['Anticipación', 'Ofensiva', 'Defensiva', 'Evasión', 'Anulación', 'Suplementaria', 'Contraataque', 'Otro'];

  // Estados
  const [combatientes, setCombatientes] = useState(() => {
    const savedCombatientes = JSON.parse(localStorage.getItem('combatientes')) || [];
    return savedCombatientes;
  });

  const [acciones, setAcciones] = useState(() => {
    const savedAcciones = JSON.parse(localStorage.getItem('acciones')) || [];
    return savedAcciones;
  });

  const [tecnicas, setTecnicas] = useState(() => {
    const savedTecnicas = JSON.parse(localStorage.getItem('tecnicas')) || [];
    return savedTecnicas;
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'tecnicas') {
        const savedTecnicas = JSON.parse(localStorage.getItem('tecnicas')) || [];
        setTecnicas(savedTecnicas);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('combatientes', JSON.stringify(combatientes));
    localStorage.setItem('acciones', JSON.stringify(acciones));
  }, [combatientes, acciones]);

  const agregarFila = () => {
    const nuevaAccion = {
      habilidad: '',
      daño: '',
      costeChakra: '',
      tipo: '',
      ejecutor: '',
      receptor: '',
      ronda: '',
    };
    setAcciones((prev) => [...prev, nuevaAccion]);
  };

  const actualizarAccion = (index, campo, valor) => {
    const nuevasAcciones = [...acciones];
    nuevasAcciones[index][campo] = valor;
    setAcciones(nuevasAcciones);
  };

  const eliminarAccion = (index) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta acción?');
    if (!confirmacion) return;

    const nuevasAcciones = acciones.filter((_, i) => i !== index);
    setAcciones(nuevasAcciones);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full border border-yellow-600">
      <h2 className="text-red-600 font-bold text-lg mb-4 text-center">Gestión de Combate</h2>

      {/* Tabla editable */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Habilidad</th>
              <th className="border border-gray-300 px-4 py-2">Daño</th>
              <th className="border border-gray-300 px-4 py-2">Coste Chakra</th>
              <th className="border border-gray-300 px-4 py-2">Tipo</th>
              <th className="border border-gray-300 px-4 py-2">Ejecutor</th>
              <th className="border border-gray-300 px-4 py-2">Receptor</th>
              <th className="border border-gray-300 px-4 py-2">Ronda</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {acciones.map((accion, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={accion.habilidad}
                    onChange={(e) => actualizarAccion(index, 'habilidad', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={accion.daño}
                    onChange={(e) => actualizarAccion(index, 'daño', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={accion.costeChakra}
                    onChange={(e) => actualizarAccion(index, 'costeChakra', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={accion.tipo}
                    onChange={(e) => actualizarAccion(index, 'tipo', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposDeAcciones.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={accion.ejecutor}
                    onChange={(e) => actualizarAccion(index, 'ejecutor', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  >
                    <option value="">Seleccionar ejecutor</option>
                    {combatientes.map((c) => (
                      <option key={c.id} value={c.nombre}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={accion.receptor}
                    onChange={(e) => actualizarAccion(index, 'receptor', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  >
                    <option value="">Seleccionar receptor</option>
                    {combatientes.map((c) => (
                      <option key={c.id} value={c.nombre}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={accion.ronda}
                    onChange={(e) => actualizarAccion(index, 'ronda', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => eliminarAccion(index)}
                    className="bg-red-500 text-xs text-white px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para agregar nueva fila */}
      <button
        onClick={agregarFila}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition w-full text-sm mt-4"
      >
        Agregar Nueva Acción
      </button>
    </div>
  );
};

export default CombateManagerNewDev;
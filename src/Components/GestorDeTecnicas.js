import React, { useState, useEffect, useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';

const GestorDeTecnicas = () => {
  const { stats, arma, tecnicas, setTecnicas, calcularDaño} = useContext(StatsContext);

  const [nuevaTecnica, setNuevaTecnica] = useState({
    nombre: '',
    rango: '',
    tipo: '',
    categoria: '',
    costoChakra: '',
    calculo: '',
    anotaciones: '',
  });

  const [filtros, setFiltros] = useState({
    nombre: '',
    rango: '',
    tipo: '',
    categoria: '',
    costoChakra: '',
  });

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    // Recalcular los daños automáticamente cuando cambien los stats o el valor de ARMA
    useEffect(() => {
      if (Array.isArray(tecnicas)) {
        const tecnicasActualizadas = tecnicas.map((tecnica) => ({
          ...tecnica,
          resultado: calcularDaño(tecnica.calculo), // Recalcular el daño/defensa
        }));
        setTecnicas(tecnicasActualizadas);
      }
    }, [stats, arma]); // Ejecutar cuando los stats o ARMA cambien
  
  

  const tecnicasFiltradas = tecnicas.filter((tecnica) => {
    return (
      tecnica.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
      tecnica.rango.toLowerCase().includes(filtros.rango.toLowerCase()) &&
      tecnica.tipo.toLowerCase().includes(filtros.tipo.toLowerCase()) &&
      tecnica.categoria.toLowerCase().includes(filtros.categoria.toLowerCase()) &&
      (filtros.costoChakra === '' || tecnica.costoChakra.toString().includes(filtros.costoChakra))
    );
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full border-2 border-yellow-600 mt-2">
      <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
        Gestor de Técnicas
      </h2>

      {/* Formulario compacto para agregar técnicas */}
      <div className="bg-gray-50 border border-gray-300 rounded-md p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre (obligatorio)"
            value={nuevaTecnica.nombre}
            onChange={(e) => setNuevaTecnica({ ...nuevaTecnica, nombre: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          <input
            type="text"
            name="rango"
            placeholder="Rango (obligatorio)"
            value={nuevaTecnica.rango}
            onChange={(e) => setNuevaTecnica({ ...nuevaTecnica, rango: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          <input
            type="text"
            name="tipo"
            placeholder="Tipo (obligatorio)"
            value={nuevaTecnica.tipo}
            onChange={(e) => setNuevaTecnica({ ...nuevaTecnica, tipo: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={nuevaTecnica.categoria}
            onChange={(e) => setNuevaTecnica({ ...nuevaTecnica, categoria: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          <input
            type="number"
            name="costoChakra"
            placeholder="Costo de Chakra"
            value={nuevaTecnica.costoChakra}
            onChange={(e) => setNuevaTecnica({ ...nuevaTecnica, costoChakra: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          <input
            type="text"
            name="calculo"
            placeholder="Cálculo (Ej: NIN * 1.5)"
            value={nuevaTecnica.calculo}
            onChange={(e) => setNuevaTecnica({ ...nuevaTecnica, calculo: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>
        <textarea
          name="anotaciones"
          placeholder="Anotaciones"
          value={nuevaTecnica.anotaciones}
          onChange={(e) => setNuevaTecnica({ ...nuevaTecnica, anotaciones: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2 text-sm mt-4"
        />
        <button
          onClick={() => {
            if (!nuevaTecnica.nombre || !nuevaTecnica.rango || !nuevaTecnica.tipo) {
              alert('Por favor, completa los campos obligatorios (Nombre, Rango, Tipo).');
              return;
            }
            setTecnicas((prev) => [...prev, nuevaTecnica]);
            setNuevaTecnica({
              nombre: '',
              rango: '',
              tipo: '',
              categoria: '',
              costoChakra: '',
              calculo: '',
              anotaciones: '',
            });
          }}
          className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition w-full mt-4"
        >
          Agregar Técnica
        </button>
      </div>

      {/* Lista de técnicas guardadas con filtrado */}
      <div className="mt-6">
        {tecnicas.length > 0 ? (
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Filtrar por Nombre"
                    value={filtros.nombre}
                    onChange={handleFiltroChange}
                    className="w-full border border-gray-300 rounded-md p-1 text-xs"
                  />
                </th>
                <th className="border border-gray-300 p-2">
                  <input
                    type="text"
                    name="rango"
                    placeholder="Filtrar por Rango"
                    value={filtros.rango}
                    onChange={handleFiltroChange}
                    className="w-full border border-gray-300 rounded-md p-1 text-xs"
                  />
                </th>
                <th className="border border-gray-300 p-2">
                  <input
                    type="text"
                    name="tipo"
                    placeholder="Filtrar por Tipo"
                    value={filtros.tipo}
                    onChange={handleFiltroChange}
                    className="w-full border border-gray-300 rounded-md p-1 text-xs"
                  />
                </th>
                <th className="border border-gray-300 p-2">
                  <input
                    type="text"
                    name="categoria"
                    placeholder="Filtrar por Categoría"
                    value={filtros.categoria}
                    onChange={handleFiltroChange}
                    className="w-full border border-gray-300 rounded-md p-1 text-xs"
                  />
                </th>
                <th className="border border-gray-300 p-2">
                  <input
                    type="text"
                    name="costoChakra"
                    placeholder="Filtrar por Chakra"
                    value={filtros.costoChakra}
                    onChange={handleFiltroChange}
                    className="w-full border border-gray-300 rounded-md p-1 text-xs"
                  />
                </th>
                <th className="border border-gray-300 p-2">Resultado</th>
                <th className="border border-gray-300 p-2">Anotaciones</th>
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tecnicasFiltradas.map((tecnica, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{tecnica.nombre}</td>
                  <td className="border border-gray-300 p-2">{tecnica.rango}</td>
                  <td className="border border-gray-300 p-2">{tecnica.tipo}</td>
                  <td className="border border-gray-300 p-2">{tecnica.categoria || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{tecnica.costoChakra || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{tecnica.resultado || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{tecnica.anotaciones}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => setTecnicas((prev) => prev.filter((_, i) => i !== index))}
                      className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition text-xs"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No tienes técnicas guardadas.</p>
        )}
      </div>
    </div>
  );
};

export default GestorDeTecnicas;
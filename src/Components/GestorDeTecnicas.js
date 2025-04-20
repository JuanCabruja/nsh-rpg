import React, { useState, useEffect, useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';
const GestorDeTecnicas = () => {
  const { stats, arma, tecnicas, setTecnicas, calcularDaño } = useContext(StatsContext);

  const [nuevaTecnica, setNuevaTecnica] = useState({
    nombre: '',
    rango: '',
    tipo: '',
    categoria: '',
    costoChakra: '',
    alcance: '',
    calculo: '',
    anotaciones: '',
  });

  const [filtros, setFiltros] = useState({
    nombre: '',
    rango: '',
    tipo: '',
    categoria: '',
    alcance: '',
    costoChakra: '',
    resultado: '',
    anotaciones: '',
  });

  const [tecnicaEnEdicion, setTecnicaEnEdicion] = useState(null); // Nueva técnica en edición

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarTecnica = () => {
    if (!nuevaTecnica.nombre || !nuevaTecnica.rango || !nuevaTecnica.tipo) {
      alert('Por favor, completa los campos obligatorios (Nombre, Rango, Tipo).');
      return;
    }

    if (tecnicaEnEdicion !== null) {
      // Actualizar técnica existente
      const tecnicasActualizadas = tecnicas.map((tecnica, index) =>
        index === tecnicaEnEdicion ? { ...nuevaTecnica, resultado: calcularDaño(nuevaTecnica.calculo) } : tecnica
      );
      setTecnicas(tecnicasActualizadas);
      localStorage.setItem('tecnicas', JSON.stringify(tecnicasActualizadas));
      setTecnicaEnEdicion(null); // Salir del modo edición
    } else {
      // Agregar nueva técnica
      const resultado = calcularDaño(nuevaTecnica.calculo);
      const tecnicaConResultado = { ...nuevaTecnica, resultado };
      const tecnicasActualizadas = [...tecnicas, tecnicaConResultado];
      setTecnicas(tecnicasActualizadas);
      localStorage.setItem('tecnicas', JSON.stringify(tecnicasActualizadas));
    }

    // Resetear el formulario
    setNuevaTecnica({
      nombre: '',
      rango: '',
      tipo: '',
      categoria: '',
      costoChakra: '',
      alcance: '',
      resultado: '',
      anotaciones: '',
    });
  };

  const handleEditarTecnica = (index) => {
    setNuevaTecnica(tecnicas[index]); // Cargar la técnica seleccionada en el formulario
    setTecnicaEnEdicion(index); // Establecer el índice de la técnica en edición
  };

  const handleEliminarTecnica = (index) => {
    const tecnicasActualizadas = tecnicas.filter((_, i) => i !== index);
    setTecnicas(tecnicasActualizadas);
    localStorage.setItem('tecnicas', JSON.stringify(tecnicasActualizadas));
  };

  const tecnicasFiltradas = tecnicas.filter((tecnica) => {
    return (
      (filtros.nombre === '' || tecnica.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
      (filtros.rango === '' || tecnica.rango.toLowerCase().includes(filtros.rango.toLowerCase())) &&
      (filtros.tipo === '' || tecnica.tipo.toLowerCase().includes(filtros.tipo.toLowerCase())) &&
      (filtros.categoria === '' || tecnica.categoria.toLowerCase().includes(filtros.categoria.toLowerCase())) &&
      (filtros.alcance === '' || (tecnica.alcance && parseFloat(tecnica.alcance) >= parseFloat(filtros.alcance))) &&
      (filtros.costoChakra === '' || (tecnica.costoChakra && parseFloat(tecnica.costoChakra) >= parseFloat(filtros.costoChakra))) &&
      (filtros.resultado === '' || (tecnica.resultado && parseFloat(tecnica.resultado) >= parseFloat(filtros.resultado))) &&
      (filtros.anotaciones === '' || tecnica.anotaciones.toLowerCase().includes(filtros.anotaciones.toLowerCase()))
    );
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full border-2 border-yellow-600 mt-2">
      <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
        Gestor de Técnicas
      </h2>

      {/* Formulario compacto para agregar/editar técnicas */}
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
            type="text"
            name="alcance"
            placeholder="Alcance"
            value={nuevaTecnica.alcance}
            onChange={(e) => setNuevaTecnica({ ...nuevaTecnica, alcance: e.target.value })}
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
            name="resultado"
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
          onClick={agregarTecnica}
          className={`${
            tecnicaEnEdicion !== null ? 'bg-blue-500' : 'bg-narutoOrange'
          } text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition w-full mt-4`}
        >
          {tecnicaEnEdicion !== null ? 'Guardar Cambios' : 'Agregar Técnica'}
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
        placeholder="Nombre"
        value={filtros.nombre}
        onChange={handleFiltroChange}
        className="w-full border border-gray-300 rounded-md p-1 text-xs"
      />
    </th>
    <th className="border border-gray-300 p-2">
      <input
        type="text"
        name="rango"
        placeholder="Rango"
        value={filtros.rango}
        onChange={handleFiltroChange}
        className="w-full border border-gray-300 rounded-md p-1 text-xs"
      />
    </th>
    <th className="border border-gray-300 p-2">
      <input
        type="text"
        name="tipo"
        placeholder="Tipo"
        value={filtros.tipo}
        onChange={handleFiltroChange}
        className="w-full border border-gray-300 rounded-md p-1 text-xs"
      />
    </th>
    <th className="border border-gray-300 p-2">
      <input
        type="text"
        name="categoria"
        placeholder="Categoría"
        value={filtros.categoria}
        onChange={handleFiltroChange}
        className="w-full border border-gray-300 rounded-md p-1 text-xs"
      />
    </th>
        <th className="border border-gray-300 p-2">
      <input
        type="text"
        name="alcance"
        placeholder="Alcance"
        value={filtros.alcance}
        onChange={handleFiltroChange}
        className="w-full border border-gray-300 rounded-md p-1 text-xs"
      />
    </th>
    <th className="border border-gray-300 p-2">
      <input
        type="text"
        name="costoChakra"
        placeholder="Chakra"
        value={filtros.costoChakra}
        onChange={handleFiltroChange}
        className="w-full border border-gray-300 rounded-md p-1 text-xs"
      />
    </th>

        <th className="border border-gray-300 p-2">
      <input
        type="text"
        name="resultado"
        placeholder="Resultado"
        value={filtros.resultado}
        onChange={handleFiltroChange}
        className="w-full border border-gray-300 rounded-md p-1 text-xs"
      />
    </th>
        <th className="border border-gray-300 p-2">
      <input
        type="text"
        name="anotaciones"
        placeholder="Anotaciones"
        value={filtros.anotaciones}
        onChange={handleFiltroChange}
        className="w-full border border-gray-300 rounded-md p-1 text-xs"
      />
    </th>
    <th className="border border-gray-300 p-2">Acciones</th>
  </tr>
  <tr>

  </tr>
</thead>
            <tbody>
              {tecnicasFiltradas.map((tecnica, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{tecnica.nombre}</td>
                  <td className="border border-gray-300 p-2">{tecnica.rango}</td>
                  <td className="border border-gray-300 p-2">{tecnica.tipo}</td>
                  <td className="border border-gray-300 p-2">{tecnica.categoria || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{tecnica.alcance || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{tecnica.costoChakra || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{tecnica.resultado || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{tecnica.anotaciones}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEditarTecnica(index)}
                      className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 transition text-xs mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarTecnica(index)}
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
import React, { useState, useEffect, useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';

const BuscadorDeTecnicas = () => {
  const { stats } = useContext(StatsContext); // Obtener las estadísticas del contexto
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: '',
    rango: '',
    tipo: '',
    elemento: '',
  });
  const [tecnicasFiltradas, setTecnicasFiltradas] = useState([]);

  // Cargar las técnicas desde el archivo JSON público
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/tecnicas/tecnicas_completas.json`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategorias(data.categorias); // Guardar las categorías del JSON
      })
      .catch((error) => console.error('Error al cargar las técnicas:', error));
  }, []);

  // Filtrar las técnicas según los filtros seleccionados
  useEffect(() => {
    const tecnicas = categorias.flatMap((categoria) =>
      (categoria.tecnicas || categoria.jutsus || []).map((tecnica) => ({
        ...tecnica,
        categoria: categoria.disciplina || categoria.elemento || 'General',
      }))
    );

    setTecnicasFiltradas(
      tecnicas.filter((tecnica) => {
        return (
          (!filtros.nombre || tecnica.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
          (!filtros.rango || tecnica.rango === filtros.rango) &&
          (!filtros.tipo || tecnica.tipo.includes(filtros.tipo)) &&
          (!filtros.elemento || tecnica.elemento === filtros.elemento)
        );
      })
    );
  }, [filtros, categorias]);

  // Manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      [name]: value,
    }));
  };

  // Calcular el daño basado en la fórmula de "efectos"
  const calcularDaño = (formula) => {
    const parsedFormula = formula.replace(/ARMA|AGI|TAI|INT|FUE|EST|SM|NIN/gi, (match) => {
      return stats[match.toLowerCase()] || 0; // Sustituir por el valor de la estadística
    });
    try {
      return eval(parsedFormula).toFixed(2); // Evaluar la fórmula y redondear a 2 decimales
    } catch (error) {
      console.error('Error al calcular el daño:', error);
      return 'Error';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full border-2 border-yellow-600 mt-6">
      <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
        Buscador de Técnicas
      </h2>
      <div className="space-y-4">
        {/* Filtros */}
        <input
          type="text"
          name="nombre"
          placeholder="Buscar por nombre..."
          value={filtros.nombre}
          onChange={handleFiltroChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <select
          name="rango"
          value={filtros.rango}
          onChange={handleFiltroChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Filtrar por rango</option>
          {['E', 'D', 'C', 'B', 'A', 'S'].map((rango, index) => (
            <option key={index} value={rango}>
              {rango}
            </option>
          ))}
        </select>
        <select
          name="tipo"
          value={filtros.tipo}
          onChange={handleFiltroChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Filtrar por tipo</option>
          {['Ofensivo', 'Defensivo', 'Combo', 'Anticipación'].map((tipo, index) => (
            <option key={index} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <select
          name="elemento"
          value={filtros.elemento}
          onChange={handleFiltroChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Filtrar por elemento</option>
          {['No-Elemental', 'Raiton', 'Katon', 'Suiton', 'Doton', 'Fuuton'].map((elemento, index) => (
            <option key={index} value={elemento}>
              {elemento}
            </option>
          ))}
        </select>
      </div>

      {/* Resultados */}
      <div className="mt-6 space-y-6">
        {categorias.map((categoria, index) => (
          <div key={index} className="border-b border-gray-300 pb-4">
            <h3 className="text-lg font-bold text-narutoDark mb-2">{categoria.disciplina || categoria.elemento}</h3>
            <p className="text-sm text-gray-600 mb-4">{categoria.descripcion}</p>
            {(categoria.tecnicas || categoria.jutsus || []).map((tecnica, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 py-2"
              >
                <span className="font-bold text-narutoDark">{tecnica.nombre}</span>
                <span className="text-sm text-gray-600">Costo CH: {tecnica.costoChakra}</span>
                <span className="text-sm text-gray-600">Daño: {calcularDaño(tecnica.formula)}</span>
                <span className="text-sm text-gray-600">Efectos: {tecnica.efectos.join(', ')}</span>
              </div>
            ))}
          </div>
        ))}
        {tecnicasFiltradas.length === 0 && (
          <p className="text-center text-gray-500">No se encontraron técnicas que coincidan con los filtros.</p>
        )}
      </div>
    </div>
  );
};

export default BuscadorDeTecnicas;
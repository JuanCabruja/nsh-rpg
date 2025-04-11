import React, { useState, useEffect, useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';

const GestorDeTecnicas = () => {
  const { stats, arma } = useContext(StatsContext); // Obtener las estadísticas y el valor de ARMA desde el contexto

  // Inicializar técnicas desde localStorage o como un array vacío
  const [tecnicas, setTecnicas] = useState(() => {
    const savedTecnicas = localStorage.getItem('tecnicas');
    try {
      return savedTecnicas ? JSON.parse(savedTecnicas) : [];
    } catch (error) {
      console.error('Error al cargar técnicas desde localStorage:', error);
      return [];
    }
  });

  const [nuevaTecnica, setNuevaTecnica] = useState({
    nombre: '',
    rango: '',
    tipo: '',
    categoria: '',
    costoChakra: '',
    calculo: '', // Fórmula de cálculo
    anotaciones: '',
  });

  // Guardar técnicas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('tecnicas', JSON.stringify(tecnicas));
  }, [tecnicas]);

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

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaTecnica((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Agregar una nueva técnica
  const agregarTecnica = () => {
    if (!nuevaTecnica.nombre || !nuevaTecnica.rango || !nuevaTecnica.tipo) {
      alert('Por favor, completa los campos obligatorios (Nombre, Rango, Tipo).');
      return;
    }
    setTecnicas((prev) => [
      ...prev,
      { ...nuevaTecnica, resultado: calcularDaño(nuevaTecnica.calculo) }, // Calcular el daño inicial
    ]);
    setNuevaTecnica({
      nombre: '',
      rango: '',
      tipo: '',
      categoria: '',
      costoChakra: '',
      calculo: '',
      anotaciones: '',
    });
  };

  // Eliminar una técnica
  const eliminarTecnica = (index) => {
    setTecnicas((prev) => prev.filter((_, i) => i !== index));
  };

  // Calcular el daño/defensa basado en la fórmula
  const calcularDaño = (formula) => {
    if (!formula) return 'N/A';
    try {
      const formulaLowerCase = formula.toLowerCase().replace(/,/g, '.'); // Aseguramos que las variables sean minúsculas
      const variables = {
        ...Object.fromEntries(
          Object.entries(stats).map(([key, value]) => [key, value * 100])
        ),
        arma: arma.daño || 0, // Usar el daño del arma desde el contexto global
      };
      const resultado = new Function(
        ...Object.keys(variables),
        `return ${formulaLowerCase};`
      )(...Object.values(variables));
      return resultado.toFixed(2); // Redondear a 2 decimales
    } catch (error) {
      console.error('Error al calcular el daño/defensa:', error);
      return 'Error';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full border-2 border-yellow-600 mt-6">
      <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
        Gestor de Técnicas
      </h2>

      {/* Formulario para agregar técnicas */}
      <div className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la técnica (obligatorio)"
          value={nuevaTecnica.nombre}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          name="rango"
          placeholder="Rango (obligatorio)"
          value={nuevaTecnica.rango}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          name="tipo"
          placeholder="Tipo (obligatorio)"
          value={nuevaTecnica.tipo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          value={nuevaTecnica.categoria}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <input
          type="number"
          name="costoChakra"
          placeholder="Costo de Chakra"
          value={nuevaTecnica.costoChakra}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <textarea
          name="calculo"
          placeholder="Cálculo Daño/Defensa (Ejemplo: NIN * 1.5 + AGI * 0.5)"
          value={nuevaTecnica.calculo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <textarea
          name="anotaciones"
          placeholder="Anotaciones"
          value={nuevaTecnica.anotaciones}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <button
          onClick={agregarTecnica}
          className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition w-full"
        >
          Agregar Técnica
        </button>
      </div>

      {/* Lista de técnicas guardadas */}
      <div className="mt-6 space-y-6">
        {Array.isArray(tecnicas) && tecnicas.length > 0 ? (
          tecnicas.map((tecnica, index) => (
            <div
              key={index}
              className="border-b border-gray-300 pb-4"
            >
              <h3 className="text-lg font-bold text-narutoDark">{tecnica.nombre}</h3>
              <p><strong>Rango:</strong> {tecnica.rango}</p>
              <p><strong>Tipo:</strong> {tecnica.tipo}</p>
              <p><strong>Categoría:</strong> {tecnica.categoria || 'N/A'}</p>
              <p><strong>Costo de Chakra:</strong> {tecnica.costoChakra || 'N/A'}</p>
              <p><strong>Cálculo Daño/Defensa:</strong> {tecnica.calculo || 'N/A'}</p>
              <p><strong>Resultado:</strong> {tecnica.resultado || calcularDaño(tecnica.calculo)}</p>
              <textarea
                value={tecnica.anotaciones}
                onChange={(e) => {
                  const nuevaAnotacion = e.target.value;
                  const tecnicasActualizadas = [...tecnicas];
                  tecnicasActualizadas[index].anotaciones = nuevaAnotacion;
                  setTecnicas(tecnicasActualizadas);
                }}
                placeholder="Anotaciones"
                className="w-full border border-gray-300 rounded-md p-2 mt-2"
              />
              <button
                onClick={() => eliminarTecnica(index)}
                className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 transition mt-2"
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tienes técnicas guardadas.</p>
        )}
      </div>
    </div>
  );
};

export default GestorDeTecnicas;
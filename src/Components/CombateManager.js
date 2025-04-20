import React, { useState, useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';


const CombateManager = () => {

  const { resultados } = useContext(StatsContext); // Obtener valores iniciales de VIT y Chakra del contexto
  const [vit, setVit] = useState(resultados.vit); // Estado local para VIT
  const [chakra, setChakra] = useState(resultados.chakra); // Estado local para Chakra
  const [formula, setFormula] = useState(''); // Fórmula matemática
  const [target, setTarget] = useState('vit'); // Objetivo (VIT o Chakra)

  console.log('Valores iniciales:', resultados); // Verificar los valores iniciales
  console.log('Valores actuales:', { vit, chakra }); // Verificar los valores actuales
  console.log('Fórmula:', formula); // Verificar la fórmula ingresada

  // Función para aplicar la fórmula matemática
  const applyFormula = () => {
    try {
      const currentValue = target === 'vit' ? vit : chakra;
      const result = eval(`${currentValue} ${formula}`); // Evaluar la fórmula
      const updatedValue = Math.max(0, result); // Asegurar que no sea negativo

      if (target === 'vit') {
        setVit(updatedValue);
      } else {
        setChakra(updatedValue);
      }

      setFormula(''); // Limpiar la fórmula
    } catch (error) {
      console.error('Error al aplicar la fórmula:', error);
      alert('Fórmula inválida. Por favor, revisa la sintaxis.');
    }
  };

  // Función para reiniciar los valores
  const resetValues = () => {
    setVit(resultados.vit);
    setChakra(resultados.chakra);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full border-2 border-red-600">
      <h2 className="text-red-600 font-bold text-xl mb-4 text-center">
        Gestión de Combate
      </h2>

      {/* Mostrar valores actuales */}
      <div className="mb-4">
        <p className="text-green-500 font-bold text-lg">
          Vitalidad (VIT): {vit}
        </p>
        <p className="text-blue-500 font-bold text-lg">
          Chakra: {chakra}
        </p>
      </div>

      {/* Selección del objetivo */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Selecciona el objetivo:
        </label>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        >
          <option value="vit">Vitalidad (VIT)</option>
          <option value="chakra">Chakra</option>
        </select>
      </div>

      {/* Campo para la fórmula matemática */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Fórmula Matemática:
        </label>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Ejemplo: -400 * 0.8"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4">
        <button
          onClick={applyFormula}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition w-full"
        >
          Aplicar Fórmula
        </button>
        <button
          onClick={resetValues}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition w-full"
        >
          Reiniciar Valores
        </button>
      </div>
    </div>
  );
};

export default CombateManager;
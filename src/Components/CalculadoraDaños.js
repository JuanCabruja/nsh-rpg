import React, { useState, useContext } from 'react';
import { StatsContext } from '../Context/StatsContext';

const CalculadoraDaños = () => {
  const { stats } = useContext(StatsContext); // Obtenemos los stats del contexto
  const [formula, setFormula] = useState("NIN * 1.5"); // Fórmula personalizada
  const [arma, setArma] = useState(0); // Daño del arma (si aplica)
  const [resultado, setResultado] = useState(0); // Resultado del cálculo

  // Función para calcular el daño basado en la fórmula
  const calcularDaño = () => {
    try {
      const formulaLowerCase = formula.toLowerCase().replace(/,/g, "."); // Aseguramos que las variables sean minúsculas
      const variables = {
        ...Object.fromEntries(
          Object.entries(stats).map(([key, value]) => [key, value * 100])
        ),
        arma: arma || 0,
      };

      const resultado = new Function(
        ...Object.keys(variables),
        `return ${formulaLowerCase};`
      )(...Object.values(variables));
      setResultado(resultado.toFixed(2)); // Guardamos el resultado con 2 decimales
    } catch (error) {
      console.error("Error al calcular la habilidad:", error);
      setResultado("Error en la fórmula");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full border-2 border-yellow-600">
      <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
        Calculadora Rápida
      </h2>

      {/* Contenedor compacto */}
      <div className="space-y-4">
        {/* Campo para la fórmula */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Fórmula de la habilidad:
          </label>
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="Ejemplo: NIN * 1.5 + AGI * 0.5"
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>

        {/* Campo para el daño del arma (si aplica) */}
        {formula.toUpperCase().includes("ARMA") && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Daño del arma:
            </label>
            <input
              type="number"
              value={arma}
              onChange={(e) => setArma(parseFloat(e.target.value) || 0)}
              placeholder="Ejemplo: 100"
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
        )}

        {/* Botón para calcular */}
        <button
          onClick={calcularDaño}
          className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition w-full"
        >
          Calcular Daño
        </button>

        {/* Resultado */}
        <div className="bg-gray-50 border border-gray-300 rounded-md p-4 text-center">
          <strong className="text-narutoDark">Resultado:</strong>{" "}
          <span className="text-lg font-semibold text-green-500">
            {resultado}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraDaños;
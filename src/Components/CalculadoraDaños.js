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
            const formulaLowerCaser = formula.toLocaleLowerCase().replace(/,/g, "."); // Aseguramos que las variables sean minusculas
            // Multiplicamos los stats por 100 y añadimos ARMA como variable
            const variables = { ...Object.fromEntries(
                Object.entries(stats).map(([key, value]) => [key, value * 100])
            ), arma: arma || 0 };
            
            const resultado = new Function(
                ...Object.keys(variables),
                `return ${formulaLowerCaser};`
            )(...Object.values(variables));
            setResultado(resultado.toFixed(2)); // Guardamos el resultado con 2 decimales
        } catch (error) {
            console.error("Error al calcular la habilidad:", error);
            setResultado("Error en la fórmula");
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
                Calculadora de Daños
            </h2>
            <label className="block">
                Fórmula de la habilidad:
                <input
                    type="text"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    placeholder="Ejemplo: NIN * 1.5 + AGI * 0.5"
                    className="w-full border border-gray-300 rounded-md p-2"
                />
            </label>
            {formula.toUpperCase().includes("ARMA") && (
                <label className="block">
                    Daño del arma:
                    <input
                        type="number"
                        value={arma}
                        onChange={(e) => setArma(parseFloat(e.target.value) || 0)}
                        placeholder="Ejemplo: 100"
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </label>
            )}
            <button
                onClick={calcularDaño}
                className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition"
            >
                Calcular Daño
            </button>
            <div className="mt-4">
                <strong>Resultado:</strong> {resultado}
            </div>
        </div>
    );
};

export default CalculadoraDaños;
import React, { useState, useEffect } from 'react';
import './Calculadora.css';

const limitesPorRango = {
    'D': { maxStats: 15, maxStatValue: 4, maxStaminaValue: 3 },
    'C': { maxStats: 15, maxStatValue: 4.5, maxStaminaValue: 3 },
    'B': { maxStats: 15, maxStatValue: 5, maxStaminaValue: 4.5 },
    'A': { maxStats: 15, maxStatValue: 5, maxStaminaValue: 4.5 },
    'S': { maxStats: 15, maxStatValue: 5, maxStaminaValue: 5 }
};

const Calculadora = () => {
    const [rango, setRango] = useState('D');
    const [maxStats, setMaxStats] = useState(15); // Default base value
    const [stats, setStats] = useState({
        nin: 0.5, tai: 0.5, gen: 0.5, int: 0.5, fue: 0.5, agi: 0.5, est: 0.5, sm: 0.5
    });
    const [resultados, setResultados] = useState({});
    const [mensaje, setMensaje] = useState('');
    const [invalido, setInvalido] = useState(false);

    const handleMaxStatsChange = (e) => {
        const value = Math.min(35.5, Math.max(15, parseFloat(e.target.value) || 15)); // Ensure minimum is 15 and maximum is 35.5
        setMaxStats(value);
    };

    const handleStatChange = (e) => {
        const { id, value } = e.target;
        console.log(stats)
        setStats(prevStats => ({ ...prevStats, [id]: parseFloat(value) || 0 }));
        console.log(stats)
       
    };

    useEffect(() => {
        calcularAtributos();
      }, [stats]);

    const resetStats = () => {
        setStats({
            nin: 0.5, tai: 0.5, gen: 0.5, int: 0.5, fue: 0.5, agi: 0.5, est: 0.5, sm: 0.5
        });
        setMensaje('');
        setInvalido(false);
        setResultados({});
    };

    const calcularAtributos = () => {
        const valores = Object.values(stats);
        const total = valores.reduce((acc, val) => acc + val, 0);
        const disponibles = maxStats - total;

        let mensaje = '';
        let invalido = false;

        if (valores.some(v => v < 0.5)) {
            mensaje += `⚠️ Cada stat debe tener al menos 0.5 puntos.\n`;
            invalido = true;
        }

        if (total > maxStats) {
            mensaje += `⚠️ Has excedido el total de stats disponibles (${maxStats}).\n`;
            invalido = true;
        }

        setMensaje(mensaje);
        setInvalido(invalido);

        if (!invalido) {
            const { est, agi, int, fue, sm } = stats;
            const vit = est * 500;
            const chakra = est * 100;
            const velocidad = agi * 2.5;
            const voluntad = int * 5;

            let resistencia = 0;
            if (fue >= 5) resistencia = 25;
            else if (fue >= 4.5) resistencia = 20;
            else if (fue >= 4) resistencia = 10;

            let reflejos = 1;
            if (agi >= 5) reflejos = 3;
            else if (agi >= 4) reflejos = 2;

            let percepcion = 1;
            if (int >= 5) percepcion = 3;
            else if (int >= 4) percepcion = 2;
            
            const consumoChakraReducido = parseFloat(sm) * 10;
            const objetosExtra = Math.floor(int);

            setResultados({
                vit, chakra, velocidad, resistencia, reflejos, percepcion, voluntad, consumoChakraReducido, objetosExtra
            });
        }
    };

    return (
        <div className="calculadora-container">
            <h1>Calculadora de STATS - Naruto RPG</h1>
            <label>
                Rango:
                <select value={rango} onChange={(e) => setRango(e.target.value)}>
                    {Object.keys(limitesPorRango).map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </label>
            <label>
                Stats disponibles:
                <input
                    type="number"
                    min="15"
                    max="35.5"
                    step="0.5"
                    value={maxStats}
                    onChange={handleMaxStatsChange}
                />
            </label>
            {Object.keys(stats).map(stat => (
                <label key={stat}>
                    {stat.toUpperCase()}:
                    <input
                        type="number"
                        id={stat}
                        step="0.5"
                        min="0.5"
                        max={stat === 'est' ? limitesPorRango[rango].maxStaminaValue : limitesPorRango[rango].maxStatValue}
                        value={stats[stat]}
                        onChange={handleStatChange}
                    />
                </label>
            ))}
            <div className="contador-stats">
                <strong>Stats asignados:</strong> {Object.values(stats).reduce((acc, val) => acc + val, 0).toFixed(1)}<br />
                <strong>Stats disponibles:</strong> {(maxStats - Object.values(stats).reduce((acc, val) => acc + val, 0)).toFixed(1)}<br />
                {mensaje && <p className="mensaje-error">{mensaje}</p>}
            </div>
            {/* <button onClick={calcularAtributos} disabled={invalido}>Calcular Atributos</button> */}
            <button onClick={resetStats}>Resetear Stats</button>
            {Object.keys(resultados).length > 0 && (
                <div className="resultados">
                    <strong>Resultados:</strong>
                    <ul>
                        {Object.entries(resultados).map(([key, value]) => (
                            <li key={key}>{key}: {value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Calculadora;
import React, { useState, useEffect } from 'react';

const limitesPorRango = {
  'D': { maxStats: 15, maxStatValue: 4, maxStaminaValue: 3 },
  'C': { maxStats: 19, maxStatValue: 4.5, maxStaminaValue: 3 },
  'B': { maxStats: 25, maxStatValue: 5, maxStaminaValue: 4.5 },
  'A': { maxStats: 29, maxStatValue: 5, maxStaminaValue: 4.5 },
  'S': { maxStats: 35.5, maxStatValue: 5, maxStaminaValue: 5 },
};

const Calculadora = () => {
  const [rango, setRango] = useState('D');
  const [maxStats, setMaxStats] = useState(15);
  const [stats, setStats] = useState({
    nin: 0.5, tai: 0.5, gen: 0.5, int: 0.5, fue: 0.5, agi: 0.5, est: 0.5, sm: 0.5,
  });
  const [resultados, setResultados] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [invalido, setInvalido] = useState(false);
  const [habilidad, setHabilidad] = useState({ stat: 'nin', multiplicador: 1.1 });
  const [resultadoHabilidad, setResultadoHabilidad] = useState(0);

  const handleMaxStatsChange = (e) => {
    const value = Math.max(15, parseFloat(e.target.value) || 15);
    setMaxStats(value);
  };

  const handleStatChange = (e) => {
    const { id, value } = e.target;
    setStats(prevStats => ({ ...prevStats, [id]: parseFloat(value) || 0 }));
  };

  const resetStats = () => {
    setStats({
      nin: 0.5, tai: 0.5, gen: 0.5, int: 0.5, fue: 0.5, agi: 0.5, est: 0.5, sm: 0.5,
    });
    setMensaje('');
    setInvalido(false);
    setResultados({});
  };

  const calcularRango = (total) => {
    if (total <= 15) return 'D';
    if (total <= 19) return 'C';
    if (total <= 25) return 'B';
    if (total <= 29) return 'A';
    return 'S';
  };

  useEffect(() => {
    const valores = Object.values(stats);
    const total = valores.reduce((acc, val) => acc + val, 0);
    setRango(calcularRango(maxStats));
    calcularAtributos(total);
  }, [maxStats]);

  const calcularAtributos = (total) => {
    const disponibles = maxStats - total;

    let mensaje = '';
    let invalido = false;

    if (Object.values(stats).some(v => v < 0.5)) {
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

      const consumoChakraReducido = sm * 10;
      const objetosExtra = Math.floor(int);

      setResultados({
        vit, chakra, velocidad, resistencia, reflejos, percepcion, voluntad, consumoChakraReducido, objetosExtra,
      });
    }
  };

  const calcularHabilidad = () => {
    const statValue = stats[habilidad.stat] || 0;
    const resultado = statValue * 100 * habilidad.multiplicador;
    setResultadoHabilidad(resultado.toFixed(2));
  };

  return (
    <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-6 p-6 bg-papiro max-w-screen-xl mx-auto">
      {/* Calculadora de STATS */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-2/3">
        <h1 className="text-narutoOrange font-righteous text-2xl mb-4 text-center">
          Calculadora de STATS - Naruto RPG
        </h1>
        <div className="space-y-4">
          <label className="block">
            Rango: <strong>{rango}</strong>
          </label>
          <label className="block">
            Stats Totales:
            <input
              type="number"
              min="15"
              max="35.5"
              step="0.5"
              value={maxStats}
              onChange={handleMaxStatsChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          {Object.keys(stats).map((stat) => (
            <label key={stat} className="block">
              {stat.toUpperCase()}:
              <input
                type="number"
                id={stat}
                step="0.5"
                min="0.5"
                max={
                  stat === "est"
                    ? limitesPorRango[rango].maxStaminaValue
                    : limitesPorRango[rango].maxStatValue
                }
                value={stats[stat]}
                onChange={handleStatChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          ))}
          <div className="text-sm text-narutoDark">
            <strong>Stats asignados:</strong>{" "}
            {Object.values(stats).reduce((acc, val) => acc + val, 0).toFixed(1)}
            <br />
            <strong>Stats disponibles:</strong>{" "}
            {(
              maxStats - Object.values(stats).reduce((acc, val) => acc + val, 0)
            ).toFixed(1)}
            <br />
            {mensaje && <p className="text-red-500 font-bold">{mensaje}</p>}
          </div>
          <button
            onClick={resetStats}
            className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition"
          >
            Resetear Stats
          </button>
        </div>
      </div>
  
      {/* Columna derecha */}
      <div className="flex flex-col gap-6 w-full lg:w-1/3">
        {/* Estadísticas */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
            ESTADÍSTICAS
          </h2>
          <div className="space-y-2">
            {Object.entries(resultados).map(([key, value]) => (
              <div key={key} className="text-narutoDark">
                <strong>{key.toUpperCase()}:</strong>{" "}
                {key === "consumoChakraReducido" ? `${value}%` : value}
              </div>
            ))}
          </div>
        </div>
  
        {/* Calculadora de Daños */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
            Calculadora de Daños
          </h2>
          <label className="block">
            Stat:
            <select
              value={habilidad.stat}
              onChange={(e) =>
                setHabilidad({ ...habilidad, stat: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {Object.keys(stats).map((stat) => (
                <option key={stat} value={stat}>
                  {stat.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            Multiplicador:
            <input
              type="number"
              step="0.1"
              value={habilidad.multiplicador}
              onChange={(e) =>
                setHabilidad({
                  ...habilidad,
                  multiplicador: parseFloat(e.target.value) || 1,
                })
              }
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <button
            onClick={calcularHabilidad}
            className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition"
          >
            Calcular Daño
          </button>
          <div className="mt-4">
            <strong>Resultado:</strong> {resultadoHabilidad}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculadora;
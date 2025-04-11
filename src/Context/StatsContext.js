import React, { createContext, useState, useEffect } from 'react';

export const StatsContext = createContext();

const limitesPorRango = {
  'D': { maxStats: 15, maxStatValue: 4, maxStaminaValue: 3 },
  'C': { maxStats: 19, maxStatValue: 4.5, maxStaminaValue: 3 },
  'B': { maxStats: 25, maxStatValue: 5, maxStaminaValue: 4.5 },
  'A': { maxStats: 29, maxStatValue: 5, maxStaminaValue: 4.5 },
  'S': { maxStats: 35.5, maxStatValue: 5, maxStaminaValue: 5 },
};

const statsNames = {
  'vit': 'Vitalidad',
  'chakra': 'Chakra',
  'velocidad': 'Velocidad',
  'resistencia': 'Resistencia',
  'reflejos': 'Reflejos',
  'percepcion': 'Percepción',
  'voluntad': 'Voluntad',
  'consumoChakraReducido': 'Reducción de consumo de Chakra',
  'objetosExtra': 'Armas Suplementarias extra',
};

export const StatsProvider = ({ children }) => {
  const [rango, setRango] = useState(() => {
    const savedRango = localStorage.getItem('rango');
    return savedRango ? savedRango : 'D';
  });

  const [maxStats, setMaxStats] = useState(() => {
    const savedMaxStats = localStorage.getItem('maxStats');
    return savedMaxStats ? parseFloat(savedMaxStats) : 15;
  });

  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('stats');
    return savedStats ? JSON.parse(savedStats) : { nin: 0.5, tai: 0.5, gen: 0.5, int: 0.5, fue: 0.5, agi: 0.5, est: 0.5, sm: 0.5 };
  });

  const [arma, setArma] = useState(() => {
    const savedArma = localStorage.getItem('arma');
    console.log('Cargando arma desde localStorage:', savedArma);
    // Handle if its NaN or undefined
    if (savedArma === 'NaN' || savedArma === undefined) {
      return { nombre: '', daño: 0 };
    }
    // Parse the savedArma string to an object
    return savedArma ? JSON.parse(savedArma) : { nombre: '', daño: 0 };
  });

  const [resultados, setResultados] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [invalido, setInvalido] = useState(false);
  const [habilidad, setHabilidad] = useState({ stat: 'nin', multiplicador: 1.1 });
  const [resultadoHabilidad, setResultadoHabilidad] = useState(0);

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const savedStats = localStorage.getItem('stats');
    const savedMaxStats = localStorage.getItem('maxStats');
    const savedRango = localStorage.getItem('rango');
    const savedArma = localStorage.getItem('arma');

    if (savedStats) {
      console.log('Cargando stats desde localStorage:', savedStats);
      setStats(JSON.parse(savedStats));
    }
    if (savedMaxStats) {
      console.log('Cargando maxStats desde localStorage:', savedMaxStats);
      setMaxStats(parseFloat(savedMaxStats));
    }
    if (savedRango) {
      console.log('Cargando rango desde localStorage:', savedRango);
      setRango(savedRango);
    }
    if (savedArma) {
      console.log('Cargando arma desde localStorage:', savedArma);
      // Handle if its NaN or undefined
      if (savedArma === 'NaN' || savedArma === undefined) {
        setArma({ nombre: '', daño: 0 });
      } else {
        setArma(JSON.parse(savedArma));
      }
    }
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
    localStorage.setItem('maxStats', maxStats);
    localStorage.setItem('rango', rango);
    localStorage.setItem('arma', JSON.stringify(arma));
  }, [stats, maxStats, rango, arma]);

  const handleMaxStatsChange = (e) => {
    const value = Math.max(15, parseFloat(e.target.value) || 15);
    setMaxStats(value);
  };

  const handleStatChange = (e) => {
    const { id, value } = e.target;
    setStats((prevStats) => ({ ...prevStats, [id]: parseFloat(value) || 0 }));
  };

  const updateArma = (nombre, daño) => {
    setArma({ nombre, daño: parseFloat(daño) || 0 });
  };

  const resetStats = () => {
    const defaultStats = {
      nin: 0.5, tai: 0.5, gen: 0.5, int: 0.5, fue: 0.5, agi: 0.5, est: 0.5, sm: 0.5,
    };
    setStats(defaultStats);
    setMensaje('');
    setInvalido(false);
    setResultados({});
    setArma({ nombre: '', daño: 0 });
    localStorage.removeItem('stats');
    localStorage.removeItem('maxStats');
    localStorage.removeItem('rango');
    localStorage.removeItem('arma');
  };

  const calcularRango = (total) => {
    if (total <= 15) return 'D';
    if (total <= 19) return 'C';
    if (total <= 25) return 'B';
    if (total <= 29) return 'A';
    return 'S';
  };

  const calcularAtributos = (total) => {
    const disponibles = maxStats - total;

    let mensaje = '';
    let invalido = false;

    if (Object.values(stats).some((v) => v < 0.5)) {
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

  useEffect(() => {
    const valores = Object.values(stats);
    const total = valores.reduce((acc, val) => acc + val, 0);
    setRango(calcularRango(maxStats));
    calcularAtributos(total);
  }, [maxStats, stats]);

  return (
    <StatsContext.Provider
      value={{
        rango,
        maxStats,
        stats,
        arma,
        resultados,
        mensaje,
        invalido,
        habilidad,
        resultadoHabilidad,
        handleMaxStatsChange,
        handleStatChange,
        updateArma,
        resetStats,
        calcularHabilidad,
        statsNames,
        limitesPorRango,
        setHabilidad,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
import React, { createContext, useState, useEffect } from 'react';

export const StatsContext = createContext();

const limitesPorRango = {
  'D': { maxStats: 15, maxStatValue: 4, maxStaminaValue: 5 },
  'C': { maxStats: 19, maxStatValue: 4.5, maxStaminaValue: 5 },
  'B': { maxStats: 25, maxStatValue: 5, maxStaminaValue: 5 },
  'A': { maxStats: 29, maxStatValue: 5, maxStaminaValue: 5 },
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
    if (savedArma === 'NaN' || savedArma === undefined) {
      return { nombre: '', daño: 0 };
    }
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
        return 'N/A'; // Retornar 'N/A' en caso de error
      }
    };

  const [permitirExceder, setPermitirExceder] = useState(false); // Nuevo estado

  const handlePermitirExceder = () => {
    if (permitirExceder) {
      if (maxStats > 35.5) {
        setMaxStats(35.5); // Cambiar el valor máximo a 15 si no se permite exceder
      }
      // if stats are over 5 set them to 5
      const newStats = { ...stats };
      Object.keys(newStats).forEach((key) => {
        if (newStats[key] > 5) {
          newStats[key] = 5;
        }
      });
      setStats(newStats); // Actualizar los stats si se excede el límite
      localStorage.setItem('stats', JSON.stringify(newStats)); // Guardar los stats en localStorage
    } 
    setPermitirExceder(!permitirExceder); // Alternar el estado
    localStorage.setItem('permitirExceder', permitirExceder); // Guardar el estado en localStorage
  };

  const handleMaxStatsChange = (e) => {
    const { value } = e.target;
    permitirExceder ? setMaxStats(value) : setMaxStats(Math.max(15, parseFloat(e.target.value) || 15));
    localStorage.setItem('maxStats', value);
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

    if (total > maxStats && !permitirExceder) {
      mensaje += `⚠️ Has excedido el total de stats disponibles (${maxStats}).\n`;
      invalido = true;
    } else if (permitirExceder && total > maxStats) {
      mensaje += `Total de stats por encima de tus stats disponibles ${total - maxStats}.\n`;
    }


    setMensaje(mensaje);
    setInvalido(invalido);

    if (!invalido) {
      const { est, agi, int, fue, sm } = stats;
      const vit = 1250 + ( Math.floor(fue) * 250 );

      // Math floor

      const chakra = est * 100 + sm * 50;
      const velocidad = agi + 5;
      const voluntad = int * 5;

      let resistencia = 0;
      if (fue >= 5) resistencia = 20;
      else if (fue >= 4.5) resistencia = 15;
      else if (fue >= 4) resistencia = 10;

      let reflejos = 1;
      if (agi >= 5) reflejos = 3;
      else if (agi >= 3) reflejos = 2;

      let percepcion = 1;
      if (int >= 5) percepcion = 3;
      else if (int >= 3) percepcion = 2;


      const objetosExtra = Math.floor(int);

      setResultados({
        vit, chakra, velocidad, resistencia, reflejos, percepcion, objetosExtra,
      });
    }
  };

  const calcularHabilidad = () => {
    const statValue = stats[habilidad.stat] || 0;
    const resultado = statValue * 100 * habilidad.multiplicador;
    setResultadoHabilidad(resultado.toFixed(2));
  };

  const descargarFicha = () => {
    const data = {
      stats,
      arma,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ficha_personaje.json';
    a.click();
    URL.revokeObjectURL(url);
  };

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
    


  const cargarFicha = (data) => {
    try {
      if (data.stats) setStats(data.stats);
      if (data.arma) updateArma(data.arma.nombre, data.arma.daño);
      if (data.tecnicas) {
        setTecnicas(data.tecnicas);
        localStorage.setItem('tecnicas', JSON.stringify(data.tecnicas)); // Guardar técnicas en localStorage
      }
      alert('Ficha cargada correctamente.');
    } catch (error) {
      console.error('Error al cargar la ficha:', error);
      alert('El archivo no es válido.');
    }
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
        setStats,
        setMaxStats,
        calcularHabilidad,
        descargarFicha,
        cargarFicha,
        statsNames,
        limitesPorRango,
        setHabilidad,
        setTecnicas,
        tecnicas,
        calcularDaño,
        permitirExceder,
        setPermitirExceder,
        handlePermitirExceder
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
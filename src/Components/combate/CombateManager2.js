import React, { useState, useEffect, useContext } from 'react';
import { StatsContext } from '../../Context/StatsContext';
import Estadisticas from '../Estadisticas';
import ArmasNinja from '../ArmasNinja';

const CombateManager2 = () => {
  const { stats } = useContext(StatsContext); // Estadísticas de los jugadores
  const [participantes, setParticipantes] = useState([]); // Lista de participantes (máximo 4)
  const [turnoActual, setTurnoActual] = useState(0); // Índice del turno actual
  const [ronda, setRonda] = useState(1); // Número de ronda actual
  const [accionesPorBando, setAccionesPorBando] = useState({ atacante: 3, defensor: 3 }); // Acciones disponibles por bando
  const [logCombate, setLogCombate] = useState([]); // Registro de eventos del combate

  // Inicializar el combate con el usuario como participante
  useEffect(() => {
    const usuario = {
      nombre: "Usuario",
      stats: stats,
      bando: "atacante",
      vitalidad: stats.vit,
      chakra: stats.chakra,
      velocidad: stats.velocidad,
    };
    setParticipantes([usuario]);
  }, [stats]);

  // Agregar un participante al combate
  const agregarParticipante = (nombre, bando, stats) => {
    if (participantes.length >= 4) {
      console.error("El combate no puede tener más de 4 participantes.");
      return;
    }
    const nuevoParticipante = {
      nombre,
      bando,
      stats,
      vitalidad: stats.vit,
      chakra: stats.chakra,
      velocidad: stats.velocidad,
    };
    setParticipantes([...participantes, nuevoParticipante]);
  };

  // Avanzar al siguiente turno
  const avanzarTurno = () => {
    const siguienteTurno = (turnoActual + 1) % participantes.length;
    if (siguienteTurno === 0) {
      // Si volvemos al primer jugador, iniciamos una nueva ronda
      setRonda(ronda + 1);
      recuperarAcciones();
    }
    setTurnoActual(siguienteTurno);
  };

  // Recuperar acciones al inicio de cada ronda
  const recuperarAcciones = () => {
    const accionesIniciales = participantes.length > 2 ? 5 : 3;
    setAccionesPorBando({ atacante: accionesIniciales, defensor: accionesIniciales });
  };

  // Registrar un evento en el log del combate
  const registrarEvento = (evento) => {
    setLogCombate([...logCombate, evento]);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full border-2 border-yellow-600">
      <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
        Gestor de Combate
      </h2>

      {/* Información del combate */}
      <div className="mb-4">
        <p><strong>Ronda:</strong> {ronda}</p>
        <p><strong>Turno de:</strong> {participantes[turnoActual]?.nombre || "N/A"}</p>
        <p><strong>Acciones Atacante:</strong> {accionesPorBando.atacante}</p>
        <p><strong>Acciones Defensor:</strong> {accionesPorBando.defensor}</p>
      </div>

      {/* Participantes */}
      <div className="mb-4">
        <h3 className="text-lg font-bold">Participantes</h3>
        {participantes.map((p, index) => (
          <div key={index} className="border-b py-2">
            <p><strong>Nombre:</strong> {p.nombre}</p>
            <p><strong>Bando:</strong> {p.bando}</p>
            <p><strong>Vitalidad:</strong> {p.vitalidad}</p>
            <p><strong>Chakra:</strong> {p.chakra}</p>
            <p><strong>Velocidad:</strong> {p.velocidad}</p>
          </div>
        ))}
      </div>

      {/* Log de combate */}
      <div className="mb-4">
        <h3 className="text-lg font-bold">Registro del Combate</h3>
        <ul>
          {logCombate.map((evento, index) => (
            <li key={index}>{evento}</li>
          ))}
        </ul>
      </div>

      {/* Controles */}
      <div className="flex space-x-4">
        <button
          onClick={avanzarTurno}
          className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition"
        >
          Avanzar Turno
        </button>
      </div>
    </div>
  );
};

export default CombateManager2;
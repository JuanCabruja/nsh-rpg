import React, { useState, useContext, useEffect } from 'react';
import { StatsContext } from '../../Context/StatsContext';
import CombateCard from './CombateCard';
import { create, all } from 'mathjs';

// Player class to encapsulate player properties and methods
class Player {
  constructor(id, name, vit, chakra, vel) {
    this.id = id;
    this.name = name;
    this.vit = vit;
    this.chakra = chakra;
    this.vel = vel;
  }

  applyDamage(damage) {
    this.vit = Math.max(0, this.vit - damage);
  }

  applyChakraCost(cost) {
    this.chakra = Math.max(0, this.chakra - cost);
  }

  restoreStats(baseVit, baseChakra) {
    this.vit = Math.min(this.vit, baseVit);
    this.chakra = Math.min(this.chakra, baseChakra);
  }
}

// CombatManager class to handle combat logic
class CombatManager {
  constructor(players = [], actions = []) {
    this.players = players;
    this.actions = actions;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  findPlayerByName(name) {
    return this.players.find((player) => player.name === name);
  }

  registerAction(action) {
    this.actions.push(action);
  }

  removeAction(index) {
    this.actions.splice(index, 1);
  }

  applyAction(action) {
    const { ejecutor, receptor, daño, costeChakra } = action;
    const ejecutorPlayer = this.findPlayerByName(ejecutor);
    const receptorPlayer = this.findPlayerByName(receptor);

    if (ejecutorPlayer && receptorPlayer) {
      ejecutorPlayer.applyChakraCost(costeChakra);
      receptorPlayer.applyDamage(daño);
    }
  }
}

const CombateManagerComponent = () => {
  const math = create(all);
  const { resultados } = useContext(StatsContext);

  const [combatManager, setCombatManager] = useState(new CombatManager());
  const [nombreEnemigo, setNombreEnemigo] = useState('');
  const [vitEnemigo, setVitEnemigo] = useState('');
  const [chakraEnemigo, setChakraEnemigo] = useState('');
  const [velEnemigo, setVelEnemigo] = useState('');
  const [habilidad, setHabilidad] = useState('');
  const [daño, setDaño] = useState('');
  const [costeChakra, setCosteChakra] = useState('');
  const [ejecutor, setEjecutor] = useState('');
  const [receptor, setReceptor] = useState('');
  const [ronda, setRonda] = useState('');
  const [tipo, setTipo] = useState('');
  const [accionEditando, setAccionEditando] = useState(null);

  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem('combatientes')) || [];
    const savedActions = JSON.parse(localStorage.getItem('acciones')) || [];
    const players = savedPlayers.map(
      (p) => new Player(p.id, p.nombre, p.vit, p.chakra, p.vel)
    );
    setCombatManager(new CombatManager(players, savedActions));
  }, []);

  useEffect(() => {
    localStorage.setItem('combatientes', JSON.stringify(combatManager.players));
    localStorage.setItem('acciones', JSON.stringify(combatManager.actions));
  }, [combatManager]);

  const agregarCombatiente = () => {
    if (!nombreEnemigo || isNaN(vitEnemigo) || isNaN(chakraEnemigo) || isNaN(velEnemigo)) {
      alert('Por favor, completa todos los campos con valores válidos.');
      return;
    }

    const nuevoCombatiente = new Player(
      combatManager.players.length + 1,
      nombreEnemigo,
      Math.max(0, parseInt(vitEnemigo, 10) || 0),
      Math.max(0, parseInt(chakraEnemigo, 10) || 0),
      Math.max(0, parseInt(velEnemigo, 10) || 0)
    );

    setCombatManager((prev) => {
      const updatedManager = new CombatManager([...prev.players, nuevoCombatiente], prev.actions);
      return updatedManager;
    });

    setNombreEnemigo('');
    setVitEnemigo('');
    setChakraEnemigo('');
    setVelEnemigo('');
  };

  const manejarAccion = () => {
    let dañoEvaluado;
    try {
      dañoEvaluado = math.evaluate(daño.toString());
    } catch (error) {
      alert('La expresión matemática en el campo de daño no es válida.');
      return;
    }

    if (!habilidad || isNaN(dañoEvaluado) || isNaN(costeChakra) || !tipo || !ejecutor || !receptor || !ronda) {
      alert('Por favor, completa todos los campos con valores válidos.');
      return;
    }

    const nuevaAccion = {
      habilidad,
      daño: dañoEvaluado,
      costeChakra: parseInt(costeChakra, 10),
      tipo,
      ejecutor,
      receptor,
      ronda,
    };

    setCombatManager((prev) => {
      const updatedManager = new CombatManager(prev.players, [...prev.actions, nuevaAccion]);
      updatedManager.applyAction(nuevaAccion);
      return updatedManager;
    });

    setHabilidad('');
    setDaño('');
    setCosteChakra('');
    setEjecutor('');
    setReceptor('');
    setRonda('');
    setTipo('');
  };

  return (
    <div>
      {/* UI components for managing combat */}
      {/* Similar to the original UI */}
    </div>
  );
};

export default CombateManagerComponent;
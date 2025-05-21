import React, { useState, useContext, useEffect } from 'react';
import { StatsContext } from '../../Context/StatsContext';
import CombateCard from './CombateCard';

const CombateManager = () => {
  const { resultados } = useContext(StatsContext);

  const tiposDeAcciones =  ['Anticipación',  'Ofensiva',   'Defensiva', 'Suplementaria', 'Otro']

  // Estados
  const [combatientes, setCombatientes] = useState(() => {
    // Cargar
    // datos iniciales desde localStorage o establecer valores iniciales
    const savedCombatientes = JSON.parse(localStorage.getItem('combatientes')) || [];
    return savedCombatientes;
  });

  const [acciones, setAcciones] = useState(() => {
    // Cargar datos iniciales desde localStorage o establecer valores iniciales
    const savedAcciones = JSON.parse(localStorage.getItem('acciones')) || [];
    return savedAcciones;
  });

  const [nombreEnemigo, setNombreEnemigo] = useState('');
  const [vitEnemigo, setVitEnemigo] = useState('');
  const [chakraEnemigo, setChakraEnemigo] = useState('');
  const [habilidad, setHabilidad] = useState('');
  const [daño, setDaño] = useState('');
  const [costeChakra, setCosteChakra] = useState('');
  const [ejecutor, setEjecutor] = useState('');
  const [receptor, setReceptor] = useState('');
  const [ronda, setRonda] = useState('');
  const [tipo, setTipo] = useState('')
  const nombreDeUsuario = localStorage.getItem('nombreDeUsuario') || 'Yo';
  const [mostrarCamposAdicionales, setMostrarCamposAdicionales] = useState(false);

  // Cargar datos iniciales desde localStorage o establecer valores iniciales
useEffect(() => {
  const cargarDatos = () => {
    // Verificar si hay datos guardados en localStorage
    const savedCombatientes = JSON.parse(localStorage.getItem('combatientes')) || [];
    const savedAcciones = JSON.parse(localStorage.getItem('acciones')) || [];

    let combatientesIniciales = [...savedCombatientes]; // Usar una variable local para evitar problemas de asincronía
    setCombatientes(combatientesIniciales);
    setAcciones(savedAcciones);
  

  };

  cargarDatos();
}, [resultados, nombreDeUsuario]);

useEffect(() => {
  // Si resultados cambia y no hay combatientes, agregar al usuario
  if (resultados?.vit && resultados?.chakra && combatientes.length === 0) {
    console.log("entré en la que está rompiedo")
    setCombatientes([
      { id: 1, nombre: nombreDeUsuario, vit: resultados.vit, chakra: resultados.chakra },
    ]);
  }
}, [resultados, combatientes]);

  // Guardar combatientes y acciones en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('combatientes', JSON.stringify(combatientes));
    localStorage.setItem('acciones', JSON.stringify(acciones));
  }, [combatientes, acciones]);

  // Agregar un nuevo combatiente
  const agregarCombatiente = async () => {
    if (!nombreEnemigo || !vitEnemigo || !chakraEnemigo) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const nuevoCombatiente = {
      id: combatientes.length + 1,
      nombre: nombreEnemigo,
      vit: parseInt(vitEnemigo, 10),
      chakra: parseInt(chakraEnemigo, 10),
    };


    setCombatientes((prev) => [...prev, nuevoCombatiente]);

    setNombreEnemigo('');
    setVitEnemigo('');
    setChakraEnemigo('');

    // Guardar en localStorage después de actualizar el estado
    const updatedCombatientes = [...combatientes, nuevoCombatiente];
    console.log('Combatientes después de agregar:', updatedCombatientes);
  };

  // Manejar una acción
  const manejarAccion = () => {
  if (!habilidad || !daño || !costeChakra || !tipo || !ejecutor || !receptor || !ronda) {
    alert('Por favor, completa todos los campos.');
    return;
  }



    // Encontrar los índices del ejecutor y receptor
    const ejecutorIndex = combatientes.findIndex((c) => c.nombre === ejecutor);
    const receptorIndex = combatientes.findIndex((c) => c.nombre === receptor);

    if (ejecutorIndex === -1 || receptorIndex === -1) {
      alert('El ejecutor o receptor no existe.');
      return;
    }


    const ejecutorObj = { ...combatientes[ejecutorIndex] };
    const receptorObj = { ...combatientes[receptorIndex] };


    if (ejecutorIndex === receptorIndex) {
      ejecutorObj.chakra = Math.max(0, ejecutorObj.chakra - parseInt(costeChakra, 10));
      ejecutorObj.vit = Math.max(0, receptorObj.vit - parseInt(daño, 10));
    } else {
    ejecutorObj.chakra = Math.max(0, ejecutorObj.chakra - parseInt(costeChakra, 10));
    receptorObj.vit = Math.max(0, receptorObj.vit - parseInt(daño, 10));
    }


    // Actualizar el estado de los combatientes
    setCombatientes(combatientes.map((c, index) => {
    if (ejecutorIndex === receptorIndex) return ejecutorObj;
    if (index === ejecutorIndex) return ejecutorObj;
    if (index === receptorIndex) return receptorObj;
    return c;
  }));

  // Guardar en localStorage después de actualizar el estado
  localStorage.setItem('combatientes', JSON.stringify(combatientes.map((c, index) => {
    if (index === ejecutorIndex) return ejecutorObj;
    if (index === receptorIndex) return receptorObj;
    return c;
  })));

  // Registrar la acción
  setAcciones((prevAcciones) => [
    ...prevAcciones,
    {
      habilidad,
      daño,
      costeChakra,
      tipo,
      ejecutor,
      receptor,
      ronda,
    },
  ]);

  // Limpiar el formulario
  setHabilidad('');
  setDaño('');
  setCosteChakra('');
  setEjecutor('');
  setReceptor('');
  setRonda('');

  // guardar en localStorage después de actualizar el estado
  const updatedAcciones = [
    ...acciones,
    {
      habilidad,
      daño,
      costeChakra,
      tipo,
      ejecutor,
      receptor,
      ronda,
    },
  ];

  localStorage.setItem('acciones', JSON.stringify(updatedAcciones));
};

  // Limpiar la sesión
const limpiarSesion = () => {
  
  // Eliminar datos de localStorage
  localStorage.removeItem('combatientes');
  localStorage.removeItem('acciones');

  // Limpiar el estado
  setCombatientes([]);
  setAcciones([]);

  // Volver a agregar al usuario como combatiente base si hay resultados disponibles
  if (resultados?.vit && resultados?.chakra) {
    setCombatientes([
      { id: 1, nombre: nombreDeUsuario, vit: resultados.vit, chakra: resultados.chakra },
    ]);
  }
};

const copiarVitYCh = () => {
  // Copy VIT and Chakra stats to clipboard
  const stats = `[ ${resultados.vit} VIT / ${resultados.chakra} CH ]`
  navigator.clipboard.writeText(stats)
}
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full border border-yellow-600">
      <h2 className="text-red-600 font-bold text-lg mb-4 text-center">Gestión de Combate</h2>

      {/* Botón para limpiar la sesión */}
      <button
        onClick={limpiarSesion}
        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition w-full text-sm mb-4"
      >
        Limpiar Sesión
      </button>

      {/* Formulario para agregar combatientes */}
      <div className="mb-4">
        <h3 className="text-gray-800 font-bold text-md mb-2">Agregar Combatiente</h3>
        <input
          type="text"
          value={nombreEnemigo}
          onChange={(e) => setNombreEnemigo(e.target.value)}
          placeholder="Nombre del enemigo"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        <input
          type="number"
          value={vitEnemigo}
          onChange={(e) => setVitEnemigo(e.target.value)}
          placeholder="Vitalidad (VIT)"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        <input
          type="number"
          value={chakraEnemigo}
          onChange={(e) => setChakraEnemigo(e.target.value)}
          placeholder="Chakra"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        <button
          onClick={agregarCombatiente}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition w-full text-sm"
        >
          Agregar Combatiente
        </button>

        <button
          onClick={copiarVitYCh}
          className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition w-full text-sm mt-4"
        >
          Copiar VIT y CH
        </button>
      </div>

      {/* Lista de combatientes */}
      <div className="flex flex-row flex-wrap gap-4">
        <h3 className="text-gray-800 font-bold text-md mb-2 w-full">Combatientes Actuales</h3>
        {combatientes?.map((combatiente) => (
          <div key={combatiente.id} className="flex-1 min-w-[22%]">
            <CombateCard
              nombre={combatiente.nombre}
              vit={combatiente.vit}
              chakra={combatiente.chakra}
            />
          </div>
        ))}
      </div>

      {/* Formulario para registrar acciones */}
      <div className="mb-4">
        <h3 className="text-gray-800 font-bold text-md mb-2">Registrar Acción</h3>
        <input
          type="text"
          value={habilidad}
          onChange={(e) => setHabilidad(e.target.value)}
          placeholder="Nombre de la habilidad"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        <input
          type="number"
          value={daño}
          onChange={(e) => setDaño(e.target.value)}
          placeholder="Daño (ejemplo: 200)"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        <input
          type="number"
          value={costeChakra}
          onChange={(e) => setCosteChakra(e.target.value)}
          placeholder="Coste de Chakra"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        <select
          value={receptor}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        >
          <option value="">Tipo de acción</option>
          {tiposDeAcciones?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={ejecutor}
          onChange={(e) => setEjecutor(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        >
          <option value="">Seleccionar ejecutor</option>
          {combatientes.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          value={receptor}
          onChange={(e) => setReceptor(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        >
          <option value="">Seleccionar receptor</option>
          {combatientes.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={ronda}
          onChange={(e) => setRonda(e.target.value)}
          placeholder="Ronda"
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        />
        

        <button
          onClick={() => setMostrarCamposAdicionales(!mostrarCamposAdicionales)}
          className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition w-full text-sm mb-2"
        >
          {mostrarCamposAdicionales ? 'Cerrar reacción enemigo' : 'Agregar reacción enemigo'}
        </button>

        {mostrarCamposAdicionales && (
          <>

          </>
        )}

        <button
          onClick={manejarAccion}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition w-full text-sm"
        >
          Registrar Acción
        </button>
      </div>

      {/* Lista de acciones */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-gray-800 font-bold text-md mb-2">Historial de Acciones</h3>
        {acciones.length > 0 ? (
          <ul className="space-y-2">
            {acciones.map((accion, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm border border-gray-300"
              >
                <div>
                  <span className="font-bold text-gray-700">{accion.habilidad}</span> -{' '}
                  <span className="text-sm text-gray-500">Ronda {accion.ronda}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {accion.tipo}
                </div>
                <div className="text-sm text-gray-600">
                  {accion.ejecutor} → {accion.receptor}
                </div>
                <div className="text-sm text-gray-500">
                  Daño: {accion.daño}, Chakra: -{accion.costeChakra}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No hay acciones registradas.</p>
        )}
      </div>
    </div>
  );
};

export default CombateManager;
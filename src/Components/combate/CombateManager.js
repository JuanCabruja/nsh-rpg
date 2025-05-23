import React, { useState, useContext, useEffect } from 'react';
import { StatsContext } from '../../Context/StatsContext';
import CombateCard from './CombateCard';

const CombateManager = () => {
  const { resultados } = useContext(StatsContext);

  const tiposDeAcciones =  ['Anticipación',  'Ofensiva',   'Defensiva', 'Evasión', 'Anulación', 'Suplementaria', 'Contraataque', 'Otro']

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
  const [accionEditando, setAccionEditando] = useState(null); // guarda el índice de la acción que se está editando
  const [accionQueReemplaza, setAccionQueReemplaza] = useState('');


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

  const ejecutorIndex = combatientes.findIndex((c) => c.nombre === ejecutor);
  const receptorIndex = combatientes.findIndex((c) => c.nombre === receptor);

  if (ejecutorIndex === -1 || receptorIndex === -1) {
    alert('El ejecutor o receptor no existe.');
    return;
  }

  let nuevaListaCombatientes = [...combatientes];
  let aplicarEfectos = true;

  // ⚠️ Si se edita una acción que está siendo reemplazada por otra, impedirlo
  if (accionEditando !== null) {
    const esReaccionada = acciones.some((a) => a.accionQueReemplaza === accionEditando);
    if (esReaccionada) {
      alert('No se puede editar una acción que está siendo reemplazada por otra. Elimina primero la reacción.');
      return;
    }
  }

  // ⚙️ Revertir efectos si se está editando
  if (accionEditando !== null) {

    const accionOriginal = acciones[accionEditando];
    const ejOrgIndex = combatientes.findIndex(c => c.nombre === accionOriginal.ejecutor);
    const recOrgIndex = combatientes.findIndex(c => c.nombre === accionOriginal.receptor);    

    // Aquí voy a tener que tener en cuenta si la acción original es una reacción y demás para que tenga sentido este editar... Es complex. 
    if (ejOrgIndex !== -1) nuevaListaCombatientes[ejOrgIndex].chakra += parseInt(accionOriginal.costeChakra, 10);
    if (recOrgIndex !== -1) nuevaListaCombatientes[recOrgIndex].vit += parseInt(accionOriginal.daño, 10);

  }

  // 👉 Si la acción reemplaza otra anterior, aplicar la lógica especial
  if (accionQueReemplaza !== '') {
    const indexAnterior = parseInt(accionQueReemplaza, 10);
    const accionAnterior = acciones[indexAnterior];

    if (accionAnterior) {
      const ejAntIndex = combatientes.findIndex(c => c.nombre === accionAnterior.ejecutor);
      const recAntIndex = combatientes.findIndex(c => c.nombre === accionAnterior.receptor);

      const dañoNuevo = parseInt(daño, 10);
      const chakraNuevo = parseInt(costeChakra, 10);
      const dañoAntiguo = parseInt(accionAnterior.daño, 10);
      const chakraAntiguo = parseInt(accionAnterior.costeChakra, 10);

      // 🔵 ANTICIPACIÓN
      if (tipo === 'Anticipación') {
        if (recAntIndex !== -1) nuevaListaCombatientes[recAntIndex].vit += dañoAntiguo;
        if (ejAntIndex !== -1) nuevaListaCombatientes[ejAntIndex].chakra += chakraAntiguo;
        if (ejecutorIndex !== -1) nuevaListaCombatientes[ejecutorIndex].chakra = Math.max(0, nuevaListaCombatientes[ejecutorIndex].chakra - chakraNuevo);
        if (ejAntIndex !== -1) nuevaListaCombatientes[ejAntIndex].vit = Math.max(0, nuevaListaCombatientes[ejAntIndex].vit - dañoNuevo);
        aplicarEfectos = false;
      }

      // 🛡️ DEFENSIVA, EVASIÓN, ANULACIÓN
      else if (['Defensiva', 'Evasión', 'Anulación'].includes(tipo)) {
        if (ejecutorIndex !== -1) nuevaListaCombatientes[ejecutorIndex].chakra = Math.max(0, nuevaListaCombatientes[ejecutorIndex].chakra - chakraNuevo);
        if (recAntIndex !== -1) {
          nuevaListaCombatientes[recAntIndex].vit += dañoAntiguo;
          nuevaListaCombatientes[recAntIndex].vit = Math.max(0, nuevaListaCombatientes[recAntIndex].vit - dañoNuevo);
        }
        aplicarEfectos = false;
      }

      // 🔴 CONTRAATAQUE
      else if (tipo === 'Contraataque') {
        if (ejecutorIndex !== -1) nuevaListaCombatientes[ejecutorIndex].chakra = Math.max(0, nuevaListaCombatientes[ejecutorIndex].chakra - chakraNuevo);
        if (receptorIndex !== -1) nuevaListaCombatientes[receptorIndex].vit = Math.max(0, nuevaListaCombatientes[receptorIndex].vit - dañoNuevo);
        aplicarEfectos = false;
      }
    }
  }

  // ✅ Aplicación estándar si no es una reacción especial
  if (aplicarEfectos) {
    nuevaListaCombatientes[ejecutorIndex].chakra = Math.max(0, nuevaListaCombatientes[ejecutorIndex].chakra - parseInt(costeChakra, 10));
    nuevaListaCombatientes[receptorIndex].vit = Math.max(0, nuevaListaCombatientes[receptorIndex].vit - parseInt(daño, 10));
  }

  // 🧠 Construir y guardar nueva acción
  const nuevaAccion = {
    habilidad,
    daño,
    costeChakra,
    tipo,
    ejecutor,
    receptor,
    ronda,
    accionQueReemplaza: accionQueReemplaza !== '' ? parseInt(accionQueReemplaza, 10) : null,
  };

  let nuevasAcciones;
  if (accionEditando !== null) {
    nuevasAcciones = [...acciones];
    nuevasAcciones[accionEditando] = nuevaAccion;
  } else {
    nuevasAcciones = [...acciones, nuevaAccion];
  }

  setAcciones(nuevasAcciones);
  setCombatientes(nuevaListaCombatientes);
  localStorage.setItem('acciones', JSON.stringify(nuevasAcciones));
  localStorage.setItem('combatientes', JSON.stringify(nuevaListaCombatientes));

  // 🧹 Limpiar formulario
  setAccionEditando(null);
  setHabilidad('');
  setDaño('');
  setCosteChakra('');
  setEjecutor('');
  setReceptor('');
  setRonda('');
  setTipo('');
  setAccionQueReemplaza('');
};



const eliminarAccion = (index) => {
  const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta acción? Esta operación no se puede deshacer.');
  if (!confirmacion) return;

  console.log('Eliminando acción en el índice:', index);
  console.log('Acciones antes de eliminar:', acciones[index]);

  const accion = acciones[index];
  const { ejecutor, receptor, daño, costeChakra, tipo, accionQueReemplaza } = accion;

  const ejecutorIndex = combatientes.findIndex(c => c.nombre === ejecutor);
  const receptorIndex = combatientes.findIndex(c => c.nombre === receptor);

  if (ejecutorIndex === -1 || receptorIndex === -1) {
    alert('Error al revertir la acción. Combatientes no encontrados.');
    return;
  }

  let nuevaListaCombatientes = [...combatientes];

  if (accionQueReemplaza !== null && index !== 0) {
    const accionOriginal = acciones[accionQueReemplaza];
    const ejOriginal = combatientes.find(c => c.nombre === accionOriginal.ejecutor);
    const recOriginal = combatientes.find(c => c.nombre === accionOriginal.receptor);
    const ejOriginalIndex = combatientes.findIndex(c => c.nombre === accionOriginal.ejecutor);
    const recOriginalIndex = combatientes.findIndex(c => c.nombre === accionOriginal.receptor);

    const dañoOriginal = parseInt(accionOriginal.daño, 10);
    const chakraOriginal = parseInt(accionOriginal.costeChakra, 10);
    const dañoReaccion = parseInt(daño, 10);
    const chakraReaccion = parseInt(costeChakra, 10);

    // 🔁 Revertimos los efectos de la reacción según su tipo
    switch (tipo) {
      case 'Anticipación':
        // Revertir daño hecho por la reacción
        if (receptorIndex !== -1) nuevaListaCombatientes[receptorIndex].vit += dañoReaccion;

        // Devolver chakra gastado por la reacción
        if (ejecutorIndex !== -1) nuevaListaCombatientes[ejecutorIndex].chakra += chakraReaccion;

        // Volver a aplicar la acción original
        if (ejOriginalIndex !== -1) nuevaListaCombatientes[ejOriginalIndex].chakra -= chakraOriginal;
        if (recOriginalIndex !== -1) nuevaListaCombatientes[recOriginalIndex].vit -= dañoOriginal;
        break;

      case 'Defensiva':
        console.log(chakraReaccion, dañoReaccion, dañoOriginal, chakraOriginal)
        if (ejecutorIndex !== -1) nuevaListaCombatientes[ejecutorIndex].chakra += chakraReaccion;
        if (receptorIndex !== -1) nuevaListaCombatientes[ejecutorIndex].vit += dañoReaccion;

        // Volver a aplicar daño de la acción original
        if (recOriginalIndex !== -1) nuevaListaCombatientes[ejecutorIndex].vit -= dañoOriginal;
        break;
      case 'Evasión':
      case 'Anulación':
        console.log("Entré aquí")
        if (ejecutorIndex !== -1) nuevaListaCombatientes[ejecutorIndex].chakra += chakraReaccion;
        if (receptorIndex !== -1) nuevaListaCombatientes[receptorIndex].vit += dañoReaccion;

        // Volver a aplicar daño de la acción original
        if (recOriginalIndex !== -1) nuevaListaCombatientes[recOriginalIndex].vit -= dañoOriginal;
        break;

      case 'Contraataque':
        if (ejecutorIndex !== -1) nuevaListaCombatientes[ejecutorIndex].chakra += chakraReaccion;
        if (receptorIndex !== -1) nuevaListaCombatientes[receptorIndex].vit += dañoReaccion;
        break;

      default:
        // Para cualquier otro tipo de reacción
        if (ejecutorIndex !== -1) nuevaListaCombatientes[ejecutorIndex].chakra += chakraReaccion;
        if (ejecutorIndex !== -1) nuevaListaCombatientes[ejecutorIndex].vit += dañoReaccion;
        break;
    }

  } else {
    // Acción normal (no es reacción)
    nuevaListaCombatientes[ejecutorIndex].chakra += parseInt(costeChakra, 10);
    nuevaListaCombatientes[receptorIndex].vit += parseInt(daño, 10);
  }

  // Limitar recuperación a stats base
  if (ejecutorIndex !== -1)
    nuevaListaCombatientes[ejecutorIndex].chakra = Math.min(nuevaListaCombatientes[ejecutorIndex].chakra, resultados?.chakra || 9999);
  if (receptorIndex !== -1)
    nuevaListaCombatientes[receptorIndex].vit = Math.min(nuevaListaCombatientes[receptorIndex].vit, resultados?.vit || 9999);

  // Actualizar combatientes y acciones
  setCombatientes(nuevaListaCombatientes);
  localStorage.setItem('combatientes', JSON.stringify(nuevaListaCombatientes));

  const nuevasAcciones = acciones.filter((_, i) => i !== index);
  setAcciones(nuevasAcciones);
  localStorage.setItem('acciones', JSON.stringify(nuevasAcciones));

  // Limpiar formulario si era la acción editada
  if (accionEditando === index) {
    setAccionEditando(null);
    setHabilidad('');
    setDaño('');
    setCosteChakra('');
    setEjecutor('');
    setReceptor('');
    setRonda('');
    setTipo('');
    setAccionQueReemplaza('');
  }
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
                    <select
        value={accionQueReemplaza}
        onChange={(e) => {
          const idx = e.target.value;
          setAccionQueReemplaza(idx);
        
          if (idx !== '') {
            const accionOriginal = acciones[parseInt(idx, 10)];
            if (accionOriginal) {
              setEjecutor(accionOriginal.receptor); // quien fue atacado, ahora reacciona
              setReceptor(accionOriginal.ejecutor); // quien atacó, ahora recibe la reacción
            }
          }
        }}
        className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
      >
        <option value="">¿Reacciona a una acción anterior?</option>
        {acciones.map((a, idx) => (
          <option key={idx} value={idx}>
            {a.habilidad} (Ronda {a.ronda}) — {a.ejecutor} → {a.receptor}
          </option>
        ))}
      </select>
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
          placeholder="Daño indicar siempre cuanto daño hace o cuanto recibe  (ejemplo: 200)"
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
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
        >
          <option value="">Tipo de acción</option>
          {tiposDeAcciones.map((c) => (
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
        {tipo === 'Contraataque' && (
          <p className="text-xs text-gray-500 mb-2">
            Seleccionar receptor que recibirá el daño del contraataque
          </p>
        )}
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
          onClick={manejarAccion}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition w-full text-sm"
        >
          {accionEditando !== null ? 'Guardar Cambios' : 'Registrar Acción'}

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
                {accion.accionQueReemplaza !== null && (
                  <div className="text-xs italic text-blue-500 mt-1">
                  Reemplaza a acción #{accion.accionQueReemplaza + 1}
                </div>
      )}

                {/* <button
                 onClick={() => {
                   const accion = acciones[index];
                   setHabilidad(accion.habilidad);
                   setDaño(accion.daño);
                   setCosteChakra(accion.costeChakra);
                   setTipo(accion.tipo);
                   setEjecutor(accion.ejecutor);
                   setReceptor(accion.receptor);
                   setRonda(accion.ronda);
                   setAccionEditando(index);
                 }}
                 className="bg-yellow-400 text-xs px-2 py-1 rounded-md ml-2"
                >               
                Editar
              </button> */}
              <button
                onClick={() => eliminarAccion(index)}
                className="bg-red-500 text-xs text-white px-2 py-1 rounded-md ml-2 hover:bg-red-600"
              >
                Eliminar
              </button>


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
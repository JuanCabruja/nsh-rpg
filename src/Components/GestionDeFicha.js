import React, { useContext, useState, useEffect } from 'react';
import { StatsContext } from '../Context/StatsContext';

const GestionDeFicha = () => {
  const { stats, arma, setStats, updateArma } = useContext(StatsContext); // Obtener datos y funciones del contexto
  const [tecnicas, setTecnicas] = useState([]);

  const [nombrePersonaje, setNombrePersonaje] = useState(''); // Estado para el nombre del personaje

  // Cargar técnicas desde localStorage al iniciar
  useEffect(() => {
    const savedTecnicas = localStorage.getItem('tecnicas');
    if (savedTecnicas) {
      setTecnicas(JSON.parse(savedTecnicas));
    }
  }, []);

  // Descargar los datos como un archivo JSON
  const descargarFicha = () => {
    const data = {
      nombrePersonaje,
      stats,
      arma,
      tecnicas,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombrePersonaje || 'ficha_personaje'}.json`; // Usar el nombre del personaje o un nombre por defecto
    a.click();
    URL.revokeObjectURL(url);
  };

  // Cargar un archivo JSON y actualizar los datos
  const cargarFicha = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.nombrePersonaje) setNombrePersonaje(data.nombrePersonaje);
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
    reader.readAsText(file);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full border-2 border-yellow-600 mt-6">
      <h2 className="text-narutoOrange font-righteous text-xl mb-4 text-center">
        Gestión de Ficha
      </h2>
      <div className="space-y-4">
        {/* Campo para el nombre del personaje */}
        <label className="block">
          <span className="text-gray-700">Nombre del Personaje:</span>
          <input
            type="text"
            value={nombrePersonaje}
            onChange={(e) => setNombrePersonaje(e.target.value)}
            placeholder="Introduce el nombre del personaje"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </label>
        {/* Botón para descargar la ficha */}
        <button
          onClick={descargarFicha}
          className="bg-narutoOrange text-white py-2 px-4 rounded-md hover:bg-narutoYellow transition w-full"
        >
          Descargar Ficha
        </button>
        {/* Input para cargar la ficha */}
        <label className="block">
          <span className="text-gray-700">Cargar Ficha:</span>
          <input
            type="file"
            accept="application/json"
            onChange={cargarFicha}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </label>
      </div>
    </div>
  );
};

export default GestionDeFicha;
import React, { useContext, useState } from 'react';
import { StatsContext } from '../Context/StatsContext';

const GestionDeFicha = () => {
  const {  setStats, updateArma,  setTecnicas } = useContext(StatsContext);

  const [nombrePersonaje, setNombrePersonaje] = useState('');

  // Descargar los datos como un archivo JSON
  const descargarFicha = () => {
    const savedStats = JSON.parse(localStorage.getItem('stats') || '{}');
    const savedArma = JSON.parse(localStorage.getItem('arma') || '[]');
    const savedTecnicas = JSON.parse(localStorage.getItem('tecnicas') || []);
    const data = {
      nombrePersonaje,
      "stats" : savedStats,
      "arma" : savedArma,
      "tecnicas" : savedTecnicas,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombrePersonaje || 'ficha_personaje'}.json`;
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
        if (data.nombrePersonaje) {
          setNombrePersonaje(data.nombrePersonaje);
        }
        if (data.stats) {
          setStats(data.stats);
          localStorage.setItem('stats', JSON.stringify(data.stats));
        }
        if (data.arma) {
          updateArma(data.arma.nombre, data.arma.daño);
          localStorage.setItem('arma', JSON.stringify(data.arma));
        }
        if (data.tecnicas) {
          setTecnicas(data.tecnicas);
          localStorage.setItem('tecnicas', JSON.stringify(data.tecnicas));
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
    <div className="bg-white shadow-lg rounded-lg p-4 w-full border-2 border-yellow-600">
      <h2 className="text-narutoOrange font-righteous text-lg mb-3 text-center">
        Gestión de Ficha
      </h2>
      <div className="space-y-3">
        {/* Campo para el nombre del personaje */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-700 mb-1">
            Nombre:
          </label>
          <input
            type="text"
            value={nombrePersonaje}
            onChange={(e) => setNombrePersonaje(e.target.value)}
            placeholder="Nombre del personaje"
            className="border border-gray-300 rounded-md p-1 text-sm"
          />
        </div>

        {/* Botón para descargar la ficha */}
        <button
          onClick={descargarFicha}
          className="bg-narutoOrange text-white py-1 px-2 rounded-md hover:bg-narutoYellow transition w-full text-sm"
        >
          Descargar Ficha
        </button>

        {/* Input para cargar la ficha */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-700 mb-1">
            Cargar Ficha:
          </label>
          <input
            type="file"
            accept="application/json"
            onChange={cargarFicha}
            className="border border-gray-300 rounded-md p-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default GestionDeFicha;
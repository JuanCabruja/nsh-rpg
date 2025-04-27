import React from 'react';

const CombateCard = ({ nombreInicial, vit, chakra, nombre }) => {
  const copiarAlPortapapeles = () => {
    const texto = `[ PT / ${chakra} CH ]`;
    navigator.clipboard.writeText(texto)
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full border border-gray-300 mb-4">
      <h3 className="text-red-600 font-bold text-lg mb-2">{nombre}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Vitalidad (VIT):</label>
          <span className="text-green-700 font-bold text-lg">{vit}</span>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Chakra:</label>
          <span className="text-blue-700 font-bold text-lg">{chakra}</span>
        </div>
      </div>
      <button
        onClick={copiarAlPortapapeles}
        className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition w-full text-sm"
      >
        COPIAR PT
      </button>
    </div>
  );
};

export default CombateCard;
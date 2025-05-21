// Mapeamos la tabla de stat -> experiencia
const statExpTable = new Map([
  [15.5, 150], [16, 150], [16.5, 150], [17, 150], [17.5, 150],
  [18, 150], [18.5, 200], [19, 200], [19.5, 200], [20, 350],
  [20.5, 350], [21, 350], [21.5, 350], [22, 350], [22.5, 400],
  [23, 400], [23.5, 400], [24, 500], [24.5, 500], [25, 750],
  [25.5, 750], [26, 1000], [26.5, 1000], [27, 1000], [27.5, 1000],
  [28, 1000], [28.5, 1000], [29, 1500], [29.5, 1500], [30, 1500],
  [30.5, 1500], [31, 1500], [31.5, 1500], [32, 1500], [32.5, 2000],
  [33, 2000], [33.5, 2000], [34, 2000], [34.5, 2500], [35, 2500],
  [35.5, 3000]
]);

function calculateTotalExp(currentStat, targetStat) {
  if (currentStat >= targetStat) {
    console.log("El stat actual ya es igual o superior al objetivo.");
    return 0;
  }

  let totalExp = 0;

  // Iteramos desde el stat actual hasta el objetivo en incrementos de 0.5
  for (let stat = currentStat + 0.5; stat <= targetStat; stat += 0.5) {
    if (statExpTable.has(stat)) {
      totalExp += statExpTable.get(stat);
    } else {
      console.warn(`No se encontró coste de experiencia para stat ${stat}.`);
    }
  }

  return totalExp;
}

// Ejemplo de uso:
const currentStat = 15;
const targetStat = 20; // Cambia esto al stat objetivo
const experienceRequired = calculateTotalExp(currentStat, targetStat);
console.log(`Experiencia total necesaria para pasar de ${currentStat} a ${targetStat}: ${experienceRequired}`);
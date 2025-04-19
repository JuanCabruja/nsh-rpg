const statExperience = {
    16: 150,
    17: 150,
    18: 150,
    19: 150,
    20: 350,
    21: 350,
    22: 350,
    23: 350,
    24: 350,
    25: 350,
    26: 1000,
    26.5: 1000,
    27: 1000,
    27.5: 1000,
    28: 1000,
    28.5: 1000,
    29: 1500,
    29.5: 1500,
    30: 1500,
    30.5: 1500,
    31: 1500,
    31.5: 1500,
    32: 1500,
    32.5: 2000,
    33: 2000,
    33.5: 2000,
    34: 2000,
    34.5: 2500,
    35: 2500,
    35.5: 3000
  };
  
  // Función que calcula la experiencia acumulada para alcanzar un STAT dado
  function getExperienceToReachStat(targetStat) {
    let totalExp = 0;
  
    for (const [stat, exp] of Object.entries(statExperience)) {
      if (parseFloat(stat) <= targetStat) {
        totalExp += exp;
      }
    }
  
    return totalExp;
  }
  
  // Ejemplo de uso
  const target = 23; // Cambia este valor al STAT que quieras calcular
  console.log(`Experiencia total necesaria para llegar a ${target} STAT: ${getExperienceToReachStat(target)} XP`);
  

//-----------------------------------------------------------------------

// const url =
//   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=0&single=true&output=csv";

// async function planilhaDb() {
//   const response = await fetch(url);
//   const data = await response.text();
//   const planilhaData = Papa.parse(data, { header: true }).data;

//   // console.log(planilhaData);
// }

// planilhaDb();

//---------------------------------------------------------------------
const urlPagina2 =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=1007340004&single=true&output=csv";

// let grupoA = [];
// let grupoB = [];
// let grupoC = [];
// let grupoD = [];
// let grupoE = [];
// let grupoF = [];
// let grupoG = [];
// let grupoH = [];
// let grupoI = [];
// let grupoJ = [];

async function frequenciaNumeros() {
  const response = await fetch(urlPagina2);
  const data = await response.text();
  const pagina2Data = Papa.parse(data, { header: false }).data;

  // //transformando pagina2Data em um objeto - não vou utilizar por enquanto
  //let frequencia = {};
  // pagina2Data.forEach((row) => {
  //   const numero = parseInt(row[0]);
  //   const quantidade = parseInt(row[1]);
  //   if (!(quantidade in frequencia)) {
  //     frequencia[quantidade] = [];
  //   }
  //   frequencia[quantidade].push(numero);
  //   console.log(numero, quantidade);
  // });
  // console.log(frequencia);

  // for (const numero in frequencia) {
  //   if (frequencia.hasOwnProperty(numero)) {
  //     console.log(numero);
  //   }
  // }

  let grupos = Array.from({ length: 10 }, () => []);
  let grupoIndex = 0;
  let quantidadeAtual = null;

  const numerosOrdenados = pagina2Data.sort(
    (a, b) => parseInt(b[1]) - parseInt(a[1])
  );

  console.log(numerosOrdenados);

  numerosOrdenados.forEach((row, i) => {
    const numero = parseInt(row[0]);
    const quantidade = parseInt(row[1]);

    let tamanhoDoGrupo = grupos[grupoIndex].length;

    const quantidadeDaProximaIteracao = parseInt(
      numerosOrdenados[i + 1]?.[1] || 0
    );
    const quantidadeDaProximaIteracao2 = parseInt(
      numerosOrdenados[i + 2]?.[1] || 0
    );

    if (
      (tamanhoDoGrupo === 4 || tamanhoDoGrupo === 5) &&
      quantidade !== quantidadeAtual &&
      quantidade === quantidadeDaProximaIteracao &&
      quantidadeDaProximaIteracao === quantidadeDaProximaIteracao2
    ) {
      grupoIndex += 1;
    }

    if (tamanhoDoGrupo >= 6) {
      if (quantidade !== quantidadeAtual) {
        grupoIndex += 1;
      }

      // Verificar se grupos[grupoIndex] é undefined ou null
      if (grupos[grupoIndex] == null) {
        grupos[grupoIndex] = [];
      }

      grupos[grupoIndex].push(numero);
    }

    if (tamanhoDoGrupo <= 5) {
      // Verificar se grupos[grupoIndex] é undefined ou null
      if (grupos[grupoIndex] == null) {
        grupos[grupoIndex] = [];
      }

      grupos[grupoIndex].push(numero);
    }

    quantidadeAtual = quantidade;
  });

  console.log(grupos);
}

frequenciaNumeros();

// async function frequenciaNumeros() {
//   const response = await fetch(urlPagina2);
//   const data = await response.text();
//   const pagina2Data = Papa.parse(data, { header: false }).data;

//   //console.log(pagina2Data);

//   // transformando pagina2Data em um objeto - não vou utilizar por enquanto
//   // pagina2Data.forEach((row) => {
//   //   const numero = parseInt(row[0]);
//   //   const quantidade = parseInt(row[1]);
//   //   if (!(quantidade in frequencia)) {
//   //     frequencia[quantidade] = [];
//   //   }
//   //   frequencia[quantidade].push(numero);
//   // });

//   let grupos = Array.from({ length: 10 }, () => []);

//   const numerosOrdenados = pagina2Data.sort(
//     (a, b) => parseInt(b[1]) - parseInt(a[1])
//   );

//   let grupoIndex = 0;
//   let quantidadeAtual = null;

//   numerosOrdenados.forEach((row, i) => {
//     const numero = parseInt(row[0]);
//     const quantidade = parseInt(row[1]);

//     const quantidadeDaProximaIteracao = parseInt(
//       numerosOrdenados[i + 1]?.[1] || 0
//     );
//     const quantidadeDaProximaIteracao2 = parseInt(
//       numerosOrdenados[i + 2]?.[1] || 0
//     );

//     grupos[grupoIndex] = grupos[grupoIndex] || [];
//     grupos[grupoIndex].push(numero);
//     if (grupos[grupoIndex].length >= 6) {
//       if (
//         grupos[grupoIndex].length >= 6 &&
//         quantidade === quantidadeDaProximaIteracao
//       ) {
//         grupos[grupoIndex].push(numero);
//       }
//       grupoIndex += 1;
//     }
//   });

//   console.log(grupos);
// }

// frequenciaNumeros();

// async function execute() {
//   await frequenciaNumeros();

//   // Função para gerar as combinações dos grupos
//   function generateCombinations(groups, limit) {
//     const result = [];
//     const indices = new Array(groups.length).fill(0);
//     let count = 0;

//     while (true) {
//       const combination = indices.map((groupIndex, numberIndex) => {
//         const group = groups[numberIndex];
//         return group && group[groupIndex];
//       });

//       result.push(combination);
//       count++;

//       let i = 0;
//       while (
//         i < groups.length &&
//         ++indices[i] === (groups[i] ? groups[i].length : 0)
//       ) {
//         indices[i++] = 0;
//       }

//       if (i === groups.length || count === limit) {
//         break;
//       }
//     }

//     return result;
//   }

//   // Defina os grupos escolhidos pelo usuário
//   const gruposEscolhidos = [grupos[1], grupos[1], grupos[2]];
//   // Gere as combinações limitando a 30 jogos
//   const limiteDeJogos = 30;
//   const todasAsCombinacoes = generateCombinations(
//     gruposEscolhidos,
//     limiteDeJogos
//   );

//   // Exiba as combinações no console
//   todasAsCombinacoes.forEach((combination, index) => {
//     console.log(`Jogo ${index + 1}: ${combination.join(", ")}`);
//   });
// }

// execute();

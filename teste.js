const meuObjetoAtraso = {
  grupo1: [[19], [2], [28], [50], [44], [48], [24], [58]],
  grupo2: [[19], [2], [28], [50], [44], [48], [24], [58]],
  grupo3: [
    [10, 23, 49],
    [36, 53, 55],
    [11, 56, 59],
    [8, 21, 51],
  ],
  grupo4: [
    [10, 23, 49],
    [36, 53, 55],
    [11, 56, 59],
    [8, 21, 51],
  ],
  grupo5: [
    [12, 15, 17, 40, 52],
    [3, 14, 22, 37, 39],
    [5, 25, 29, 43, 47],
    [1, 27, 30, 41, 57],
  ],
  grupo6: [[4, 7, 16, 35, 46, 54]],
};

const meuObjetoFrequencia = {
  A: [10, 53, 5, 37, 23, 34],
  A2: [10, 53, 5, 37, 23, 34],
  D: [56, 27, 43, 54, 29, 11],
  G: [59, 50, 25, 14, 45, 20, 18],
  H: [39, 12, 1, 60, 57],
  I: [47, 9, 19, 7, 40, 31, 3],
};
// Esses dois obetos acima são dezenas da mega sena. Cada objeto contem os 60 números da mega sena distribuídos em grupos expecíficos, os grupos são escolhidos pelo front end através de inputs selecionados pelo usuário
//Preciso de um script js que forme todos os jogos com base nesses dois objetos

// os números que formarão os jogos precisam ser dos seguintes grupos respectivamente

// 6 4 3 2 2 1, um número de cada grupo e
// A B B E G I, um número de cada grupo

// O resultado então deve ter um número do grupo 6, um número do grupo 4, um número do grupo 3. um número do grupo 2, outro número do grupo 2, e por fim um número do grupo 1, mas esses números, também devem pertencer a um número do grupo A outro número do grupo B, mais um número do Grupo B, um número do grupo E, um número do grupo G, e por fim, um número do grupo I.

const gruposFrequencia = Object.keys(meuObjetoFrequencia);

function filtrarNumerosPorGruposAtraso(atraso, gruposFrequencia) {
  const numerosFiltrados = {};

  for (const grupoAtraso in atraso) {
    const numerosGrupoAtraso = atraso[grupoAtraso].flat();
    const numerosFiltradosGrupo = [];

    for (const grupoFrequencia of gruposFrequencia) {
      const numerosGrupoFrequencia = meuObjetoFrequencia[grupoFrequencia];
      const numerosComuns = numerosGrupoAtraso.filter((numero) =>
        numerosGrupoFrequencia.includes(numero)
      );

      numerosFiltradosGrupo.push(numerosComuns);
    }

    numerosFiltrados[grupoAtraso] = numerosFiltradosGrupo;
  }

  return numerosFiltrados;
}

const numerosFiltradosAtraso = filtrarNumerosPorGruposAtraso(
  meuObjetoAtraso,
  gruposFrequencia
);
console.log("numeros filtrados atraso", numerosFiltradosAtraso);

const numerosFiltradosAtrasoResultado = {
  GrupoAtraso1: [[], [], [], [50], [], [19]],
  GrupoAtraso2: [[], [], [], [50], [], [19]],
  grupoAtraso3: [[10, 23, 53], [10, 23, 53], [11, 56], [59], [], []],
  grupoAtraso4: [[10, 23, 53], [10, 23, 53], [11, 56], [59], [], []],
  grupoAtraso5: [
    [37, 5],
    [37, 5],
    [29, 43, 27],
    [14, 25],
    [12, 39, 1, 57],
    [40, 3, 47],
  ],
  grupoAtraso6: [[], [], [54], [], [], [7]],
};
console.log("resultado numeros filtrados", numerosFiltradosAtrasoResultado);

// Transformar o objeto em matriz
const matriz = Object.values(numerosFiltradosAtraso).map((subarray) => [
  ...subarray,
]);

// Função para gerar todas as combinações possíveis
const gerarTodasCombinacoes = (matriz) => {
  const resultado = [];

  const backtrack = (linha = 0, combinacaoAtual = []) => {
    if (linha === matriz.length) {
      resultado.push([...combinacaoAtual]);
      return;
    }

    for (const elemento of matriz[linha]) {
      // Adicionar todos os elementos se a array tiver mais de um elemento
      if (elemento.length > 1) {
        combinacaoAtual.push(...elemento);
      } else {
        combinacaoAtual.push(elemento);
      }
      backtrack(linha + 1, combinacaoAtual);
      combinacaoAtual.length = linha; // Remover elementos da combinação
    }
  };

  backtrack();

  return resultado;
};

// Gerar todas as combinações
const todasCombinacoes = gerarTodasCombinacoes(matriz);

// Exibir resultado
console.log(todasCombinacoes);
// const totalLinhas = matriz.length;
// const totalColunas = matriz.reduce((max, arr) => Math.max(max, arr.length), 0);

// // Percorrer todos os elementos da matriz
// for (let i = 0; i < totalLinhas; i++) {
//   for (let j = 0; j < totalColunas; j++) {
//     console.log(`Elemento na linha ${i + 1}, coluna ${j + 1}:`, matriz[i][j]);
//   }
// }

// const totalLinhas = matriz.length;
// const totalColunas = matriz.reduce((max, arr) => Math.max(max, arr.length), 0);

// // Percorrer todos os elementos, pulando alternadamente uma linha e uma coluna
// for (let i = 0; i < matriz.length; i += 2) {
//   console.log(`Elemento na linha ${i + 1}, coluna ${i + 1}:`, matriz[i][i]);

//   const proximaLinha = i + 1 < matriz.length ? i + 1 : 0; // Voltar para a primeira linha se atingir o final
//   console.log(
//     `Elemento na linha ${proximaLinha + 1}, coluna ${i + 2}:`,
//     matriz[proximaLinha][i + 1]
//   );
// }

// for (const chave in numerosFiltradosAtrasoResultado) {
//   console.log("Chave:", chave);

//   const valores = numerosFiltradosAtrasoResultado[chave];

//   if (Array.isArray(valores)) {
//     for (const valor of valores) {
//       console.log("Valor:", valor);

//       if (Array.isArray(valor)) {
//         for (const subvalor of valor) {
//           console.log("Subvalor:", subvalor);
//         }
//       }
//     }
//   } else {
//     console.log("Valor:", valores);
//   }
// }

// function gerarCombinacoes(numerosFiltradosAtraso) {
//   const resultado = [];
//   const indices = Object.keys(numerosFiltradosAtraso);
//   const grupos = Object.keys(numerosFiltradosAtraso).map(
//     (key) => numerosFiltradosAtraso[key]
//   );

//   function numeroJaEstaNaCombinacao(numero, combinacaoAtual) {
//     return combinacaoAtual.includes(numero);
//   }

//   function temNumeroDaMesmaLinhaOuColuna(numero, combinacaoAtual) {
//     const posicoes = {};

//     indices.forEach((indice, index) => {
//       grupos[index].forEach((num) => {
//         posicoes[num] = index;
//       });
//     });

//     return combinacaoAtual.some((num) => {
//       const posicao = posicoes[num];

//       if (posicao !== undefined) {
//         const numeroInfo = posicoes[numero.indice + numero.numero];

//         if (numeroInfo !== undefined) {
//           return posicao === numeroInfo;
//         }
//       }

//       return false;
//     });
//   }

//   function numeroEstaNoMesmoGrupo(numero, combinacaoAtual) {
//     const indiceAtual = indices.indexOf(numero.indice);
//     if (indiceAtual >= 0 && indiceAtual < grupos.length) {
//       const grupoAtual = grupos[indiceAtual] || [];
//       return combinacaoAtual.some((num) => grupoAtual.includes(num));
//     }
//     return false;
//   }

//   function gerarCombinacaoRecursiva(indiceAtual, combinacaoAtual) {
//     if (combinacaoAtual.length === 6) {
//       resultado.push(combinacaoAtual.slice());
//       return;
//     }

//     if (indiceAtual === indices.length) {
//       return;
//     }

//     const grupoAtual = grupos[indiceAtual] || [];
//     for (let i = 0; i < grupoAtual.length; i++) {
//       const elementosAtuais = grupoAtual[i];

//       if (Array.isArray(elementosAtuais)) {
//         for (const numero of elementosAtuais) {
//           if (
//             !numeroJaEstaNaCombinacao(numero, combinacaoAtual) &&
//             !temNumeroDaMesmaLinhaOuColuna(numero, combinacaoAtual) &&
//             !numeroEstaNoMesmoGrupo(numero, combinacaoAtual)
//           ) {
//             combinacaoAtual.push(numero);
//             gerarCombinacaoRecursiva(indiceAtual + 1, combinacaoAtual);
//             combinacaoAtual.pop();
//           }
//         }
//       } else if (elementosAtuais !== undefined) {
//         if (
//           !numeroJaEstaNaCombinacao(elementosAtuais, combinacaoAtual) &&
//           !temNumeroDaMesmaLinhaOuColuna(
//             { indice: indices[indiceAtual], numero: elementosAtuais },
//             combinacaoAtual
//           ) &&
//           !numeroEstaNoMesmoGrupo(elementosAtuais, combinacaoAtual)
//         ) {
//           combinacaoAtual.push(elementosAtuais);
//           gerarCombinacaoRecursiva(indiceAtual + 1, combinacaoAtual);
//           combinacaoAtual.pop();
//         }
//       }
//     }
//   }

//   gerarCombinacaoRecursiva(0, []);

//   return resultado;
// }

// function removerJogosDuplicados(jogos) {
//   const jogosUnicos = [];
//   const jogosVistos = new Set();

//   for (const jogo of jogos) {
//     // Ordena os números do jogo para garantir consistência
//     const jogoOrdenado = [...jogo].sort().join(",");

//     if (!jogosVistos.has(jogoOrdenado)) {
//       jogosVistos.add(jogoOrdenado);
//       jogosUnicos.push(jogo);
//     }
//   }
//   return jogosUnicos;
// }

// const resultado = gerarCombinacoes(numerosFiltradosAtraso);
// const resultadoJogosDuplicadosRemovidos = removerJogosDuplicados(resultado);
// console.log(resultadoJogosDuplicadosRemovidos);

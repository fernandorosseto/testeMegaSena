// meuObjetoAtraso = {
//   grupo1: [[19], [2], [28], [50], [44], [48], [24], [58]],
//   grupo2: [
//     [9, 18],
//     [26, 45],
//     [32, 33],
//     [13, 60],
//     [6, 38],
//   ],
//   grupo2B: [
//     [9, 18],
//     [26, 45],
//     [32, 33],
//     [13, 60],
//     [6, 38],
//   ],
//   grupo3: [
//     [10, 23, 49],
//     [36, 53, 55],
//     [11, 56, 59],
//     [8, 21, 51],
//   ],
//   grupo4: [[20, 31, 34, 42]],
//   grupo6: [[4, 7, 16, 35, 46, 54]],
// };

// meuObjetoFrequencia = {
//   A: [10, 53, 5, 37, 23, 34],
//   B: [33, 30, 41, 35, 32, 4],
//   B2: [33, 30, 41, 35, 32, 4],
//   E: [49, 36, 16, 51, 13, 8, 46],
//   G: [59, 50, 25, 14, 45, 20, 18],
//   I: [47, 9, 19, 7, 40, 31, 3],
// };
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
console.log(numerosFiltradosAtraso);

const numerosFiltradosAtrasoExemplo = {
  grupo1: [[], [], [], [], [50], [19]],
  grupo2: [[], [32, 33], [32, 33], [13], [18, 45], [9]],
  grupo2B: [[], [32, 33], [32, 33], [13], [18, 45], [9]],
  grupo3: [[10, 23, 53], [], [], 49, 36, 8, 51, [59], []],
  grupo4: [[34], [], [], [], [20], [31]],
  grupo6: [[], [4, 35], [4, 35], [16, 46], [], []],
};
console.log(numerosFiltradosAtrasoExemplo);

function gerarCombinacoes(numerosFiltradosAtraso) {
  const resultado = [];
  const indices = Object.keys(numerosFiltradosAtraso);

  function numeroJaEstaNaCombinacao(numero, combinacaoAtual) {
    return combinacaoAtual.includes(numero);
  }

  function gerarCombinacaoRecursiva(indiceAtual, combinacaoAtual) {
    if (combinacaoAtual.length === 6) {
      resultado.push(combinacaoAtual.slice());
      return;
    }

    if (indiceAtual === indices.length) {
      return;
    }

    const grupoAtual = numerosFiltradosAtraso[indices[indiceAtual]] || [];
    for (let i = 0; i < grupoAtual.length; i++) {
      const elementoAtual = grupoAtual[i];

      if (Array.isArray(elementoAtual)) {
        for (const numero of elementoAtual) {
          if (!numeroJaEstaNaCombinacao(numero, combinacaoAtual)) {
            combinacaoAtual.push(numero);
            gerarCombinacaoRecursiva(indiceAtual + 1, combinacaoAtual);
            combinacaoAtual.pop();
          }
        }
      } else if (elementoAtual !== undefined) {
        if (!numeroJaEstaNaCombinacao(elementoAtual, combinacaoAtual)) {
          combinacaoAtual.push(elementoAtual);
          gerarCombinacaoRecursiva(indiceAtual + 1, combinacaoAtual);
          combinacaoAtual.pop();
        }
      }
    }
  }

  gerarCombinacaoRecursiva(0, []);

  return resultado;
}

const combinacoes = gerarCombinacoes(numerosFiltradosAtrasoExemplo);
console.log(combinacoes);

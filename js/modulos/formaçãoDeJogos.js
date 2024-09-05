// import {
//   preparacaoDados,
//   correlacaoFrequenciaGlobal,
//   correlacaoColunaGlobal,
// } from "./preparacaoDados.js";

// function executarFormacaoDeJogos() {
//   const dadosPreparados = preparacaoDados();

//   function gerarCombinacoes(dadosPreparados) {
//     const resultado = [];
//     const indices = Object.keys(dadosPreparados);

//     function numeroJaEstaNaCombinacao(numero, combinacaoAtual) {
//       return combinacaoAtual.includes(numero);
//     }

//     function gerarCombinacaoRecursiva(indiceAtual, combinacaoAtual) {
//       if (combinacaoAtual.length === 6) {
//         resultado.push(combinacaoAtual.slice());
//         return;
//       }

//       if (indiceAtual === indices.length) {
//         return;
//       }

//       const grupoAtual = dadosPreparados[indices[indiceAtual]] || [];
//       for (let i = 0; i < grupoAtual.length; i++) {
//         const elementoAtual = grupoAtual[i];

//         if (Array.isArray(elementoAtual)) {
//           for (const numero of elementoAtual) {
//             if (!numeroJaEstaNaCombinacao(numero, combinacaoAtual)) {
//               combinacaoAtual.push(numero);
//               gerarCombinacaoRecursiva(indiceAtual + 1, combinacaoAtual);
//               combinacaoAtual.pop();
//             }
//           }
//         } else if (elementoAtual !== undefined) {
//           if (!numeroJaEstaNaCombinacao(elementoAtual, combinacaoAtual)) {
//             combinacaoAtual.push(elementoAtual);
//             gerarCombinacaoRecursiva(indiceAtual + 1, combinacaoAtual);
//             combinacaoAtual.pop();
//           }
//         }
//       }
//     }

//     gerarCombinacaoRecursiva(0, []);

//     return resultado;
//   }

//   const resultadoPreeliminar = gerarCombinacoes(dadosPreparados);
//   //console.log("resultado preeliminar", resultadoPreeliminar);

//   function removerJogosDuplicados(jogos) {
//     const jogosUnicos = [];
//     const jogosVistos = new Set();

//     for (const jogo of jogos) {
//       // Ordena os números do jogo para garantir consistência
//       const jogoOrdenado = [...jogo].sort().join(",");

//       if (!jogosVistos.has(jogoOrdenado)) {
//         jogosVistos.add(jogoOrdenado);
//         jogosUnicos.push(jogo);
//       }
//     }
//     return jogosUnicos;
//   }

//   const resultadoTodosJogos = removerJogosDuplicados(resultadoPreeliminar);
//   //console.log("resultado todos os Jogos", resultadoTodosJogos);

//   function atendeRequisitos(jogo, meuObjetoFrequencia) {
//     // Inicializa um objeto para contar quantos números de cada grupo estão no jogo
//     const numerosPorGrupo = {};

//     // Conta quantas vezes cada grupo aparece no objeto de frequência
//     const contagemChavesIguais = {};
//     Object.keys(meuObjetoFrequencia).forEach((grupo) => {
//       const chave = meuObjetoFrequencia[grupo].toString();
//       contagemChavesIguais[chave] = (contagemChavesIguais[chave] || 0) + 1;
//       numerosPorGrupo[grupo] = 0; // Inicializa a contagem para cada grupo
//     });

//     // Conta quantos números do grupo cada jogo contém
//     jogo.forEach((numero) => {
//       Object.keys(meuObjetoFrequencia).forEach((grupo) => {
//         if (meuObjetoFrequencia[grupo].includes(numero)) {
//           // Incrementa a contagem para o grupo atual
//           numerosPorGrupo[grupo]++;
//         }
//       });
//     });

//     // Verifica se cada grupo tem a quantidade correta de números no jogo
//     const atendeRequisitos = Object.keys(meuObjetoFrequencia).every((grupo) => {
//       const chave = meuObjetoFrequencia[grupo].toString();
//       return numerosPorGrupo[grupo] === contagemChavesIguais[chave];
//     });

//     // Adiciona mensagens de log
//     // console.log("Jogo:", jogo);
//     // console.log("Contagem por grupo:", numerosPorGrupo);
//     // console.log("Atende requisitos:", atendeRequisitos);

//     return atendeRequisitos;
//   }

//   const resultadoFrequencia = resultadoTodosJogos.filter((jogo) =>
//     atendeRequisitos(jogo, correlacaoFrequenciaGlobal)
//   );

//   //-------------------------------------------------------------------------

//   function atendeRequisitosColuna(jogo, meuObjetoColuna) {
//     // Inicializa um objeto para contar quantos números de cada grupo estão no jogo
//     const numerosPorGrupo = {};

//     // Conta quantas vezes cada grupo aparece no objeto de frequência
//     const contagemChavesIguais = {};
//     Object.keys(meuObjetoColuna).forEach((grupo) => {
//       const chave = meuObjetoColuna[grupo].toString();
//       contagemChavesIguais[chave] = (contagemChavesIguais[chave] || 0) + 1;
//       numerosPorGrupo[grupo] = 0; // Inicializa a contagem para cada grupo
//     });

//     // Conta quantos números do grupo cada jogo contém
//     jogo.forEach((numero) => {
//       Object.keys(meuObjetoColuna).forEach((grupo) => {
//         if (meuObjetoColuna[grupo].includes(numero)) {
//           // Incrementa a contagem para o grupo atual
//           numerosPorGrupo[grupo]++;
//         }
//       });
//     });

//     // Verifica se cada grupo tem a quantidade correta de números no jogo
//     const atendeRequisitosColuna = Object.keys(meuObjetoColuna).every(
//       (grupo) => {
//         const chave = meuObjetoColuna[grupo].toString();
//         return numerosPorGrupo[grupo] === contagemChavesIguais[chave];
//       }
//     );

//     // Adiciona mensagens de log
//     // console.log("Jogo:", jogo);
//     // console.log("Contagem por grupo:", numerosPorGrupo);
//     // console.log("Atende requisitos:", atendeRequisitos);

//     return atendeRequisitosColuna;
//   }

//   const resultadoFinalFormacaoJogos = resultadoFrequencia.filter((jogo) =>
//     atendeRequisitosColuna(jogo, correlacaoColunaGlobal)
//   );

//   return resultadoFinalFormacaoJogos;
// }

// export { executarFormacaoDeJogos };

import {
  preparacaoDados,
  correlacaoFrequenciaGlobal,
  correlacaoColunaGlobal,
} from "./preparacaoDados.js";

function executarFormacaoDeJogos() {
  const dadosPreparados = preparacaoDados();

  function gerarCombinacoes(dadosPreparados) {
    const resultado = [];
    const indices = Object.keys(dadosPreparados);

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

      const grupoAtual = dadosPreparados[indices[indiceAtual]] || [];
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

  const resultadoPreeliminar = gerarCombinacoes(dadosPreparados);

  function removerJogosDuplicados(jogos) {
    const jogosUnicos = [];
    const jogosVistos = new Set();

    for (const jogo of jogos) {
      const jogoOrdenado = [...jogo].sort().join(",");
      if (!jogosVistos.has(jogoOrdenado)) {
        jogosVistos.add(jogoOrdenado);
        jogosUnicos.push(jogo);
      }
    }
    return jogosUnicos;
  }

  const resultadoTodosJogos = removerJogosDuplicados(resultadoPreeliminar);

  // Função genérica para atender aos requisitos de frequência ou colunas
  function atendeRequisitos(jogo, meuObjeto) {
    const numerosPorGrupo = {};

    // Conta quantas vezes cada grupo aparece no objeto
    const contagemChavesIguais = {};
    Object.keys(meuObjeto).forEach((grupo) => {
      const chave = meuObjeto[grupo].toString();
      contagemChavesIguais[chave] = (contagemChavesIguais[chave] || 0) + 1;
      numerosPorGrupo[grupo] = 0; // Inicializa a contagem para cada grupo
    });

    // Conta quantos números do grupo cada jogo contém
    jogo.forEach((numero) => {
      Object.keys(meuObjeto).forEach((grupo) => {
        if (meuObjeto[grupo].includes(numero)) {
          numerosPorGrupo[grupo]++;
        }
      });
    });

    // Verifica se cada grupo tem a quantidade correta de números no jogo
    return Object.keys(meuObjeto).every((grupo) => {
      const chave = meuObjeto[grupo].toString();
      return numerosPorGrupo[grupo] === contagemChavesIguais[chave];
    });
  }

  // Filtro final utilizando a função atendeRequisitos para ambos (frequência e colunas)
  const resultadoFrequencia = resultadoTodosJogos.filter((jogo) =>
    atendeRequisitos(jogo, correlacaoFrequenciaGlobal)
  );

  const resultadoFinalFormacaoJogos = resultadoFrequencia.filter((jogo) =>
    atendeRequisitos(jogo, correlacaoColunaGlobal)
  );

  return resultadoFinalFormacaoJogos;
}

export { executarFormacaoDeJogos };

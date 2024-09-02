import { gruposInput, numerosExcluir } from "../main.js";
import { grupoFrequencia } from "./grupoFrequencia.js";
import { grupoAtraso } from "./grupoAtraso.js";
import { gruposColunas } from "./grupoColuna.js";

let numerosFiltradosPorAtraso;
let correlaçãoFrequenciaGlobal;

// function esperarCliqueDoBotao() {
//   return new Promise((resolve) => {
//     const botao = document.getElementById("btnEnviar");
//     botao.addEventListener("click", () => resolve());
//   });
// }

function preparacaoDados() {
  // Função para obter os grupos correlacionados
  function obterGruposCorrelacionados() {
    const { numerosFrequencia, numerosAtraso, numerosColuna } = gruposInput;

    const correlacaoFrequencia = {};
    const correlacaoAtraso = {};
    const correlacaoColuna = {};

    // Processa os grupos de frequência
    numerosFrequencia.forEach((letra) => {
      const indiceGrupoFrequencia = letra.charCodeAt(0) - "A".charCodeAt(0);

      let nomeGrupoFrequencia = letra;

      while (correlacaoFrequencia[nomeGrupoFrequencia]) {
        const numeroSufixo = parseInt(nomeGrupoFrequencia.slice(1)) || 1;
        nomeGrupoFrequencia = letra + (numeroSufixo + 1);
      }

      correlacaoFrequencia[nomeGrupoFrequencia] =
        grupoFrequencia[indiceGrupoFrequencia].slice();
    });

    // Processa os grupos de atraso
    numerosAtraso.forEach((indice) => {
      const indiceGrupoAtraso = indice;

      let nomeGrupoAtraso = `Grupo Atraso ${indice}`;

      while (correlacaoAtraso[nomeGrupoAtraso]) {
        const numeroSufixo = parseInt(nomeGrupoAtraso.slice(13)) || 1;
        nomeGrupoAtraso = `Grupo Atraso ${numeroSufixo + 1}`;
      }

      correlacaoAtraso[nomeGrupoAtraso] = grupoAtraso[indiceGrupoAtraso];
    });

    // Processa os grupos de colunas
    numerosColuna.forEach((indice, i) => {
      const nomeGrupoColuna = `Grupo Coluna ${i + 1}`;
      correlacaoColuna[nomeGrupoColuna] = gruposColunas[indice];
    });

    // console.log(
    //   "numerosFrequencia, atraso e colunas",
    //   numerosFrequencia,
    //   numerosAtraso,
    //   numerosColuna
    // );

    // Retorna os resultados em um objeto
    return {
      correlacaoFrequencia,
      correlacaoAtraso,
      correlacaoColuna,
    };
  }

  // Obtém os grupos correlacionados
  const { correlacaoFrequencia, correlacaoAtraso, correlacaoColuna } =
    obterGruposCorrelacionados();
  console.log("grupoFrequencia", correlacaoFrequencia);
  console.log("grupoAtraso", correlacaoAtraso);
  console.log("grupoColuna", correlacaoColuna);

  // Armazena a correlação global
  correlaçãoFrequenciaGlobal = correlacaoFrequencia;

  // Função para filtrar números de acordo com todos os grupos (frequência, atraso e colunas)
  function filtrarNumerosPorGrupos(atraso, frequencia, coluna) {
    const numerosFiltrados = {};

    for (const grupoAtraso in atraso) {
      // Usamos flat(2) para garantir que todos os níveis de arrays sejam "achados"
      const numerosGrupoAtraso = atraso[grupoAtraso].flat(2);
      const numerosFiltradosGrupo = [];

      numerosGrupoAtraso.forEach((numero) => {
        // Verifica se o número está presente em qualquer grupo de frequência e colunas
        const existeEmFrequencia = Object.values(frequencia).some(
          (grupoFrequencia) => grupoFrequencia.includes(numero)
        );
        const existeEmColuna = Object.values(coluna).some((grupoColuna) =>
          grupoColuna.includes(numero)
        );

        if (existeEmFrequencia && existeEmColuna) {
          numerosFiltradosGrupo.push(numero);
        }
      });

      numerosFiltrados[grupoAtraso] = numerosFiltradosGrupo;
    }

    return numerosFiltrados;
  }

  // Realiza a filtragem dos números com base nos grupos de atraso, frequência e colunas
  numerosFiltradosPorAtraso = filtrarNumerosPorGrupos(
    correlacaoAtraso,
    correlacaoFrequencia,
    correlacaoColuna
  );

  //console.log("numerosFiltrados", numerosFiltradosPorAtraso);

  // Função para excluir números específicos
  function excluirNumeros(numerosExcluir, numerosFiltradosPorAtraso) {
    const copiaNumerosFitradosPorAtraso = { ...numerosFiltradosPorAtraso }; // Cria uma cópia

    for (const letra in copiaNumerosFitradosPorAtraso) {
      copiaNumerosFitradosPorAtraso[letra] = copiaNumerosFitradosPorAtraso[
        letra
      ].map((numeros) => {
        if (Array.isArray(numeros)) {
          return numeros.filter(
            (numero) => !numerosExcluir.includes(parseInt(numero, 10))
          );
        } else {
          // Se `numeros` não for um array, mas sim um número ou outro valor, apenas retorne-o sem modificações
          return numeros;
        }
      });
    }

    return copiaNumerosFitradosPorAtraso;
  }

  // Exclui os números indesejados e prepara os números para a formação de jogos
  const numerosParaFormacaoDeJogos = excluirNumeros(
    numerosExcluir,
    numerosFiltradosPorAtraso
  );

  console.log("numerosParaFormacaoDeJogos", numerosParaFormacaoDeJogos);

  return numerosParaFormacaoDeJogos;
}

export { preparacaoDados, correlaçãoFrequenciaGlobal };

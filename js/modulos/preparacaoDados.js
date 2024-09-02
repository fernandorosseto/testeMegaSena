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
    console.log(
      "numerosFrequencia, atraso e colunas",
      numerosFrequencia,
      numerosAtraso,
      numerosColuna
    );

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

  // Filtra os números de acordo com os grupos de atraso e frequência
  function filtrarNumerosPorGruposAtraso(atraso, gruposFrequencia) {
    const numerosFiltrados = {};

    for (const grupoAtraso in atraso) {
      const numerosGrupoAtraso = atraso[grupoAtraso].flat();
      const numerosFiltradosGrupo = [];

      for (const grupoFrequenciaKey of Object.keys(gruposFrequencia)) {
        const numerosGrupoFrequencia = gruposFrequencia[grupoFrequenciaKey];
        const numerosComuns = numerosGrupoAtraso.filter((numero) =>
          numerosGrupoFrequencia.includes(numero)
        );

        numerosFiltradosGrupo.push(numerosComuns);
      }

      numerosFiltrados[grupoAtraso] = numerosFiltradosGrupo;
    }

    return numerosFiltrados;
  }

  // Realiza a filtragem dos números com base nos grupos de atraso
  numerosFiltradosPorAtraso = filtrarNumerosPorGruposAtraso(
    correlacaoAtraso,
    correlacaoFrequencia
  );
  //console.log("numerosFiltrados", numerosFiltradosPorAtraso);

  // Função para excluir números específicos
  function excluirNumeros(numerosExcluir, numerosFiltradosPorAtraso) {
    const copiaNumerosFitradosPorAtraso = { ...numerosFiltradosPorAtraso }; // Cria uma cópia

    for (const letra in copiaNumerosFitradosPorAtraso) {
      copiaNumerosFitradosPorAtraso[letra] = copiaNumerosFitradosPorAtraso[
        letra
      ].map((numeros) =>
        numeros.filter(
          (numero) => !numerosExcluir.includes(parseInt(numero, 10))
        )
      );
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

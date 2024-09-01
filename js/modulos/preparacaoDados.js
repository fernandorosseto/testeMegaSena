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
  // await esperarCliqueDoBotao();

  function obterGruposCorrelacionados() {
    const { numerosFrequencia, numerosAtraso } = gruposInput;
    console.log("numerosFrequencia e atraso", numerosFrequencia, numerosAtraso);
    const correlacaoFrequencia = {};
    const correlacaoAtraso = {};

    numerosFrequencia.forEach((letra) => {
      const indiceGrupoFrequencia = letra.charCodeAt(0) - "A".charCodeAt(0);

      let nomeGrupoFrequencia = letra;

      // Verifique se a chave já existe no objeto
      while (correlacaoFrequencia[nomeGrupoFrequencia]) {
        // Se existir, adicione um sufixo incremental ao nome para permitir duplicidades
        const numeroSufixo = parseInt(nomeGrupoFrequencia.slice(1)) || 1;
        nomeGrupoFrequencia = letra + (numeroSufixo + 1);
      }

      // Crie uma cópia do grupo correspondente e atribua ao nome atualizado
      correlacaoFrequencia[nomeGrupoFrequencia] =
        grupoFrequencia[indiceGrupoFrequencia].slice();
    });

    numerosAtraso.forEach((indice) => {
      const indiceGrupoAtraso = indice;

      let nomeGrupoAtraso = `Grupo Atraso ${indice}`;

      // Verifique se a chave já existe no objeto
      while (correlacaoAtraso[nomeGrupoAtraso]) {
        // Se existir, adicione um sufixo incremental ao nome para permitir duplicidades
        const numeroSufixo = parseInt(nomeGrupoAtraso.slice(13)) || 1;
        nomeGrupoAtraso = `Grupo Atraso ${numeroSufixo + 1}`;
      }

      // Crie uma cópia do grupo correspondente e atribua ao nome atualizado
      correlacaoAtraso[nomeGrupoAtraso] = grupoAtraso[indiceGrupoAtraso];
    });

    // Retorne os resultados em um objeto
    return {
      correlacaoFrequencia,
      correlacaoAtraso,
    };
  }

  const { correlacaoFrequencia, correlacaoAtraso } =
    obterGruposCorrelacionados();
  console.log("grupoFrequencia", correlacaoFrequencia);
  console.log("grupoAtraso", correlacaoAtraso);

  correlaçãoFrequenciaGlobal = correlacaoFrequencia;

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

  numerosFiltradosPorAtraso = filtrarNumerosPorGruposAtraso(
    correlacaoAtraso,
    correlacaoFrequencia
  );
  //console.log("numerosFiltrados", numerosFiltradosPorAtraso);

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

  const numerosParaFormacaoDeJogos = excluirNumeros(
    numerosExcluir,
    numerosFiltradosPorAtraso
  );

  console.log("numerosParaFormacaoDeJogos", numerosParaFormacaoDeJogos);

  return numerosParaFormacaoDeJogos;
}

export { preparacaoDados, correlaçãoFrequenciaGlobal };

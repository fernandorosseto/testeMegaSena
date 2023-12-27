import { gruposInput } from "../main.js";
import { obterGruposPeloInput } from "./index.js";

function esperandoCLickDoBotao() {
  return new Promise((resolve) => {
    const intervalo = setInterval(() => {
      if (gruposInput) {
        clearInterval(intervalo);
        resolve(gruposInput);
      }
    }, 100);
  });
}

async function PreparacaoDados() {
  const esperarCLick = await esperandoCLickDoBotao();

  function obterGruposCorrelacionados() {
    const { numerosFrequencia, numerosAtraso } = obterGruposPeloInput();
    const correlacao = {};

    numerosFrequencia.forEach((letra, indice) => {
      const numeroAtraso = numerosAtraso[indice];
      const chave = `${letra}-${numeroAtraso}`;

      let nomeGrupo = chave;

      // Verifique se a chave já existe no objeto
      while (correlacao[nomeGrupo]) {
        // Se existir, adicione um sufixo incremental ao nome para permitir duplicidades
        const numeroSufixo = parseInt(nomeGrupo.slice(chave.length + 1)) || 1;
        nomeGrupo = chave + `-${numeroSufixo}`;
      }

      // Crie uma cópia do grupo correspondente e atribua ao nome atualizado
      correlacao[nomeGrupo] = resultadoNumerico[indice].slice();
    });

    return correlacao;
  }
}

export { obterGruposCorrelacionados };

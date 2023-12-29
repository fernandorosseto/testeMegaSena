import { planilhaDb } from "./dados.js";

// Código para pegar todos os jogos da mega sena e montar o grupo de atraso.
let arraysAgrupadasPorTamanho = {};

async function funcaoArraysAgrupadasPorTamanho() {
  // Espera pelos dados antes de prosseguir
  const dadosPlanilha = await planilhaDb();
  const jogos = dadosPlanilha.map((jogo) => {
    const dezenas = [];
    for (let i = 1; i <= 6; i++) {
      const dezena = parseInt(jogo[`dezena${i}`]);
      if (!isNaN(dezena)) {
        dezenas.push(dezena);
      }
    }
    return dezenas;
  });

  for (let i = 1; i <= 6; i++) {
    arraysAgrupadasPorTamanho[i] = [];
  }

  // Agrupe os jogos com base nas regras fornecidas
  const grupos = [];
  let grupoAtual = [jogos[0]];

  for (let i = 1; i < jogos.length; i++) {
    const jogoAtual = jogos[i];

    // Exclui números que já saíram dos grupos anteriores
    grupoAtual = grupoAtual.map((grupoJogo) =>
      grupoJogo.filter((num) => !jogoAtual.includes(num))
    );

    // Remove arrays vazias
    grupoAtual = grupoAtual.filter((grupoJogo) => grupoJogo.length > 0);

    // Verifica se algum número do jogo atual já saiu nos jogos anteriores
    const numerosSairam = jogoAtual.filter((num) =>
      grupoAtual.flat().includes(num)
    );

    if (numerosSairam.length === 0) {
      // Adiciona o jogo ao grupo atual
      grupoAtual.push(jogoAtual);
    } else {
      // Move para o próximo grupo com base na quantidade de números que já saíram
      grupos.push(grupoAtual);
      grupoAtual = [jogoAtual];
    }
  }

  // Adiciona o último grupo
  grupos.push(grupoAtual);

  // Adicione as arrays correspondentes ao objeto arraysAgrupadasPorTamanho
  grupoAtual.forEach((array) => {
    const tamanho = array.length;
    arraysAgrupadasPorTamanho[tamanho].push(array);
  });

  return arraysAgrupadasPorTamanho;
}

const grupoAtraso = await funcaoArraysAgrupadasPorTamanho();
//console.log(grupoAtraso);

export { grupoAtraso };

import { planilhaDb } from "./dados.js";

let gruposPorPosicao = {};

async function agruparPorPosicao() {
  // Inicializa os grupos por posição
  for (let i = 1; i <= 6; i++) {
    gruposPorPosicao[i] = new Set();
  }

  const dadosPlanilha = await planilhaDb();

  dadosPlanilha.forEach((jogo) => {
    // Remove o número da posição anterior e adiciona na nova posição
    for (let i = 1; i <= 6; i++) {
      const dezena = parseInt(jogo[`dezena${i}`]);
      if (!isNaN(dezena)) {
        // Remove o número de qualquer grupo em que esteja atualmente
        for (let j = 1; j <= 6; j++) {
          gruposPorPosicao[j].delete(dezena);
        }
        // Adiciona o número ao grupo correspondente à posição atual, com exceção dos números 59 e 60
        if (dezena === 60) {
          gruposPorPosicao[1].add(dezena);
        } else if (dezena === 59) {
          gruposPorPosicao[6].add(dezena);
        } else {
          gruposPorPosicao[i].add(dezena);
        }
      }
    }
  });

  // Converte os sets para arrays para a saída final
  let resultadoFinal = {};
  for (let i = 1; i <= 6; i++) {
    resultadoFinal[i] = Array.from(gruposPorPosicao[i]);
  }

  return resultadoFinal;
}

const gruposColunas = await agruparPorPosicao();

export { gruposColunas };

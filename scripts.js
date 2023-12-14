//-----------------------------------------------------------------------

const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=0&single=true&output=csv";

async function planilhaDb() {
  const response = await fetch(url);
  const data = await response.text();
  const planilhaData = Papa.parse(data, { header: true }).data;

  // console.log(planilhaData);
}

planilhaDb();

//---------------------------------------------------------------------
const urlPagina2 =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=1007340004&single=true&output=csv";

//página4 para testes
//gid pag2 1007340004
//gid pag4 4064556

let grupos;

async function frequenciaNumeros() {
  const response = await fetch(urlPagina2);
  const data = await response.text();
  const pagina2Data = Papa.parse(data, { header: false }).data;

  grupos = Array.from({ length: 10 }, () => []);
  let grupoIndex = 0;
  let quantidadeAtual = null;

  const numerosOrdenados = pagina2Data.sort(
    (a, b) => parseInt(b[1]) - parseInt(a[1])
  );

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

    const quantidadeDaProximaIteracao3 = parseInt(
      numerosOrdenados[i + 3]?.[1] || 0
    );

    if (grupoIndex < grupos.length) {
      grupos[grupoIndex].push(numero);
      //console.log(grupos[grupoIndex]);
    }

    if (tamanhoDoGrupo >= 5 && quantidade !== quantidadeDaProximaIteracao) {
      grupoIndex += 1;
    }
    if (
      tamanhoDoGrupo === 3 &&
      quantidadeDaProximaIteracao === quantidadeDaProximaIteracao2
    ) {
      grupoIndex += 1;
    }

    // if (
    //   tamanhoDoGrupo === 3 &&
    //   quantidade === quantidadeDaProximaIteracao &&
    //   quantidadeDaProximaIteracao2 === quantidadeDaProximaIteracao3
    // ) {
    //   grupoIndex += 1;
    // }

    quantidadeAtual = quantidade;
  });

  console.log(grupos);
}

frequenciaNumeros();

function excluirArraysComNumerosEspecificos(arrays, numerosEspecificos) {
  return arrays.filter((array) => {
    for (const numeroEspecifico of numerosEspecificos) {
      if (array.includes(numeroEspecifico)) {
        return false; // Exclui a array se encontrar um número específico
      }
    }
    return true; // Mantém a array se não encontrar nenhum número específico
  });
}

async function execute() {
  await frequenciaNumeros();
  console.log("inicio função execute");
  function produtoCartesiano(...conjuntos) {
    return conjuntos.reduce(
      (acumulador, conjuntoAtual) => {
        const novoAcumulador = [];
        acumulador.forEach((elementoAcumulado) => {
          conjuntoAtual.forEach((elementoConjuntoAtual) => {
            const novaCombinação = [
              ...elementoAcumulado,
              elementoConjuntoAtual,
            ];
            // Verifica se há pelo menos dois números iguais na nova combinação
            if (!temDoisNumerosIguais(novaCombinação)) {
              novoAcumulador.push(novaCombinação);
            }
          });
        });
        return novoAcumulador;
      },
      [[]]
    );
  }

  // Função para verificar se há pelo menos dois números iguais em uma array
  function temDoisNumerosIguais(array) {
    const conjuntoUnico = new Set(array);
    return array.length !== conjuntoUnico.size;
  }

  const resultado = produtoCartesiano(
    grupos[0],
    grupos[0],
    grupos[2],
    grupos[3],
    grupos[4],
    grupos[5]
  );

  console.log(resultado);

  // Exemplo de uso: exclui arrays que contêm os números 1 e 2
  const resultadoFiltrado = excluirArraysComNumerosEspecificos(
    resultado,
    [1, 2]
  );
  console.log(resultadoFiltrado);
}

execute();

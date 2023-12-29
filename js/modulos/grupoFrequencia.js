import { dadosPagina2 } from "./dados.js";

//lógica para criar o grupo frequência
async function frequenciaNumeros() {
  const dadosPagina2variavel = await dadosPagina2();
  //console.log(dadosPagina2variavel);

  function distribuirDezenas(dados) {
    // Ordenar as dezenas por frequência de forma decrescente
    const sortedData = dados.sort((a, b) => b[1] - a[1]);

    // Inicializar os grupos
    const gruposFrequencia = Array.from({ length: 10 }, () => []);

    // Distribuir as dezenas nos grupos de forma decrescente e mantendo ordem dentro de cada grupo
    let grupoIndex = 0;
    for (let i = 0; i < sortedData.length; i++) {
      const grupoAtual = gruposFrequencia[grupoIndex];

      // Verificar se o grupo já contém elementos
      if (grupoAtual.length >= 5) {
        // Se o grupo já tiver 6 ou mais elementos, mudar para o próximo grupo
        grupoIndex = (grupoIndex + 1) % 10;
      }

      // Inserir dezena no grupo
      grupoAtual.push(sortedData[i][0]);
    }

    // Verificar quais números do grupo atual têm a mesma quantidade que os números do próximo grupo
    for (let i = 0; i < gruposFrequencia.length - 1; i++) {
      const grupoAtual = gruposFrequencia[i];
      const proximoGrupo = gruposFrequencia[i + 1];

      const numerosIguais = grupoAtual.filter((numAtual) => {
        const quantidadeAtual = sortedData.find(
          (item) => item[0] === numAtual
        )[1];
        return proximoGrupo.some((numProximo) => {
          const quantidadeProximo = sortedData.find(
            (item) => item[0] === numProximo
          )[1];
          return quantidadeAtual === quantidadeProximo;
        });
      });

      if (numerosIguais.length > 0) {
        const numerosIguaisDoProximoGrupo = proximoGrupo.filter(
          (numProximo) => {
            const quantidadeProximo = sortedData.find(
              (item) => item[0] === numProximo
            )[1];
            return numerosIguais.some((numAtual) => {
              const quantidadeAtual = sortedData.find(
                (item) => item[0] === numAtual
              )[1];
              return quantidadeAtual === quantidadeProximo;
            });
          }
        );

        const mensagem = `Os números ${numerosIguais.join(", ")} do grupo ${
          i + 1
        } têm a mesma quantidade dos números ${numerosIguaisDoProximoGrupo.join(
          ", "
        )} do grupo ${i + 2}`;
        //console.log(mensagem);
      }

      // Mover os números iguais para o próximo grupo
      numerosIguais.forEach((num) => {
        const indexNoGrupoAtual = grupoAtual.indexOf(num);
        grupoAtual.splice(indexNoGrupoAtual, 1);
        proximoGrupo.push(num);
      });
      proximoGrupo.sort((a, b) => {
        const frequenciaA = sortedData.find((item) => item[0] === a)[1];
        const frequenciaB = sortedData.find((item) => item[0] === b)[1];
        // Ordenar por quantidade (decrescente)
        if (frequenciaB !== frequenciaA) {
          return frequenciaB - frequenciaA;
        }
        // Se a quantidade for a mesma, ordenar por número (decrescente)
        return b - a;
      });
    }

    return gruposFrequencia;
  }

  const resultadoGrupos = distribuirDezenas(dadosPagina2variavel);

  return resultadoGrupos;
}

const grupoFrequenciaNumeros = await frequenciaNumeros();

const grupoFrequencia = grupoFrequenciaNumeros.map((grupo) => {
  return grupo.map((numero) => parseInt(numero, 10));
});

//console.log(grupoFrequencia);

export { grupoFrequencia };

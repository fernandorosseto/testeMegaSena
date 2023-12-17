//-----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Seu código aqui
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
  let pagina2Data;
  let resultadoGrupos;

  async function frequenciaNumeros() {
    const response = await fetch(urlPagina2);
    const data = await response.text();
    pagina2Data = Papa.parse(data, { header: false }).data;

    //console.log(pagina2Data);

    function distribuirDezenas(data) {
      // Ordenar as dezenas por frequência de forma decrescente
      const sortedData = data.sort((a, b) => b[1] - a[1]);

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

    resultadoGrupos = distribuirDezenas(pagina2Data);
    console.log(resultadoGrupos);
  }
  frequenciaNumeros();

  function obterLetraDoIndice(indice) {
    return String.fromCharCode("A".charCodeAt(0) + indice);
  }

  function obterQuantidadeFrequencia(numero) {
    const item = pagina2Data.find((item) => item[0] === numero);
    return item ? item[1] : 0;
  }

  function exibirGrupos() {
    const divGrupoFrequencia = document.getElementById("grupoFrequencia");
    divGrupoFrequencia.innerHTML = "";

    // Cria uma tabela
    const tabela = document.createElement("table");

    // Adiciona os grupos à tabela
    resultadoGrupos.forEach((grupo, indice) => {
      const row = tabela.insertRow(-1);

      // Adiciona o número do grupo em uma célula
      const cellGrupo = row.insertCell(0);
      cellGrupo.style.overflow = "hidden";
      cellGrupo.textContent = `Grupo ${obterLetraDoIndice(indice)}`;

      // Adiciona cada número do grupo em células individuais
      grupo.forEach((numero) => {
        const cellNumero = row.insertCell(-1);
        cellNumero.textContent = numero;
        cellNumero.style.overflow = "hidden";

        // Adiciona evento de duplo clique para mostrar a quantidade da frequência
        cellNumero.addEventListener("dblclick", () => {
          const quantidadeFrequencia = obterQuantidadeFrequencia(numero);
          cellNumero.textContent = quantidadeFrequencia;

          // Atrasa a troca de volta ao número original em 1000 milissegundos (1 segundo)
          setTimeout(() => {
            cellNumero.textContent = numero;
          }, 1000);
        });
      });
    });

    // Adiciona a tabela ao elemento divGrupoFrequencia
    divGrupoFrequencia.appendChild(tabela);
  }

  function obterGruposPeloInput() {
    const primeiroGrupo = document
      .getElementById("primeiroGrupo")
      .value.toUpperCase();
    const segundoGrupo = document
      .getElementById("segundoGrupo")
      .value.toUpperCase();
    const terceiroGrupo = document
      .getElementById("terceiroGrupo")
      .value.toUpperCase();
    const quartoGrupo = document
      .getElementById("quartoGrupo")
      .value.toUpperCase();
    const quintoGrupo = document
      .getElementById("quintoGrupo")
      .value.toUpperCase();
    const sextoGrupo = document
      .getElementById("sextoGrupo")
      .value.toUpperCase();

    return [
      primeiroGrupo,
      segundoGrupo,
      terceiroGrupo,
      quartoGrupo,
      quintoGrupo,
      sextoGrupo,
    ];
  }

  function obterNumerosExcluir() {
    const numerosExcluirInput = document.getElementById("excluirJogos");

    // Verifica se o elemento existe antes de acessar a propriedade value
    if (numerosExcluirInput) {
      const numerosExcluirTexto = numerosExcluirInput.value;

      // Verifica se a string não está vazia antes de dividir
      if (numerosExcluirTexto.trim() !== "") {
        // Divida a entrada do usuário em uma matriz de números
        const numerosExcluirArray = numerosExcluirTexto
          .split(",")
          .map((numero) => parseInt(numero.trim(), 10))
          .filter((numero) => !isNaN(numero));

        return numerosExcluirArray;
      }
    }

    // Se o elemento não existe ou a string está vazia, retorna uma matriz vazia
    return [];
  }

  function obterGruposCorrelacionados() {
    const gruposInput = obterGruposPeloInput();
    const correlacao = {};

    gruposInput.forEach((letra, indice) => {
      const indiceGrupo = letra.charCodeAt(0) - "A".charCodeAt(0);

      let nomeGrupo = letra;

      // Verifique se a chave já existe no objeto
      while (correlacao[nomeGrupo]) {
        // Se existir, adicione um sufixo incremental ao nome
        const numeroSufixo = parseInt(nomeGrupo.slice(1)) || 1;
        nomeGrupo = letra + (numeroSufixo + 1);
      }

      // Crie uma cópia do grupo correspondente e atribua ao nome atualizado
      correlacao[nomeGrupo] = resultadoGrupos[indiceGrupo].slice();
    });

    return correlacao;
  }

  function excluirNumerosCorrelacionados(correlacao, numerosExcluir) {
    const gruposExcluidos = { ...correlacao }; // Cria uma cópia dos grupos correlacionados

    for (const letra in gruposExcluidos) {
      gruposExcluidos[letra] = gruposExcluidos[letra].filter(
        (numero) => !numerosExcluir.includes(parseInt(numero, 10))
      );
    }

    return gruposExcluidos;
  }

  function produtoCartesiano(...conjuntos) {
    return conjuntos.reduce(
      (acumulador, conjuntoAtual) => {
        const novoAcumulador = [];
        acumulador.forEach((elementoAcumulado) => {
          // Verifica se conjuntoAtual é um array antes de chamar forEach
          if (Array.isArray(conjuntoAtual)) {
            conjuntoAtual.forEach((elementoConjuntoAtual) => {
              const novaCombinação = [
                ...elementoAcumulado,
                elementoConjuntoAtual,
              ];
              // Verifica se há números iguais na nova combinação
              if (!temNumerosIguais(novaCombinação)) {
                novoAcumulador.push(novaCombinação);
              }
            });
          }
        });
        return novoAcumulador;
      },
      [[]]
    );
  }

  // Função para verificar se há números iguais em uma array
  function temNumerosIguais(array) {
    const conjuntoUnico = new Set(array);
    return array.length !== conjuntoUnico.size;
  }

  // function produtoCartesiano(...conjuntos) {
  //   return conjuntos.reduce(
  //     (acumulador, conjuntoAtual) => {
  //       const novoAcumulador = [];
  //       acumulador.forEach((elementoAcumulado) => {
  //         conjuntoAtual.forEach((elementoConjuntoAtual) => {
  //           const novaCombinação = [
  //             ...elementoAcumulado,
  //             elementoConjuntoAtual,
  //           ];
  //           // Verifica se há pelo menos dois números iguais na nova combinação
  //           if (!temDoisNumerosIguais(novaCombinação)) {
  //             novoAcumulador.push(novaCombinação);
  //           }
  //         });
  //       });
  //       return novoAcumulador;
  //     },
  //     [[]]
  //   );
  // }

  // // Função para verificar se há pelo menos dois números iguais em uma array
  // function temDoisNumerosIguais(array) {
  //   const conjuntoUnico = new Set(array);
  //   return array.length !== conjuntoUnico.size;
  // }

  async function execute() {
    await frequenciaNumeros();
    exibirGrupos();
    const btnEnviar = document.getElementById("btnEnviar");
    btnEnviar.addEventListener("click", function () {
      const gruposCorrelacionados = obterGruposCorrelacionados();
      console.log("gruposCorrelacionads", gruposCorrelacionados);
      const numerosExcluir = obterNumerosExcluir();
      const gruposParaProcessamento = excluirNumerosCorrelacionados(
        gruposCorrelacionados,
        numerosExcluir
      );
      console.log("grupo para Processamento", gruposParaProcessamento);
      // Extrai os arrays dos valores do objeto
      const arraysGruposParaProcessamento = Object.values(
        gruposParaProcessamento
      );

      // Filtra apenas os arrays válidos
      const gruposValidos = arraysGruposParaProcessamento.filter(Array.isArray);

      //Chama a função produtoCartesiano
      const proximosJogosMegaSena = produtoCartesiano(...gruposValidos);

      // Imprime o resultado
      console.log("Proximos Jogos Mega Sena:", proximosJogosMegaSena);
    });
  }
  execute();
});

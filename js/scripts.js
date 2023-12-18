//-----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=0&single=true&output=csv";

  async function planilhaDb() {
    const response = await fetch(url);
    const data = await response.text();
    const planilhaData = Papa.parse(data, { header: true }).data;

    // Obtenha as dezenas da Mega Sena de cada jogo
    const jogos = planilhaData.map((jogo) => {
      const dezenas = [];
      for (let i = 1; i <= 6; i++) {
        const dezena = parseInt(jogo[`dezena${i}`]);
        if (!isNaN(dezena)) {
          dezenas.push(dezena);
        }
      }
      return dezenas;
    });

    // Criar um objeto para armazenar as arrays com base no tamanho
    const arraysAgrupadasPorTamanho = {};

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

    // Imprimir o objeto resultante
    console.log(arraysAgrupadasPorTamanho);

    function exibirGruposAtraso() {
      const divGrupoAtraso = document.getElementById("grupoAtraso");
      divGrupoAtraso.innerHTML = "";

      // Cria um contêiner para a grade
      const gridContainer = document.createElement("div");
      gridContainer.classList.add("grupo-grid");

      // Adiciona os grupos ao contêiner da grade
      for (const tamanho in arraysAgrupadasPorTamanho) {
        if (arraysAgrupadasPorTamanho.hasOwnProperty(tamanho)) {
          const grupo = arraysAgrupadasPorTamanho[tamanho];

          // Cria uma div para cada grupo
          const grupoDiv = document.createElement("div");
          grupoDiv.classList.add("grupo-item");

          // Adiciona o número do grupo
          const grupoNumero = document.createElement("div");
          grupoNumero.textContent = `Grupo ${tamanho}`;
          grupoDiv.appendChild(grupoNumero);

          // Adiciona cada número do grupo em células individuais
          grupo.forEach((numero) => {
            const numeroDiv = document.createElement("div");
            numeroDiv.textContent = numero;
            grupoDiv.appendChild(numeroDiv);
          });

          // Adiciona a div do grupo ao contêiner da grade
          gridContainer.appendChild(grupoDiv);
        }
      }

      // Adiciona o contêiner da grade ao elemento divGrupoAtraso
      divGrupoAtraso.appendChild(gridContainer);
    }

    // Chama a função para exibir os grupos no HTML
    exibirGruposAtraso();
  }

  planilhaDb();

  //----------------------------------------------------------------------------------------------------------
  // Pegar os dados das frequências de cada número disponíveis numa planilha do google sheets.
  const urlPagina2 =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=1007340004&single=true&output=csv";

  //página4 para testes
  //gid pag2 1007340004
  //gid pag4 4064556
  let pagina2Data;
  let resultadoGrupos;

  // Função responsável por receber os dados da urlPagina2 e distribuir as dezenas da mega sena em três grupos
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

  //Nomeando os grupos no front-end com base nos índices, A para o resultadoGrupos[0], até o J para o resultadoGrupos[9]
  function obterLetraDoIndice(indice) {
    return String.fromCharCode("A".charCodeAt(0) + indice);
  }

  //função para obter a frequência dos números será utilizarda na função exibir grupos
  function obterQuantidadeFrequencia(numero) {
    const item = pagina2Data.find((item) => item[0] === numero);
    return item ? item[1] : 0;
  }

  // Exibindo os grupos no front-end
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

  // Função que recebe as letras digitadas nos inputs primeiro a sexto grupo
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

  // Função que recebe os valores digitados pelo usuário no input excluirJogos
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

  //Função correlaciona as letras recebidas nos inputs a resultadoGrupos
  function obterGruposCorrelacionados() {
    const gruposInput = obterGruposPeloInput();
    const correlacao = {};

    gruposInput.forEach((letra, indice) => {
      const indiceGrupo = letra.charCodeAt(0) - "A".charCodeAt(0);

      let nomeGrupo = letra;

      // Verifique se a chave já existe no objeto
      while (correlacao[nomeGrupo]) {
        // Se existir, adicione um sufixo incremental ao nome para permitir duplicidades
        const numeroSufixo = parseInt(nomeGrupo.slice(1)) || 1;
        nomeGrupo = letra + (numeroSufixo + 1);
      }

      // Crie uma cópia do grupo correspondente e atribua ao nome atualizado
      correlacao[nomeGrupo] = resultadoGrupos[indiceGrupo].slice();
    });

    return correlacao;
  }

  // Essa função irá pegar o return da função obterGruposCorrelacionados e excluir os números que o usuário irá digitar no input excluirJogos
  function excluirNumerosCorrelacionados(correlacao, numerosExcluir) {
    const gruposExcluidos = { ...correlacao }; // Cria uma cópia dos grupos correlacionados

    for (const letra in gruposExcluidos) {
      gruposExcluidos[letra] = gruposExcluidos[letra].filter(
        (numero) => !numerosExcluir.includes(parseInt(numero, 10))
      );
    }

    return gruposExcluidos;
  }

  // Realiza o calculo de protudo cartesiano
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
  // função para manter apenas jogos únicos. Ex. grupo 1, 2, 3 e 1, 3, 2, são considerados grupos diferentes em produto cartesiano, o código ordena os jogos e depois mantém apenas um jogo.
  function removerJogosDuplicados(jogos) {
    const jogosUnicos = [];
    const jogosVistos = new Set();

    for (const jogo of jogos) {
      // Ordena os números do jogo para garantir consistência
      const jogoOrdenado = [...jogo].sort().join(",");

      if (!jogosVistos.has(jogoOrdenado)) {
        jogosVistos.add(jogoOrdenado);
        jogosUnicos.push(jogo);
      }
    }
    return jogosUnicos;
  }

  // function exibirNumerosNaTabela(numeros) {
  //   // Selecione o elemento com o ID "resultado"
  //   const resultadoElemento = document.getElementById("resultado");

  //   // Crie uma lista não ordenada (ul)
  //   const lista = document.createElement("ul");

  //   // Adicione jogos à lista
  //   Object.keys(numeros).forEach((coluna, index) => {
  //     const jogo = numeros[coluna].join("\t");
  //     const itemLista = document.createElement("li");
  //     itemLista.textContent = `Jogo ${index + 1}: ${jogo}`;
  //     lista.appendChild(itemLista);
  //   });

  //   // Limpe o conteúdo atual do elemento "resultado"
  //   resultadoElemento.innerHTML = "";

  //   // Adicione a lista ao elemento "resultado"
  //   resultadoElemento.appendChild(lista);
  // }

  // Exibe o resultado proximosJogosMegaSena em uma nova guia.
  function exibirNumerosNaNovaGuia(numeros) {
    const lista = Object.keys(numeros).map((coluna, index) => {
      const jogo = numeros[coluna].join("\t");
      return `Jogo ${index + 1}: ${jogo}`;
    });

    // Criar uma nova guia
    const novaGuia = window.open("");

    // Adicionar conteúdo à nova guia
    novaGuia.document.write(
      "<html><head><title>Resultados da Mega Sena</title></head><body><ul>"
    );
    lista.forEach((item) => {
      novaGuia.document.write(`<li>${item}</li>`);
    });
    novaGuia.document.write("</ul></body></html>");
    novaGuia.document.close();
  }

  // Possibilitar impressão do resultado em um arquivo xlsx, ainda em implementação
  // function downloadExcel(data) {
  //   const ws = XLSX.utils.json_to_sheet(data);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  //   // Gere um blob (Binary Large Object) a partir do arquivo Excel
  //   const blob = XLSX.write(wb, { bookType: "xlsx", type: "blob" });

  //   // Crie um URL temporário e configure o link de download
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "resultados.xlsx";

  //   // Adicione o link ao corpo da página e clique nele
  //   document.body.appendChild(a);
  //   a.click();

  //   // Remova o link da página
  //   document.body.removeChild(a);

  //   // Limpe o URL temporário
  //   window.URL.revokeObjectURL(url);
  // }

  // função assincrona para execução das outras funções
  async function execute() {
    await frequenciaNumeros();
    exibirGrupos();

    //Botão para enviar os dados do HTML para o JS e executar todas as operações
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
      const gruposValidosParaProcessar = produtoCartesiano(...gruposValidos);

      // Remover jogos duplicados
      const proximosJogosMegaSena = removerJogosDuplicados(
        gruposValidosParaProcessar
      );

      // Imprime o resultado
      console.log("Proximos Jogos Mega Sena:", proximosJogosMegaSena);
      // exibirNumerosNaTabela(proximosJogosMegaSena);
      exibirNumerosNaNovaGuia(proximosJogosMegaSena);

      // const dadosParaDownload = proximosJogosMegaSena.map((comb) => ({
      //   Jogo: comb.join("\t"), // Separa os números por tabulação
      // }));
      // downloadExcel(dadosParaDownload);
    });
  }
  execute();
});

(2622)[(10, 15, 20, 35, 37, 59)];
(2623)[(5, 31, 37, 47, 52, 58)];
(2624)[(9, 10, 35, 44, 55, 58)];
(2625)[(1, 9, 13, 16, 52, 59)];
(2626)[(13, 25, 31, 43, 57, 58)];
(2627)[(5, 14, 32, 40, 53, 54)];
(2628)[(11, 32, 35, 40, 41, 48)];
(2629)[(14, 18, 22, 26, 31, 38)];
(2630)[(14, 26, 36, 39, 50, 53)];
(2631)[(5, 10, 27, 38, 56, 57)];
(2632)[(2, 23, 25, 33, 45, 54)];
(2633)[(8, 27, 28, 32, 48, 56)];
(2634)[(6, 11, 29, 37, 56, 58)];
(2635)[(5, 16, 38, 42, 43, 48)];
(2636)[(1, 2, 10, 32, 34, 59)];
(2637)[(9, 30, 34, 44, 54, 55)];
(2638)[(2, 8, 11, 22, 48, 49)];
(2639)[(4, 8, 10, 27, 28, 32)];
(2640)[(9, 24, 34, 39, 45, 50)];
(2641)[(8, 13, 31, 33, 49, 50)];
(2642)[(2, 10, 29, 31, 56, 59)];
(2643)[(4, 17, 22, 28, 30, 49)];
(2644)[(8, 22, 34, 42, 51, 59)];
(2645)[(18, 28, 30, 39, 41, 58)];
(2646)[(9, 33, 39, 43, 50, 54)];
(2647)[(20, 44, 45, 46, 56, 59)];
(2648)[(6, 11, 26, 32, 46, 56)];
(2649)[(9, 18, 29, 37, 39, 58)];
(2650)[(6, 23, 35, 36, 37, 59)];
(2651)[(13, 23, 26, 29, 45, 59)];
(2652)[(14, 32, 41, 43, 48, 60)];
(2653)[(11, 17, 23, 36, 47, 51)];
(2654)[(10, 23, 30, 31, 49, 56)];
(2655)[(20, 24, 27, 46, 57, 58)];
(2656)[(7, 27, 32, 33, 36, 53)];
(2657)[(5, 13, 39, 51, 58, 60)];
(2658)[(11, 36, 46, 53, 55, 60)];
(2659)[(6, 12, 13, 20, 38, 60)];
(2660)[(6, 30, 35, 38, 41, 56)];
(2661)[(17, 20, 31, 34, 40, 42)];
(2662)[(7, 11, 27, 41, 56, 59)];
(2663)[(12, 15, 17, 30, 40, 52)];
(2664)[(3, 14, 21, 22, 37, 39)];
(2665)[(5, 25, 29, 30, 43, 47)];
(2666)[(1, 4, 8, 21, 46, 51)];
(2667)[(1, 27, 30, 41, 46, 57)];
(2668)[(4, 7, 16, 35, 46, 54)];

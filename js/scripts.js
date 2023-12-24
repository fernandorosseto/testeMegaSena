//-----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=0&single=true&output=csv";

  // Criar um objeto para armazenar as arrays com base no tamanho
  let arraysAgrupadasPorTamanho = {};
  let numerosFiltradosAtraso = {};

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
          grupoNumero.textContent = `Grupo ${tamanho},`;
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
    return arraysAgrupadasPorTamanho;
  }

  //----------------------------------------------------------------------------------------------------------
  // Pegar os dados das frequências de cada número disponíveis numa planilha do google sheets.
  const urlPagina2 =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=1007340004&single=true&output=csv";

  //página4 para testes
  //gid pag2 1007340004
  //gid pag4 4064556
  let pagina2Data;
  let resultadoNumerico;

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

    const resultadoGrupos = distribuirDezenas(pagina2Data);
    resultadoNumerico = resultadoGrupos.map((grupo) =>
      grupo.map((elemento) => Number(elemento))
    );
    console.log(resultadoNumerico);
  }

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
    resultadoNumerico.forEach((grupo, indice) => {
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
  function obterNumerosGrupoAtraso() {
    const numerosGrupoAtraso = document.getElementById("inputGrupoAtraso");

    // Verifica se o elemento existe antes de acessar a propriedade value
    if (numerosGrupoAtraso) {
      const numerosGrupoAtrasoTexto = numerosGrupoAtraso.value;

      // Verifica se a string não está vazia antes de dividir
      if (numerosGrupoAtrasoTexto.trim() !== "") {
        // Divida a entrada do usuário em uma matriz de números
        const numerosGrupoAtrasoArray = numerosGrupoAtrasoTexto
          .split(",")
          .map((numero) => parseInt(numero.trim(), 10))
          .filter((numero) => !isNaN(numero));

        return numerosGrupoAtrasoArray;
      }
    }

    // Se o elemento não existe ou a string está vazia, retorna uma matriz vazia
    return [];
  }

  function obterGruposAtrasoCorrelacionados() {
    const gruposInputAtraso = obterNumerosGrupoAtraso();
    const correlacaoGrupoAtraso = {};

    gruposInputAtraso.forEach((indice) => {
      const indiceGrupo = indice;

      let nomeGrupo = `Grupo Atraso ${indice}`;

      // Verifique se a chave já existe no objeto
      while (correlacaoGrupoAtraso[nomeGrupo]) {
        // Se existir, adicione um sufixo incremental ao nome para permitir duplicidades
        const numeroSufixo = parseInt(nomeGrupo.slice(13)) || 1;
        nomeGrupo = `Grupo Atraso ${numeroSufixo + 1}`;
      }

      // Crie uma cópia do grupo correspondente e atribua ao nome atualizado
      correlacaoGrupoAtraso[nomeGrupo] = arraysAgrupadasPorTamanho[indiceGrupo];
    });

    return correlacaoGrupoAtraso;
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
      correlacao[nomeGrupo] = resultadoNumerico[indiceGrupo].slice();
    });

    return correlacao;
  }

  // function filtrarElementosComuns(objeto1, objeto2) {
  //   const objetoComum = {};

  //   // Extrair todos os elementos de objeto1 para um array
  //   const elementosObjeto1 = Object.values(objeto1).reduce(
  //     (acc, subarrays) =>
  //       acc.concat(
  //         subarrays.reduce(
  //           (innerAcc, numero) => innerAcc.concat(numero.map(String)),
  //           []
  //         )
  //       ),
  //     []
  //   );

  //   for (const chave2 in objeto2) {
  //     if (objeto2.hasOwnProperty(chave2)) {
  //       objetoComum[chave2] = objeto2[chave2].filter((valor2) =>
  //         elementosObjeto1.some(
  //           (elemento1) => Number(elemento1) === Number(valor2)
  //         )
  //       );
  //     }
  //   }

  //   // Filtrar chaves com arrays não vazias
  //   let objetoComumFiltrado = Object.fromEntries(
  //     Object.entries(objetoComum).filter(
  //       ([chave, valores]) => valores.length > 0
  //     )
  //   );

  //   // Verificar se há menos de 6 chaves e exibir um alerta de erro
  //   if (Object.keys(objetoComumFiltrado).length < 6) {
  //     alert("Erro: Menos de 6 chaves encontradas em objetoComumFiltrado.");
  //   }

  //   return objetoComumFiltrado;
  // }

  // Essa função irá pegar o return da função obterGruposCorrelacionados e excluir os números que o usuário irá digitar no input excluirJogos
  function excluirNumerosCorrelacionados(
    numerosExcluir,
    numerosFiltradosAtraso
  ) {
    const gruposExcluidos = { ...numerosFiltradosAtraso }; // Cria uma cópia dos grupos correlacionados

    for (const letra in gruposExcluidos) {
      gruposExcluidos[letra] = gruposExcluidos[letra].map((numeros) =>
        numeros.filter(
          (numero) => !numerosExcluir.includes(parseInt(numero, 10))
        )
      );
    }

    return gruposExcluidos;
  }

  // // Realiza o calculo de protudo cartesiano
  // function produtoCartesiano(...conjuntos) {
  //   return conjuntos.reduce(
  //     (acumulador, conjuntoAtual) => {
  //       const novoAcumulador = [];
  //       acumulador.forEach((elementoAcumulado) => {
  //         // Verifica se conjuntoAtual é um array antes de chamar forEach
  //         if (Array.isArray(conjuntoAtual)) {
  //           conjuntoAtual.forEach((elementoConjuntoAtual) => {
  //             const novaCombinação = [
  //               ...elementoAcumulado,
  //               elementoConjuntoAtual,
  //             ];
  //             // Verifica se há números iguais na nova combinação
  //             if (!temNumerosIguais(novaCombinação)) {
  //               novoAcumulador.push(novaCombinação);
  //             }
  //           });
  //         }
  //       });
  //       return novoAcumulador;
  //     },
  //     [[]]
  //   );
  //   if (todasAsCombinações.length < 6) {
  //     alert(
  //       "Não há números suficientes para formar pelo menos um jogo com 6 dezenas."
  //     );
  //   }

  //   return todasAsCombinações;
  // }

  // // Função para verificar se há números iguais em uma array
  // function temNumerosIguais(array) {
  //   const conjuntoUnico = new Set(array);
  //   return array.length !== conjuntoUnico.size;
  // }

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
    const arraysAgrupadasPorTamanho = await planilhaDb();
    // Imprimir o objeto resultante
    //console.log("array organizada por tamanho", arraysAgrupadasPorTamanho);
    exibirGrupos();

    //Botão para enviar os dados do HTML para o JS e executar todas as operações
    const btnEnviar = document.getElementById("btnEnviar");
    btnEnviar.addEventListener("click", function () {
      const gruposCorrelacionados = obterGruposCorrelacionados();
      //console.log("gruposCorrelacionads", gruposCorrelacionados);
      const grupoAtraso = obterNumerosGrupoAtraso();
      //console.log("grupoAtraso", grupoAtraso);
      const grupoAtrasoCorrelacionado = obterGruposAtrasoCorrelacionados();
      //console.log("grupo atraso correlacionado", grupoAtrasoCorrelacionado);

      //Números para excluir
      const numerosExcluir = obterNumerosExcluir();

      const meuObjetoAtraso = grupoAtrasoCorrelacionado;
      console.log("meuObjetoAtraso", meuObjetoAtraso);
      const meuObjetoFrequencia = gruposCorrelacionados;
      console.log("meuObjetoFrequencia", meuObjetoFrequencia);

      const gruposFrequencia = Object.keys(meuObjetoFrequencia);

      function filtrarNumerosPorGruposAtraso(atraso, gruposFrequencia) {
        const numerosFiltrados = {};

        for (const grupoAtraso in atraso) {
          const numerosGrupoAtraso = atraso[grupoAtraso].flat();
          const numerosFiltradosGrupo = [];

          for (const grupoFrequencia of gruposFrequencia) {
            const numerosGrupoFrequencia = meuObjetoFrequencia[grupoFrequencia];
            const numerosComuns = numerosGrupoAtraso.filter((numero) =>
              numerosGrupoFrequencia.includes(numero)
            );

            numerosFiltradosGrupo.push(numerosComuns);
          }

          numerosFiltrados[grupoAtraso] = numerosFiltradosGrupo;
        }

        return numerosFiltrados;
      }

      numerosFiltradosAtraso = filtrarNumerosPorGruposAtraso(
        meuObjetoAtraso,
        gruposFrequencia
      );
      console.log("numerosFiltradosAtraso", numerosFiltradosAtraso);

      function gerarCombinacoes(numerosFiltradosAtraso) {
        const resultado = [];
        const indices = Object.keys(numerosFiltradosAtraso);

        function numeroJaEstaNaCombinacao(numero, combinacaoAtual) {
          return combinacaoAtual.includes(numero);
        }

        function gerarCombinacaoRecursiva(indiceAtual, combinacaoAtual) {
          if (combinacaoAtual.length === 6) {
            resultado.push(combinacaoAtual.slice());
            return;
          }

          if (indiceAtual === indices.length) {
            return;
          }

          const grupoAtual = numerosFiltradosAtraso[indices[indiceAtual]] || [];
          for (let i = 0; i < grupoAtual.length; i++) {
            const elementoAtual = grupoAtual[i];

            if (Array.isArray(elementoAtual)) {
              for (const numero of elementoAtual) {
                if (!numeroJaEstaNaCombinacao(numero, combinacaoAtual)) {
                  combinacaoAtual.push(numero);
                  gerarCombinacaoRecursiva(indiceAtual + 1, combinacaoAtual);
                  combinacaoAtual.pop();
                }
              }
            } else if (elementoAtual !== undefined) {
              if (!numeroJaEstaNaCombinacao(elementoAtual, combinacaoAtual)) {
                combinacaoAtual.push(elementoAtual);
                gerarCombinacaoRecursiva(indiceAtual + 1, combinacaoAtual);
                combinacaoAtual.pop();
              }
            }
          }
        }

        gerarCombinacaoRecursiva(0, []);

        return resultado;
      }

      const gruposParaProcessamento = excluirNumerosCorrelacionados(
        numerosExcluir,
        numerosFiltradosAtraso
      );

      console.log("gruposParaProcessamento", gruposParaProcessamento);

      const combinacoes = gerarCombinacoes(gruposParaProcessamento);
      console.log(combinacoes);

      // const resultadoFiltrado = filtrarElementosComuns(
      //   meuObjetoFrequencia,
      //   meuObjetoAtraso
      // );
      // console.log(
      //   "resultado filtro entre grupo Frequencia e Atraso",
      //   resultadoFiltrado
      // );

      // //console.log("grupo para Processamento", gruposParaProcessamento);
      // // Extrai os arrays dos valores do objeto
      // const arraysGruposParaProcessamento = Object.values(
      //   gruposParaProcessamento
      // );

      // // Filtra apenas os arrays válidos
      // const gruposValidos = arraysGruposParaProcessamento.filter(Array.isArray);
      // console.log("grupos válidos", gruposValidos);

      // //Chama a função produtoCartesiano
      // const gruposValidosParaProcessar = produtoCartesiano(...gruposValidos);

      // Remover jogos duplicados
      const proximosJogosMegaSena = removerJogosDuplicados(combinacoes);

      function atendeRequisitos(jogo, meuObjetoFrequencia) {
        const numerosPorGrupo = {};

        // Inicializa a contagem de números por grupo
        Object.keys(meuObjetoFrequencia).forEach((grupo) => {
          numerosPorGrupo[grupo] = 0;
        });

        // Conta quantos números do grupo cada jogo contém
        jogo.forEach((numero) => {
          Object.keys(meuObjetoFrequencia).forEach((grupo) => {
            if (
              (grupo === "A" || grupo === "A2") &&
              meuObjetoFrequencia[grupo].includes(numero)
            ) {
              if (numerosPorGrupo[grupo] < 1) {
                numerosPorGrupo[grupo]++;
              }
            } else if (meuObjetoFrequencia[grupo].includes(numero)) {
              numerosPorGrupo[grupo]++;
            }
          });
        });

        // Verifica se cada grupo tem exatamente um número
        const atendeRequisitos = Object.values(numerosPorGrupo).every(
          (count) => count === 1
        );

        // Adiciona mensagens de log
        console.log("Jogo:", jogo);
        console.log("Contagem por grupo:", numerosPorGrupo);
        console.log("Atende requisitos:", atendeRequisitos);

        return atendeRequisitos;
      }

      // function atendeRequisitos(jogo, meuObjetoFrequencia) {
      //   const numerosPorGrupo = {};

      //   // Inicializa a contagem de números por grupo
      //   Object.keys(meuObjetoFrequencia).forEach((grupo) => {
      //     numerosPorGrupo[grupo] = 0;
      //   });

      //   // Conta quantos números do grupo cada jogo contém
      //   jogo.forEach((numero) => {
      //     Object.keys(meuObjetoFrequencia).forEach((grupo) => {
      //       if (meuObjetoFrequencia[grupo].includes(numero)) {
      //         numerosPorGrupo[grupo]++;
      //       }
      //     });
      //   });

      //   // Verifica se cada grupo tem pelo menos um número
      //   const atendeRequisitos = Object.values(numerosPorGrupo).every(
      //     (count) => count >= 1
      //   );

      //   // Adiciona mensagens de log
      //   console.log("Jogo:", jogo);
      //   console.log("Contagem por grupo:", numerosPorGrupo);
      //   console.log("Atende requisitos:", atendeRequisitos);

      //   return atendeRequisitos;
      // }

      // Filtra os jogos que atendem aos requisitos
      const jogosValidos = proximosJogosMegaSena.filter((jogo) =>
        atendeRequisitos(jogo, meuObjetoFrequencia)
      );

      // Imprime o resultado
      //console.log("Proximos Jogos Mega Sena:", proximosJogosMegaSena);
      exibirNumerosNaNovaGuia(jogosValidos);

      // const dadosParaDownload = proximosJogosMegaSena.map((comb) => ({
      //   Jogo: comb.join("\t"), // Separa os números por tabulação
      // }));
      // downloadExcel(dadosParaDownload);
    });
  }
  execute();
});

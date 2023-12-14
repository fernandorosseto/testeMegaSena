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
}
frequenciaNumeros();

function produtoCartesiano(...conjuntos) {
  return conjuntos.reduce(
    (acumulador, conjuntoAtual) => {
      const novoAcumulador = [];
      acumulador.forEach((elementoAcumulado) => {
        conjuntoAtual.forEach((elementoConjuntoAtual) => {
          const novaCombinação = [...elementoAcumulado, elementoConjuntoAtual];
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
function produtoCartesianoLimite(limite, ...conjuntos) {
  const resultado = conjuntos.reduce(
    (acumulador, conjuntoAtual) => {
      const novoAcumulador = [];
      acumulador.forEach((elementoAcumulado) => {
        conjuntoAtual.forEach((elementoConjuntoAtual) => {
          const novaCombinação = [...elementoAcumulado, elementoConjuntoAtual];
          if (!temDoisNumerosIguais(novaCombinação)) {
            novoAcumulador.push(novaCombinação);
          }
        });
      });
      return novoAcumulador;
    },
    [[]]
  );

  return resultado.slice(0, limite);
}

// Função para verificar se há pelo menos dois números iguais em uma array
function temDoisNumerosIguais(array) {
  const conjuntoUnico = new Set(array);
  return array.length !== conjuntoUnico.size;
}

function obterNumerosFiltrar() {
  const numerosFiltrarInput = document.getElementById("numerosFiltrar");
  const numerosFiltrarTexto = numerosFiltrarInput.value;

  // Divida a entrada do usuário em uma matriz de números
  const numerosFiltrarArray = numerosFiltrarTexto.split(",").map(Number);

  return numerosFiltrarArray;
}

function filtrarResultadoComNumerosEspecificos(resultado, numerosFiltrar) {
  const resultadoFiltrado = resultado.filter((grupo) => {
    // Verifica se pelo menos um número do grupo está na lista de números a filtrar
    return grupo.some((numero) => numerosFiltrar.includes(numero));
  });

  return resultadoFiltrado;
}

function obterLetraDoIndice(indice) {
  return String.fromCharCode("A".charCodeAt(0) + indice);
}

async function execute() {
  await frequenciaNumeros();
  console.log("inicio função execute");
  function exibirGrupos() {
    const divGrupoFrequencia = document.getElementById("grupoFrequencia");
    divGrupoFrequencia.innerHTML = "";

    grupos.forEach((grupo, indice) => {
      const divGrupo = document.createElement("div");
      divGrupo.textContent = `Grupo ${obterLetraDoIndice(indice)}: ${grupo.join(
        ", "
      )}`;
      divGrupo.classList.add("grupo");
      document.getElementById("grupoFrequencia").appendChild(divGrupo);
    });
  }

  exibirGrupos();

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

  function calcularProdutoCartesiano() {
    const gruposSelecionados = obterGruposPeloInput();

    // Obter números específicos do campo de entrada
    const numerosEspecificosInput =
      document.getElementById("numerosEspecificos");
    const numerosEspecificos = numerosEspecificosInput.value
      .split(",")
      .map((numero) => parseInt(numero.trim(), 10))
      .filter((numero) => !isNaN(numero));

    // Mapeia as letras dos grupos para os arrays correspondentes
    const arraysSelecionados = gruposSelecionados.map(
      (letra) => grupos[letra.charCodeAt(0) - "A".charCodeAt(0)]
    );

    // Chama a função produtoCartesiano com os arrays correspondentes aos grupos
    const resultado = produtoCartesiano(...arraysSelecionados);

    // Exclui arrays com números específicos
    const resultadoFiltrado = excluirArraysComNumerosEspecificos(
      resultado,
      numerosEspecificos
    );

    // Exibe o resultado na div com o id "resultado"
    const divResultado = document.getElementById("resultado");
    divResultado.textContent = `Resultado: ${resultadoFiltrado.join(", ")}`;
  }

  const btnEnviar = document.getElementById("btnEnviar");
  btnEnviar.addEventListener("click", calcularProdutoCartesiano);
  console.log(btnEnviar);

  function exibirResultado(resultado) {
    const divResultado = document.getElementById("resultado");
    divResultado.innerHTML = "";

    const resultadoContainer = document.createElement("div");
    resultadoContainer.id = "resultadoContainer";
    divResultado.appendChild(resultadoContainer);

    resultado.forEach((grupo, indice) => {
      const divGrupo = document.createElement("div");
      divGrupo.id = "futurosjogosMegaSena";
      divGrupo.classList.add("resultadoGrupo");

      const letraGrupo = obterLetraDoIndice(indice);
      const spanLetra = document.createElement("span");
      spanLetra.textContent = `jogo ${indice + 1}: `;
      divGrupo.appendChild(spanLetra);

      grupo.forEach((numero, numeroIndex) => {
        const spanNumero = document.createElement("span");
        spanNumero.textContent = numero;
        if (numeroIndex !== grupo.length - 1) {
          const spanSeparador = document.createElement("span");
          spanSeparador.textContent = ", ";
          divGrupo.appendChild(spanNumero);
          divGrupo.appendChild(spanSeparador);
        } else {
          divGrupo.appendChild(spanNumero);
        }
      });

      resultadoContainer.appendChild(divGrupo);
    });
  }

  const numerosFiltrar = obterNumerosFiltrar();
  const resultadoFiltrado = filtrarResultadoComNumerosEspecificos(
    resultado,
    numerosFiltrar
  );

  // Exibe o resultado filtrado
  console.log(resultadoFiltrado);
}

execute();

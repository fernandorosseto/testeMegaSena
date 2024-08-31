import { grupoFrequencia } from "./grupoFrequencia.js";
import { grupoAtraso } from "./grupoAtraso.js";
import { gruposColunas } from "./grupoColuna.js";

async function exibirGruposAtraso() {
  const grupoAtrasoIndex = grupoAtraso;
  //console.log("Grupo Atraso", grupoAtrasoIndex);

  const $divGrupoAtraso = document.getElementById("grupoAtraso");
  $divGrupoAtraso.innerHTML = "";

  // Cria um contêiner para a grade
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("grupo-grid");

  // Adiciona os grupos ao contêiner da grade
  for (const tamanho in grupoAtrasoIndex) {
    if (grupoAtrasoIndex.hasOwnProperty(tamanho)) {
      const grupo = grupoAtrasoIndex[tamanho];

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

  // Adiciona o contêiner da grade ao elemento $divGrupoAtraso
  $divGrupoAtraso.appendChild(gridContainer);
}

//--------------------------------------------------------------------------------------------------
//Nomeando os grupos no front-end com base nos índices, A para o resultadoGrupos[0], até o J para o resultadoGrupos[9]
function obterLetraDoIndice(indice) {
  return String.fromCharCode("A".charCodeAt(0) + indice);
}

// //função para obter a frequência dos números será utilizarda na função exibir grupos
// function obterQuantidadeFrequencia(numero) {
//   const item = grupoFrequencia.find((item) => item[0] === numero);
//   return item ? item[1] : 0;
// }

// const testeFrequencia = obterQuantidadeFrequencia();
// console.log(grupoFrequencia, testeFrequencia);

// Exibindo os grupos no front-end
async function exibirGrupos() {
  const grupoFrequenciaIndex = grupoFrequencia;
  const grupoFrequenciaNumerico = grupoFrequenciaIndex.map((grupo) =>
    grupo.map((elemento) => Number(elemento))
  );
  //console.log("Grupo Frequência", grupoFrequenciaNumerico);
  const $divGrupoFrequencia = document.getElementById("grupoFrequencia");
  $divGrupoFrequencia.innerHTML = "";

  // Cria uma tabela
  const tabela = document.createElement("table");

  // Adiciona os grupos à tabela
  grupoFrequenciaNumerico.forEach((grupo, indice) => {
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

  // Adiciona a tabela ao elemento $divGrupoFrequencia
  $divGrupoFrequencia.appendChild(tabela);
}

// objeto as entradas dos inputs dos grupos, frequencia e atraso
function obterGruposPeloInput() {
  const $primeiroGrupo = document
    .getElementById("primeiroGrupo")
    .value.toUpperCase();
  const $segundoGrupo = document
    .getElementById("segundoGrupo")
    .value.toUpperCase();
  const $terceiroGrupo = document
    .getElementById("terceiroGrupo")
    .value.toUpperCase();
  const $quartoGrupo = document
    .getElementById("quartoGrupo")
    .value.toUpperCase();
  const $quintoGrupo = document
    .getElementById("quintoGrupo")
    .value.toUpperCase();
  const $sextoGrupo = document.getElementById("sextoGrupo").value.toUpperCase();

  const $inputGrupoAtrasoUm =
    document.getElementById("inputGrupoAtrasoUm").value;
  const $inputGrupoAtrasoDois = document.getElementById(
    "inputGrupoAtrasoDois"
  ).value;
  const $inputGrupoAtrasoTres = document.getElementById(
    "inputGrupoAtrasoTres"
  ).value;
  const $inputGrupoAtrasoQuatro = document.getElementById(
    "inputGrupoAtrasoQuatro"
  ).value;
  const $inputGrupoAtrasoCinco = document.getElementById(
    "inputGrupoAtrasoCinco"
  ).value;
  const $inputGrupoAtrasoSeis = document.getElementById(
    "inputGrupoAtrasoSeis"
  ).value;

  const numerosFrequencia = [
    $primeiroGrupo,
    $segundoGrupo,
    $terceiroGrupo,
    $quartoGrupo,
    $quintoGrupo,
    $sextoGrupo,
  ];

  const numerosAtraso = [
    $inputGrupoAtrasoUm,
    $inputGrupoAtrasoDois,
    $inputGrupoAtrasoTres,
    $inputGrupoAtrasoQuatro,
    $inputGrupoAtrasoCinco,
    $inputGrupoAtrasoSeis,
  ];

  return { numerosFrequencia, numerosAtraso };
}

function obterNumerosExcluir() {
  const $numerosExcluirInput = document.getElementById("excluirJogos");

  // Verifica se o elemento existe antes de acessar a propriedade value
  if ($numerosExcluirInput) {
    const numerosExcluirTexto = $numerosExcluirInput.value;

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

const $btnEnviar = document.getElementById("btnEnviar");

// Função que recebe os valores digitados pelo usuário no input excluirJogos
function incluirNumerosMegaSenaOu() {
  const $incluirNumerosOu = document.getElementById("incluirNumerosOu");

  // Verifica se o elemento existe antes de acessar a propriedade value
  if ($incluirNumerosOu) {
    const incluirNumerosOuTexto = $incluirNumerosOu.value;

    // Verifica se a string não está vazia antes de dividir
    if (incluirNumerosOuTexto.trim() !== "") {
      // Divida a entrada do usuário em uma matriz de números
      const incluirNumerosOu = incluirNumerosOuTexto
        .split(",")
        .map((numero) => parseInt(numero.trim(), 10))
        .filter((numero) => !isNaN(numero));

      console.log("Array resultante:", incluirNumerosOu);

      return incluirNumerosOu;
    }
  }

  // Se o elemento não existe ou a string está vazia, retorna uma matriz vazia
  return [];
}

function incluirNumerosMegaSenaE() {
  const $incluirNumerosE = document.getElementById("incluirNumerosE");

  // Verifica se o elemento existe antes de acessar a propriedade value
  if ($incluirNumerosE) {
    const incluirNumerosETexto = $incluirNumerosE.value;

    // Verifica se a string não está vazia antes de dividir
    if (incluirNumerosETexto.trim() !== "") {
      // Divida a entrada do usuário em uma matriz de números
      const incluirNumerosE = incluirNumerosETexto
        .split(",")
        .map((numero) => parseInt(numero.trim(), 10))
        .filter((numero) => !isNaN(numero));

      return incluirNumerosE;
    }
  }

  // Se o elemento não existe ou a string está vazia, retorna uma matriz vazia
  return [];
}
// Exibir o resultado Final no HTML em uma nova página
function exibirNumerosNaNovaGuia(numeros) {
  if (numeros === null || numeros.length === 0) {
    alert("Nenhum jogo possível");
    return; // Interromper a execução da função se 'numeros' for vazio
  }
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

//---------------------------------------------------------------------------
// Grupo Coluna

async function exibirGruposColunas() {
  const grupoColunaIndex = gruposColunas;

  const $divGrupoColuna = document.getElementById("gruposColunas");
  $divGrupoColuna.innerHTML = "";

  // Cria uma tabela
  const tabela = document.createElement("table");

  // Adiciona os grupos à tabela
  Object.keys(grupoColunaIndex).forEach((tamanho) => {
    const grupo = grupoColunaIndex[tamanho];
    const row = tabela.insertRow(-1);

    // Adiciona o número do grupo em uma célula
    const cellGrupo = row.insertCell(0);
    cellGrupo.style.overflow = "hidden";
    cellGrupo.textContent = `Grupo ${tamanho}`;

    // Adiciona cada número do grupo em células individuais
    grupo.forEach((numero) => {
      const cellNumero = row.insertCell(-1);
      cellNumero.textContent = numero;
      cellNumero.style.overflow = "hidden";
    });
  });

  // Adiciona a tabela ao elemento $divGrupoColuna
  $divGrupoColuna.appendChild(tabela);
}

// Chame a função para exibir os grupos após carregar os dados
exibirGruposColunas();

export {
  $btnEnviar,
  exibirGruposAtraso,
  exibirGrupos,
  obterGruposPeloInput,
  obterNumerosExcluir,
  incluirNumerosMegaSenaE,
  incluirNumerosMegaSenaOu,
  exibirNumerosNaNovaGuia,
};

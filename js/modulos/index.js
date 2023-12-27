import { grupoFrequencia } from "./grupoFrequencia.js";
import { grupoAtraso } from "./grupoAtraso.js";
//import { iniciarPreparacaoDados } from "./preparacaoDados.js";

//console.log(iniciarPreparacaoDados());

async function exibirGruposAtraso() {
  const grupoAtrasoIndex = await grupoAtraso;

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

  // Adiciona o contêiner da grade ao elemento $divGrupoAtraso
  $divGrupoAtraso.appendChild(gridContainer);
}

//------------------------------------------------------------
//Nomeando os grupos no front-end com base nos índices, A para o resultadoGrupos[0], até o J para o resultadoGrupos[9]
function obterLetraDoIndice(indice) {
  return String.fromCharCode("A".charCodeAt(0) + indice);
}

// //função para obter a frequência dos números será utilizarda na função exibir grupos
// // Código não utilizado
// function obterQuantidadeFrequencia(numero) {
//   const item = dadosPagina2.find((item) => item[0] === numero);
//   return item ? item[1] : 0;
// }

// Exibindo os grupos no front-end
async function exibirGrupos() {
  const grupoFrequenciaIndex = await grupoFrequencia;
  const grupoFrequenciaNumerico = grupoFrequenciaIndex.map((grupo) =>
    grupo.map((elemento) => Number(elemento))
  );
  console.log(grupoFrequenciaNumerico);
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

      //   // Adiciona evento de duplo clique para mostrar a quantidade da frequência
      //   cellNumero.addEventListener("dblclick", () => {
      //     const quantidadeFrequencia = obterQuantidadeFrequencia(numero);
      //     cellNumero.textContent = quantidadeFrequencia;

      //     // Atrasa a troca de volta ao número original em 1000 milissegundos (1 segundo)
      //     setTimeout(() => {
      //       cellNumero.textContent = numero;
      //     }, 1000);
      //   });
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

export {
  exibirGruposAtraso,
  exibirGrupos,
  obterGruposPeloInput,
  obterNumerosExcluir,
  $btnEnviar,
};

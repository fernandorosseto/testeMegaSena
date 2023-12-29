import {
  exibirGruposAtraso,
  exibirGrupos,
  $btnEnviar,
  obterGruposPeloInput,
  obterNumerosExcluir,
  incluirNumerosMegaSenaE,
  incluirNumerosMegaSenaOu,
  exibirNumerosNaNovaGuia,
} from "./modulos/index.js";
import { executarFormacaoDeJogos } from "./modulos/formaçãoDeJogos.js";
import {
  escolherNumerosMegaSenaE,
  escolherNumerosMegaSenaOu,
} from "./modulos/filtros.js";

//Exibir os grupos na tela
exibirGrupos();
exibirGruposAtraso();

let gruposInput;
let numerosExcluir;
let jogosFiltrados;
let jogosFiltradosOU;
let resultadoFinal;

//Adicionar evendo no submit para iniciar os cálculos.
$btnEnviar.addEventListener("click", function () {
  //console.log("Clique");
  gruposInput = obterGruposPeloInput();

  numerosExcluir = obterNumerosExcluir();

  jogosFiltrados = executarFormacaoDeJogos();
  console.log("jogosFiltrados", jogosFiltrados);

  const numerosEscolhidosOu = incluirNumerosMegaSenaOu();

  jogosFiltradosOU = escolherNumerosMegaSenaOu(
    numerosEscolhidosOu,
    jogosFiltrados
  );
  const novosJogosFiltrados = jogosFiltradosOU;

  const numerosEscolhidosE = incluirNumerosMegaSenaE();

  resultadoFinal = escolherNumerosMegaSenaE(
    numerosEscolhidosE,
    novosJogosFiltrados
  );

  exibirNumerosNaNovaGuia(resultadoFinal);
});

export { gruposInput, numerosExcluir, jogosFiltrados, resultadoFinal };

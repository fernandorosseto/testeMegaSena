import {
  exibirGruposAtraso,
  exibirGrupos,
  $btnEnviar,
  obterGruposPeloInput,
} from "./modulos/index.js";

//Exibir os grupos na tela
exibirGrupos();
exibirGruposAtraso();

let gruposInput;

//Adicionar evendo no submit para iniciar os cálculos.
$btnEnviar.addEventListener("click", function () {
  console.log("Clique");
  gruposInput = obterGruposPeloInput();
  console.log("grupos e numerosAtraso", gruposInput);
});

export { gruposInput };

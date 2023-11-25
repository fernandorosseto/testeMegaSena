const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=0&single=true&output=csv";

function planilhaDb() {
  const response = fetch(url)
    .then((response) => response.text())
    .then((data) => console.log(Papa.parse(data, { header: true })))
    .catch((error) => console.log(error));
}

planilhaDb();

let dezenasMegaSena;

async function buscarUltimoResultado() {
  try {
    const resposta = await fetch(
      "https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena"
    );

    if (resposta.status === 200) {
      const dados = await resposta.json();
      dezenasMegaSena = dados.listaDezenas;
      return { concurso: dados.listaDezenas };
    } else {
      console.error("Falha ao buscar resultados da Mega Sena.");
      return null;
    }
  } catch (erro) {
    console.error("Erro na solicitação:", erro);
    return null;
  }
}

async function obterUltimoResultado() {
  if (dezenasMegaSena === undefined) {
    await buscarUltimoResultado();
  }
  return dezenasMegaSena;
}

async function ultimoResultado() {
  const dezenas = await obterUltimoResultado();
  console.log("Último Resultado da Mega Sena:", dezenas);
  const enviarDados = () => {
  fetch('https://api.sheetmonkey.io/form/iB9B4iWoGiZiRCrZxFVfkq', {
    method: 'post',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify(dezenas)
  })
  }

  enviarDados();

}

ultimoResultado();



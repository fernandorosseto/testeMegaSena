// busca todos os resultados da mega sena de um arquivo google sheets
var url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=0&single=true&output=csv";

async function planilhaDb() {
  const response = await fetch(url);
  const data = await response.text();
  const planilhaData = Papa.parse(data, { header: true }).data;

  return planilhaData;
}

//-------------------------------------------------------------------------------------------------------------
// Pegar os dados das frequências de cada número disponíveis numa planilha do google sheets.
const urlPagina2 =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=1007340004&single=true&output=csv";

async function dadosPagina2() {
  const response = await fetch(urlPagina2);
  const data = await response.text();
  const pagina2Dados = Papa.parse(data, { header: false }).data;

  return pagina2Dados;
}

export { planilhaDb, dadosPagina2 };

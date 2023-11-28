
//-----------------------------------------------------------------------
const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=0&single=true&output=csv";

async function planilhaDb() {
  const response = await fetch(url);
  const data = await response.text();
  const planilhaData = Papa.parse(data, { header: true }).data;

  
 
  console.log("Planilha da Mega Sena (formatada):", planilhaData);
}

planilhaDb();

//---------------------------------------------------------------------

const urlPagina2 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=1007340004&single=true&output=csv";

async function frequenciaNumeros() {
  const response = await fetch(urlPagina2);
  const data = await response.text();
  const pagina2Data = Papa.parse(data, { header: false }).data;

  // Criar um objeto para armazenar a frequência de cada número
  const frequencia = {};
  pagina2Data.forEach((row) => {
    const numero = parseInt(row[0]); 
    const quantidade = parseInt(row[1]);
    frequencia[numero] = quantidade;
  });

  // Matriz de números ordenados pela frequência
  const numerosOrdenados = Object.keys(frequencia).sort((a, b) => frequencia[b] - frequencia[a]);

  // Divide os números em grupos mantendo números com a mesma frequência juntos
  const groups = [];
  for (let i = 0; i < 10; i++) {
    const start = i * 6;
    const end = start + 6;
    groups.push(numerosOrdenados.slice(start, end));
  }

  // Imprimir os grupos
  groups.forEach((group, index) => {
    console.log(`Grupo ${String.fromCharCode(65 + index)} = [${group.join(', ')}]`);
  });
}


frequenciaNumeros();

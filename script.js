//-----------------------------------------------------------------------
const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=0&single=true&output=csv";

async function planilhaDb() {
  const response = await fetch(url);
  const data = await response.text();
  const planilhaData = Papa.parse(data, { header: true }).data;

  //console.log("Planilha da Mega Sena (formatada):", planilhaData);
}

planilhaDb();

//---------------------------------------------------------------------

const urlPagina2 =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYOEs4QM-0kKjx1NPpj9LfAHWcNGSikmC5EKSBs9NUkZCG8usYOcz5bjelCJRhEUBtvFlSAr8nRDv5/pub?gid=1007340004&single=true&output=csv";

async function frequenciaNumeros() {
  const response = await fetch(urlPagina2);
  const data = await response.text();
  const pagina2Data = Papa.parse(data, { header: false }).data;

  // Criar um objeto para armazenar a frequência de cada número
  const frequencia = {};
  pagina2Data.forEach((row) => {
    const numero = parseInt(row[0]);
    const quantidade = parseInt(row[1]);
    if (!(quantidade in frequencia)) {
      frequencia[quantidade] = [];
    }
    frequencia[quantidade].push(numero);
    //console.log(row);
  });
  //console.log(frequencia);

  // Obter as chaves (quantidades) como uma array e ordená-las
  const quantidadesOrdenadas = Object.keys(frequencia)
    .map(Number)
    .sort((a, b) => b - a);

  // Dividir as quantidades em 10 grupos
  const grupos = Array.from({ length: 10 }, () => []);

  // Distribuir os números nos grupos
  quantidadesOrdenadas.forEach((quantidade, index) => {
    const grupoIndex = index % 10;
    grupos[grupoIndex] = grupos[grupoIndex].concat(frequencia[quantidade]);
  });

  let grupoA = grupos[0];
  let grupoB = grupos[1];
  let grupoC = grupos[2];
  let grupoD = grupos[3];
  let grupoE = grupos[4];
  let grupoF = grupos[5];
  let grupoG = grupos[6];
  let grupoH = grupos[7];
  let grupoI = grupos[8];
  let grupoJ = grupos[9];

  //imprimir os grupos no html
  function generateTable(data) {
    // Verificar se a lista de dados não está vazia
    if (data.length === 0) {
      console.error("A lista de dados está vazia.");
      return;
    }

    // Obter as chaves (nomes de coluna) do primeiro objeto
    const columns = Object.keys(data[0]);

    // Criar a tabela HTML
    const table = document.createElement("table");

    // Criar a linha de cabeçalho
    const headerRow = table.insertRow();
    columns.forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column;
      headerRow.appendChild(th);
    });

    // Preencher a tabela com os dados
    data.forEach((item) => {
      const row = table.insertRow();
      columns.forEach((column) => {
        const cell = row.insertCell();
        cell.textContent = item[column];
      });
    });

    // Adicionar a tabela ao body do documento
    document.body.appendChild(table);
  }

  // Exemplo de uso
  const dados = [grupoA, grupoB, grupoC];

  generateTable(dados);

  const CLIENT_ID =
    "412743422962-rl5vggmkbff3vv34fd54en8o27r4srai.apps.googleusercontent.com";
  const API_KEY = "AIzaSyCq_u15LkO0wB_J462gOVWuCCJJqiC1g2g";
  const DISCOVERY_DOC =
    "https://sheets.googleapis.com/$discovery/rest?version=v4";
  const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  function initializeGapiClient() {
    return new Promise((resolve) => {
      gapi.load("client", () => {
        gapi.client
          .init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          })
          .then(() => {
            resolve();
          });
      });
    });
  }
  initializeGapiClient();

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "",
    });
    gisInited = true;
  }
  gisLoaded();

  // Carregar gapi automaticamente
  gapi.load;
  gapi.load;

  //---------------------------------------------------------------------

  // let spreadsheetId = "1w6Mk0vAPOE35N91CdO8XinDkDrGAVjO-0JLkAtEn_us";
  // let range = "1495099806";
  // let valueInputOption = "RAW";
  // let _values;

  // function batchUpdateValues(spreadsheetId, range, valueInputOption, _values) {
  //   let values = [
  //     ["1"],
  //     // Additional rows ...
  //   ];
  //   values = _values;
  //   const data = [];
  //   data.push({
  //     range: range,
  //     values: values,
  //   });
  //   // Additional ranges to update.

  //   const body = {
  //     data: data,
  //     valueInputOption: valueInputOption,
  //   };
  //   try {
  //     gapi.client.sheets.spreadsheets.values
  //       .batchUpdate({
  //         spreadsheetId: spreadsheetId,
  //         resource: body,
  //       })
  //       .then((response) => {
  //         const result = response.result;
  //         console.log(`${result.totalUpdatedCells} cells updated.`);
  //         if (callback) callback(response);
  //       });
  //   } catch (err) {
  //     console.log("dados não inseridos");
  //     return;
  //   }
  // }
  // batchUpdateValues(spreadsheetId, range, valueInputOption, _values);

  async function enviarDados(grupos) {
    await initializeGapiClient();
    const spreadsheetId = "1w6Mk0vAPOE35N91CdO8XinDkDrGAVjO-0JLkAtEn_us";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;

    const requestBody = {
      requests: [
        {
          updateCells: {
            start: {
              sheetId: 0,
              rowIndex: 0,
              columnIndex: 0,
            },
            rows: grupos.map((row) => ({
              values: row.map((cell) => ({
                userEnteredValue: { stringValue: String(cell) },
              })),
            })),
            fields: "userEnteredValue",
          },
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Dados enviados com sucesso!");
      } else {
        console.error(
          "Erro ao enviar dados:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro na solicitação:", error);
    }
  }
  enviarDados(grupos);
}

frequenciaNumeros();

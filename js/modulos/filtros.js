function escolherNumerosMegaSenaOu(numeros, jogosValidos) {
  // Verifica se jogosValidos é um array válido
  if (Array.isArray(jogosValidos)) {
    if (numeros.length === 0) {
      // Se numeros estiver vazia, retorna diretamente jogosValidos
      return jogosValidos;
    }
    // Filtra os jogos válidos que contêm pelo menos um dos números fornecidos
    const jogosEscolhidos = jogosValidos.filter((jogo) => {
      // Verifica se pelo menos um dos números está presente no jogo
      const peloMenosUmNumeroPresente = numeros.some((numero) =>
        jogo.includes(numero)
      );

      // Retorna true se pelo menos um dos números está presente no jogo, caso contrário, false
      return peloMenosUmNumeroPresente;
    });

    //console.log(jogosEscolhidos);
    return jogosEscolhidos;
  } else {
    console.error("jogosValidos não é um array válido");
    return [];
  }
}

function escolherNumerosMegaSenaE(numeros, jogosValidos) {
  // Verifica se a array numeros está vazia
  if (numeros.length === 0) {
    // Se numeros estiver vazia, retorna diretamente jogosValidos
    return jogosValidos;
  }
  if (!Array.isArray(numeros)) {
    console.error("O argumento 'numeros' não é uma array.");
    return [];
  }
  // Filtra os jogos válidos que não contêm nenhum dos números fornecidos
  const jogosEscolhidos = jogosValidos.filter((jogo) => {
    // Verifica se todos os números estão presentes no jogo
    const todosNumerosPresentes = numeros.every((numero) =>
      jogo.includes(numero)
    );

    // Retorna true se todos os números estão presentes no jogo, caso contrário, false
    return todosNumerosPresentes;
  });

  return jogosEscolhidos;
}

export { escolherNumerosMegaSenaOu, escolherNumerosMegaSenaE };

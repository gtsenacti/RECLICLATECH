async function carregarPontos() {

    const resposta = await fetch(
        "http://localhost:3000/pontos"
    );

    const dados = await resposta.json();

    document.getElementById("pontos").textContent =
        dados.pontos;
}

carregarPontos();
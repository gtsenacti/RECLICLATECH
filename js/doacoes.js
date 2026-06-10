const form = document.querySelector(".form-container form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const equipamento = document.getElementById("equipamento").value;
    const cidade = document.getElementById("cidade").value;
    const descricao = document.getElementById("descricao").value;

    try {

        const resposta = await fetch(
            "http://localhost:3000/doacoes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    equipamento,
                    cidade,
                    descricao
                })
            }
        );

        const texto = await resposta.text();

        console.log(texto);

        alert(texto);

        form.reset();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao enviar doação.");

    }

});
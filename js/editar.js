const form = document.getElementById("formPerfil");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;

    try {

        const resposta = await fetch(
            "http://localhost:3000/perfil",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    telefone,
                    senha
                })
            }
        );

        const dados = await resposta.json();

        alert(dados.mensagem);

    } catch (erro) {

        console.error(erro);

        alert("Erro ao atualizar perfil.");

    }

});
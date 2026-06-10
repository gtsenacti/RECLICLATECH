const form = document.getElementById("formCadastro");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {

        alert("As senhas não coincidem.");
        return;

    }

    try {

        const resposta = await fetch(
            "http://localhost:3000/cadastro",
            {
                method: "POST",
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

        window.location.href = "../html/login.html";

    } catch (erro) {

        console.error(erro);

        alert("Erro ao cadastrar.");

    }

});
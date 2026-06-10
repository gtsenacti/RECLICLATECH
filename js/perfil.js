async function carregarPerfil() {

    try {

        const resposta = await fetch(
            "http://localhost:3000/perfil"
        );

        const usuario = await resposta.json();

        document.getElementById("nomeUsuario").textContent =
            usuario.nome;

        document.getElementById("emailUsuario").textContent =
            usuario.email;

        document.getElementById("statusUsuario").textContent =
            usuario.status;

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar perfil.");

    }

}

carregarPerfil();
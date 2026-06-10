async function listarMateriais() {

    const resposta = await fetch(
        "http://localhost:3000/doacoes"
    );

    const materiais = await resposta.json();

    const lista =
        document.getElementById("listaMateriais");

    materiais.forEach(material => {

        lista.innerHTML += `
            <div class="card">
                <h3>${material.item}</h3>
                <p>${material.descricao}</p>
            </div>
        `;
    });
}

listarMateriais();
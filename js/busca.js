function buscarPagina() {

    const busca =
        document.getElementById("campoBusca")
        .value
        .toLowerCase();

    if (
        busca.includes("doação") ||
        busca.includes("doacoes") ||
        busca.includes("doações")
    ) {

        window.location.href =
            "../html/doacoes.html";

    }

    else if (
        busca.includes("material") ||
        busca.includes("materiais")
    ) {

        window.location.href =
            "../html/materiais.html";

    }

    else if (
        busca.includes("perfil")
    ) {

        window.location.href =
            "../html/perfil.html";

    }

    else if (
        busca.includes("ponto") ||
        busca.includes("coleta")
    ) {

        window.location.href =
            "../html/pontos.html";

    }

    else if (
        busca.includes("sobre")
    ) {

        window.location.href =
            "../html/sobre.html";

    }

    else {

        alert("Nenhum resultado encontrado.");

    }

}
const campo =
    document.getElementById("campoBusca");

campo.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        buscarPagina();

    }

});
//========================================
// CONFIGURAÇÕES
//========================================

const API_KEY = "bb975dd606b7434f948ce0f4c7799b01";

const cacheCidades = {};

let marcadores = [];

//========================================
// CONTADOR
//========================================

async function carregarPontos() {

    try {

        const resposta = await fetch("http://localhost:3000/pontos");

        const dados = await resposta.json();

        document.getElementById("pontos").textContent =
            dados.pontos;

    } catch {

        document.getElementById("pontos").textContent = "--";

    }

}

carregarPontos();

//========================================
// MAPA
//========================================

const mapa = L.map("mapa").setView(
    [-19.9167, -43.9345],
    11
);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap"
    }
).addTo(mapa);

//========================================
// ÍCONE
//========================================

const iconeVerde = L.icon({

    iconUrl:
        "https://cdn-icons-png.flaticon.com/512/2909/2909769.png",

    iconSize: [35, 35]

});

//========================================
// LIMPA MARCADORES
//========================================

function limparMarcadores() {

    marcadores.forEach(m => mapa.removeLayer(m));

    marcadores = [];

}

//========================================
// BUSCA CIDADE (CACHE)
//========================================

async function localizarCidade(cidade) {

    if (cacheCidades[cidade]) {

        return cacheCidades[cidade];

    }

    const resposta = await fetch(

        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(cidade)}`,

        {
            headers: {
                Accept: "application/json"
            }
        }

    );

    const dados = await resposta.json();

    if (!dados.length) {

        return null;

    }

    const cidadeInfo = {

        lat: Number(dados[0].lat),
        lon: Number(dados[0].lon)

    };

    cacheCidades[cidade] = cidadeInfo;

    return cidadeInfo;

}

//========================================
// BUSCA PONTOS
//========================================

async function buscarCidade() {

    limparMarcadores();

    const status =
        document.getElementById("status");

    status.innerHTML =
        "Buscando pontos de coleta...";

    const cidade =
        document.getElementById("cidade")
            .value.trim() ||
        "Belo Horizonte";

    try {

        //----------------------------------
        // Localiza cidade
        //----------------------------------

        const local =
            await localizarCidade(cidade);

        if (!local) {

            status.innerHTML =
                "Cidade não encontrada.";

            return;

        }

        mapa.setView(
            [local.lat, local.lon],
            13
        );

        //----------------------------------
        // Geoapify
        //----------------------------------

        const raio = 10000;

        const url =
            `https://api.geoapify.com/v2/places?` +
            `categories=service.recycling` +
            `&filter=circle:${local.lon},${local.lat},${raio}` +
            `&limit=100` +
            `&apiKey=${API_KEY}`;

        const resposta =
            await fetch(url);

        if (!resposta.ok) {

            throw new Error("Erro Geoapify");

        }

        const dados =
            await resposta.json();

        if (
            !dados.features ||
            dados.features.length === 0
        ) {

            status.innerHTML =
                `Nenhum ponto encontrado em ${cidade}.`;

            return;

        }

        //----------------------------------
        // Marcadores
        //----------------------------------

        dados.features.forEach(local => {

            const lat =
                local.geometry.coordinates[1];

            const lon =
                local.geometry.coordinates[0];

            const nome =
                local.properties.name ||
                "Ponto de Coleta";

            const endereco =
                local.properties.formatted ||
                "Endereço não informado";

            const marker =
                L.marker(
                    [lat, lon],
                    {
                        icon: iconeVerde
                    }
                )
                    .addTo(mapa)
                    .bindPopup(

                        `
                        <strong>${nome}</strong>
                        <br>
                        ${endereco}
                        <br><br>

                        <a href="https://www.google.com/maps?q=${lat},${lon}"
                           target="_blank">

                           Como chegar

                        </a>

                        `

                    );

            marcadores.push(marker);

        });

        //----------------------------------
        // Ajusta mapa
        //----------------------------------

        if (marcadores.length > 0) {

            const grupo =
                L.featureGroup(marcadores);

            mapa.fitBounds(

                grupo.getBounds(),

                {
                    padding: [40, 40]
                }

            );

        }

        status.innerHTML =
            `${marcadores.length} ponto(s) encontrado(s) em ${cidade}.`;

    }

    catch (erro) {

        console.error(erro);

        status.innerHTML =
            "Erro ao consultar os pontos.";

        alert(
            "Não foi possível localizar os pontos de coleta."
        );

    }

}

//========================================
// ENTER
//========================================

document
    .getElementById("cidade")
    .addEventListener("keypress", e => {

        if (e.key === "Enter") {

            buscarCidade();

        }

    });

//========================================
// INICIALIZAÇÃO
//========================================

window.onload = () => {

    buscarCidade();

};
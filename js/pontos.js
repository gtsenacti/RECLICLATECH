async function carregarPontos() {

    const resposta = await fetch(
        "http://localhost:3000/pontos"
    );

    const dados = await resposta.json();

    document.getElementById("pontos").textContent =
        dados.pontos;
}

carregarPontos();

// =========================
// MAPA
// =========================

const mapa = L.map('mapa').setView(
    [-19.9167, -43.9345],
    11
);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap Contributors'
    }
).addTo(mapa);

// =========================
// ÍCONE
// =========================

const iconeVerde = L.icon({
    iconUrl:
        'https://cdn-icons-png.flaticon.com/512/2909/2909769.png',

    iconSize: [35, 35]
});

// =========================
// MARCADORES
// =========================

let marcadores = [];

// =========================
// LIMPAR MARCADORES
// =========================

function limparMarcadores() {

    marcadores.forEach(marker => {
        mapa.removeLayer(marker);
    });

    marcadores = [];
}

// =========================
// BUSCA
// =========================

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

        console.log(
            "Cidade pesquisada:",
            cidade
        );

        // =========================
        // GEOCODIFICAÇÃO
        // =========================

        const geoResp = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(cidade)}`,
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );

        const geoData =
            await geoResp.json();

        console.log(
            "Dados da cidade:",
            geoData
        );

        if (!geoData.length) {

            status.innerHTML =
                "Cidade não encontrada.";

            return;
        }

        const lat =
            parseFloat(geoData[0].lat);

        const lon =
            parseFloat(geoData[0].lon);

        const bbox =
            geoData[0].boundingbox;

        const south = bbox[0];
        const north = bbox[1];
        const west = bbox[2];
        const east = bbox[3];

        mapa.setView(
            [lat, lon],
            12
        );

        // =========================
        // OVERPASS
        // =========================

        const query = `
[out:json][timeout:30];
(
  node["amenity"="recycling"](${south},${west},${north},${east});
  way["amenity"="recycling"](${south},${west},${north},${east});
  relation["amenity"="recycling"](${south},${west},${north},${east});
);
out center;
`;

        const response =
            await fetch(
                "https://overpass.kumi.systems/api/interpreter?nocache=" +
                Date.now(),
                {
                    method: "POST",
                    body: query
                }
            );

        if (!response.ok) {

            throw new Error(
                "Erro ao consultar Overpass."
            );
        }

        const data =
            await response.json();

        console.log(
            "Resultado:",
            data
        );

        if (
            !data.elements ||
            data.elements.length === 0
        ) {

            status.innerHTML =
                `Nenhum ponto encontrado em ${cidade}.`;

            return;
        }

        data.elements.forEach(local => {

            const latitude =
                local.lat ||
                local.center?.lat;

            const longitude =
                local.lon ||
                local.center?.lon;

            if (
                !latitude ||
                !longitude
            ) {
                return;
            }

            const nome =
                local.tags?.name ||
                "Ponto de Coleta";

            const endereco =
                local.tags?.["addr:street"] ||
                "Endereço não informado";

            const marker =
                L.marker(
                    [latitude, longitude],
                    {
                        icon: iconeVerde
                    }
                )
                    .addTo(mapa)
                    .bindPopup(`
                    <strong>${nome}</strong>
                    <br>
                    ${endereco}
                    <br><br>

                    <a
                        href="https://www.google.com/maps?q=${latitude},${longitude}"
                        target="_blank"
                    >
                        Como chegar
                    </a>
                `);

            marcadores.push(marker);

        });

        if (
            marcadores.length > 0
        ) {

            const grupo =
                L.featureGroup(
                    marcadores
                );

            mapa.fitBounds(
                grupo.getBounds(),
                {
                    padding: [50, 50]
                }
            );
        }

        status.innerHTML =
            `${marcadores.length} ponto(s) encontrado(s) em ${cidade}.`;

    }
    catch (erro) {

        console.error(erro);

        status.innerHTML =
            "Erro ao consultar os dados.";

        alert(
            "Não foi possível consultar os pontos de coleta."
        );
    }
}

// =========================
// EVENTOS
// =========================

document
    .getElementById("cidade")
    .addEventListener(
        "keypress",
        function (e) {

            if (
                e.key === "Enter"
            ) {
                buscarCidade();
            }
        }
    );

// =========================
// INICIALIZAÇÃO
// =========================

window.onload = () => {
    buscarCidade();
};
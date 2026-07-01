//importações das dependências
const express = require("express");
const cors = require("cors");

//importações dos arquivos modulados
const db = require("./conexao/conectar");
const TabelaCadastroRoutes = require("./endpoints/cadastro");

//inicialização do servidor
const app = express();

//configurações do servidor
app.use(cors());
app.use(express.json());

//rota de cadastro
TabelaCadastroRoutes(app, db);

//inicialização do servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});

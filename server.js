//importações das dependências
const express = require("express");
const cors = require("cors");

require("dotenv").config();

//importações dos arquivos modulados
const db = require("./bancodados/recicla.db");
const TabelaCadastroRoutes = require("./endpoints/TabelaCadastro");
const loginRoutes = require("./endpoints/login");
const compatibilidadeRoutes = require("./endpoints/compatibilidade");

//inicialização do servidor
const app = express();

//configurações do servidor
app.use(cors());
app.use(express.json());

//rota de cadastro
TabelaCadastroRoutes(app, db);

//rota de login
loginRoutes(app, db);

//rota compatibilidade
compatibilidadeRoutes(app);

//inicialização do servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
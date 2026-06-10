const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./bancodados/recicla.db", (err) => {

    if (err) {
        console.log(err.message);
    } else {
        console.log("Banco conectado");
    }
});

module.exports = db;
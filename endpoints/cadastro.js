function TabelaCadastroRoutes(app, db) {

    //rota de listagem de cadastros
    app.get("/cadastro", (req, res) => {

        const sql = "SELECT id, nome, email, senha FROM cadastro";

        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }
            res.json(rows);
        });
    });

    //rota de criação de cadastro
    app.post("/cadastro", (req, res) => {

        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, e-mail e senha são obrigatórios"
            });
        }

        const sql = "INSERT INTO cadastro (nome, email, senha) VALUES (?, ?, ?)";

        db.run(sql, [nome, email, senha], function (err) {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }
            res.status(201).json({
                id: this.lastID,
                nome,
                email,
                senha
            });
        });
    });

    //rota de atualização de cadastro
    app.put("/cadastro/:id", (req, res) => {

        const id = Number(req.params.id);
    
        const { nome, email, senha } = req.body;
    
        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, e-mail e senha são obrigatórios"
            });
        }
    
        const sql = `
            UPDATE cadastro
            SET nome = ?, email = ?, senha = ?
            WHERE id = ?
        `;
    
        db.run(sql, [nome, email, senha, id], function (err) {
    
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }
    
            if (this.changes === 0) {
                return res.status(404).json({
                    erro: "Cadastro não encontrado"
                });
            }
    
            res.json({
                mensagem: "Cadastro atualizado com sucesso",
                idTabelaCadastro: id,
                nome,
                email,
                senha
            });
        });
    });

    //rota de exclusão de cadastro  
    app.delete("/cadastro/:id", (req, res) => {

        const id = Number(req.params.id);
    
        const sql = "DELETE FROM cadastro WHERE id = ?";
    
        db.run(sql, [id], function (err) {
    
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }
    
            if (this.changes === 0) {
                return res.status(404).json({
                    erro: "Cadastro não encontrado"
                });
            }
    
            res.json({
                mensagem: "Cadastro excluído com sucesso"
            });
        });
    });
}

//exportação das rotas de cadastro
module.exports = TabelaCadastroRoutes;
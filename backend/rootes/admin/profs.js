const express = require('express');
const connection = require('../../../backend/connection');
const router = express.Router();
require('dotenv').config();

//endpoint pour ajouter un professeur a la base de donnée 
router.post('/add', (req, res) => {
    let profs = req.body;

    // ajoute dans professeur
    var profQuery = "INSERT INTO professeur(nom, prénom, email, telephone, spécialité, classe, niveau, mot_de_pass) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    var profValues = [profs.nom, profs.prénom, profs.email, profs.telephone, profs.spécialité, profs.classe, profs.niveau, profs.mot_de_pass];

    connection.query(profQuery, profValues, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        // Si prof ajouté avec succès on ajoute l'utilisateur
        var userQuery = "INSERT INTO utilisateur(nom, role, email, mot_de_passe) VALUES (?, ?, ?, ?)";
        var userValues = [profs.nom + " " + profs.prénom, "professeur", profs.email, profs.mot_de_pass]; // role fixé a professeur oki

        connection.query(userQuery, userValues, (err2, results2) => {
            if (err2) {
                return res.status(500).json({ message: "Professeur ajouté mais erreur lors de l'ajout dans utilisateur", error: err2 });
            }

            return res.status(200).json({ message: "Professeur ajouté avec succès ✔ !!" });
        });
    });
});


//endpoint pour récupérer tous les professeurs que jai dans ma base de donnée 
router.get('/get', (req, res) => {
    var query = "select * from professeur";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.json(results);
        } else {
            return res.status(500).json({ error: err.message });
        }
    });
});
//endpoint pour supprimée
router.delete('/delete', (req, res) => {
    const id_prof = req.query.id;

    // cherchont lemail du prof 
    var selectQuery = "SELECT email FROM professeur WHERE id_prof = ?";
    connection.query(selectQuery, [id_prof], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Aucun professeur trouvé avec cet id" });
        }

        const emailProf = result[0].email;

        // supprimé dans prof avec id 
        var supProf = "DELETE FROM professeur WHERE id_prof = ?";
        connection.query(supProf, [id_prof], (err2, results2) => {
            if (err2) {
                return res.status(500).json(err2);
            }

            // supp dans utilisateur avec email
            var supUser = "DELETE FROM utilisateur WHERE email = ?";
            connection.query(supUser, [emailProf], (err3, results3) => {
                if (err3) {
                    return res.status(500).json({ message: "Professeur supprimé mais erreur lors de la suppression utilisateur", error: err3 });
                }

                return res.status(200).json({ message: "Professeur et utilisateur supprimés avec succès ✔ !!" });
            });
        });
    });
});

//endpoint pour modifier un prof dans la base de donnée 
router.put('/update', (req, res) => {
    const id_prof= req.query.id;
    const {nom,prénom,email,telephone,spécialité,classe,niveau,mot_de_pass } = req.body; 
    
    var query = "UPDATE professeur SET nom = ?,prénom = ?,email = ?,telephone = ?,spécialité = ?,classe = ?,niveau = ?,mot_de_pass = ?  WHERE id_prof = ?";
    connection.query(query, [nom,prénom,email,telephone,spécialité,classe,niveau,mot_de_pass,id_prof], (err, results) => {
        if (!err) {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Aucun classe  trouvé avec cet id" });
            }
            return res.status(200).json({ message: "Mise à jour effectuée avec succès !!" });
        } else {
            return res.status(500).json(err);
        }
    });
});





module.exports = router;
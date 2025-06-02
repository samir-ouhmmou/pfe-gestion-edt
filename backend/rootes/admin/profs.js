const express = require('express');
const connection = require('../../../backend/connection');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

//endpoint pour ajouter un professeur a la base de donnée 
router.post('/add', async(req, res) => {
    let profs = req.body;

    const hashedPassword =  await bcrypt.hash(profs.mot_de_pass, 10);
    profs.mot_de_pass = hashedPassword;
    
    var profQuery = "INSERT INTO professeur(nom, prénom, email, telephone, spécialité, niveau, mot_de_pass) VALUES (?, ?, ?, ?, ?, ?, ?)";
    var profValues = [profs.nom, profs.prénom, profs.email, profs.telephone, profs.spécialité, profs.niveau, profs.mot_de_pass];

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

    if (!id_prof) {
        return res.status(400).json({ message: "ID du professeur requis" });
    }

    // Récupération de l'email du professeur
    var selectQuery = "SELECT email FROM professeur WHERE id_prof = ?";
    connection.query(selectQuery, [id_prof], (err, result) => {
        if (err) {
            console.error("Erreur lors de la recherche du professeur:", err);
            return res.status(500).json({ message: "Erreur serveur", error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Aucun professeur trouvé avec cet ID" });
        }

        const emailProf = result[0].email;

        // Suppression du professeur
        var supProf = "DELETE FROM professeur WHERE id_prof = ?";
        connection.query(supProf, [id_prof], (err2, results2) => {
            if (err2) {
                console.error("Erreur lors de la suppression du professeur:", err2);
                return res.status(500).json({ message: "Erreur lors de la suppression du professeur", error: err2 });
            }

            // Suppression de l'utilisateur associé
            var supUser = "DELETE FROM utilisateur WHERE email = ?";
            connection.query(supUser, [emailProf], (err3, results3) => {
                if (err3) {
                    console.error("Erreur lors de la suppression de l'utilisateur:", err3);
                    return res.status(500).json({ 
                        message: "Professeur supprimé mais erreur lors de la suppression de l'utilisateur", 
                        error: err3 
                    });
                }

                return res.status(200).json({ 
                    success: true,
                    message: "Professeur et utilisateur supprimés avec succès" 
                });
            });
        });
    });
});

//endpoint pour modifier un prof dans la base de donnée 
router.put('/update', async(req, res) => {
    const id_prof = req.query.id;
    let { nom, prénom, email, telephone, spécialité, niveau, mot_de_pass } = req.body;
    //mot de passe haché ok apres le update
    const hashedPassword =  await bcrypt.hash(mot_de_pass, 10);
    mot_de_pass = hashedPassword;

    if (!id_prof) {
        return res.status(400).json({ message: "ID du professeur requis" });
    }

    // Vérification de l'existence du professeur
    var selectQuery = "SELECT email FROM professeur WHERE id_prof = ?";
    connection.query(selectQuery, [id_prof], (err, result) => {
        if (err) {
            console.error("Erreur lors de la recherche du professeur:", err);
            return res.status(500).json({ message: "Erreur serveur", error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Aucun professeur trouvé avec cet ID" });
        }

        const oldEmail = result[0].email;

        // Mise à jour du professeur
        var updateProfQuery = `UPDATE professeur SET 
            nom = ?,
            prénom = ?, 
            email = ?, 
            telephone = ?, 
            spécialité = ?, 
            niveau = ?, 
            mot_de_pass = ? 
            WHERE id_prof = ?`;
            
        const profValues = [nom, prénom, email, telephone, spécialité, niveau, mot_de_pass, id_prof];

        connection.query(updateProfQuery, profValues, (err2, results2) => {
            if (err2) {
                console.error("Erreur lors de la mise à jour du professeur:", err2);
                return res.status(500).json({ message: "Erreur lors de la mise à jour du professeur", error: err2 });
            }

            // Mise à jour de l'utilisateur associé
            var updateUserQuery = `UPDATE utilisateur SET 
                nom = ?, 
                email = ?, 
                mot_de_passe = ?
                WHERE email = ?`;

            const userValues = [`${nom} ${prénom}`, email, mot_de_pass, oldEmail];

            connection.query(updateUserQuery, userValues, (err3, results3) => {
                if (err3) {
                    console.error("Erreur lors de la mise à jour de l'utilisateur:", err3);
                    return res.status(500).json({ 
                        message: "Professeur mis à jour mais erreur lors de la mise à jour de l'utilisateur", 
                        error: err3 
                    });
                }

                return res.status(200).json({ 
                    success: true,
                    message: "Professeur et utilisateur mis à jour avec succès",
                    updatedId: id_prof
                });
            });
        });
    });
});






module.exports = router;
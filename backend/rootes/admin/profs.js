const express = require('express');
const connection = require('../../../backend/connection');
const router = express.Router();
require('dotenv').config();

//api pour ajouter un professeur a la base de donnée 
router.post('/add', (req,res) => {
    let profs = req.body;
    var query = "insert into professeur(nom,prénom,email,telephone,spécialité,classe,niveau,mot_de_pass) values(?,?,?,?,?,?,?,?)";
    connection.query(query,[profs.nom,profs.prénom,profs.email,profs.telephone,profs.spécialité,profs.classe,profs.niveau,profs.mot_de_pass],(err,results) => {
        if(!err){
            return res.status(200).json({ message : "professeur ajouté avec succes ✔ !!"});
        }
        else{
            return res.status(500).json(err);
        }
    });

});

//api pour récupérer tous les professeurs que jai dans ma base de donnée 
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

//api pour supprimer un classe dans la base de donnée 
router.delete('/delete',(req,res) => {
    const id_prof = req.query.id;
    var query = "delete from professeur where id_prof = ? ";
    connection.query(query,[id_prof],(err,results) =>{
        if (!err) {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Aucun professeur  trouvé avec cet id" });
            }
            return res.status(200).json({ message: "Mise à jour effectuée avec succès !!" });
        } else {
            return res.status(500).json(err);
        }
    });

});

//api pour modifier un prof dans la base de donnée 
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
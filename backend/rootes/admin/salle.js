const express = require('express');
const connection = require('../../../backend/connection');
const router = express.Router();
require('dotenv').config();

//api pour ajouter une salle a la base de donnée 
router.post('/add', (req,res) => {
    let salle = req.body;
    var query = "insert into salle(capacité,nom) values(?,?)";
    connection.query(query,[salle.capacité,salle.nom],(err,results) => {
        if(!err){
            return res.status(200).json({ message : "salle added succesfuly !!"});
        }
        else{
            return res.status(500).json(err);
        }
    });

});

//api pour récupérer tous les salles que jai dans ma base de donnée 
router.get('/get', (req, res) => {
    var query = "select * from salle";
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
    const id_salle = req.query.id;
    var query = "delete from salle where id_salle = ? ";
    connection.query(query,[id_salle],(err,results) =>{
        if(!err){
            return res.status(200).json({ message : "supprime avec succes !!"});
        }
        else{
            res.status(500).json(err);
        }
        // else{
        //     if (results.affectedRows === 0) {
        //         return res.status(404).json({ message: "Aucun enregistrement trouvé avec cet id" });
        //       }
        //     else{
        //         res.status(500).json(err);
        //     }
        // }
    });

});

//api pour modifier un classe dans une base de donnée 
router.put('/update', (req, res) => {
    const id_salle = req.query.id;
    const {capacité, nom }= req.body;
    var query = "UPDATE salle SET capacité = ? ,nom = ? WHERE id_salle = ?";
    connection.query(query, [ capacité, nom, id_salle], (err, results) => {
        if (!err) {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Aucun salle  trouvé avec cet id" });
            }
            return res.status(200).json({ message: "Mise à jour effectuée avec succès !!" });
        } else {
            return res.status(500).json(err);
        }
    });
});



module.exports = router;
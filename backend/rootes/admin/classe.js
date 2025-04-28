const express = require('express');
const connection = require('../../../backend/connection');
const router = express.Router();
require('dotenv').config();

//api pour ajouter un classe a la base de donnée 
router.post('/add', (req,res) => {
    let classes = req.body;
    var query = "insert into classe(nom,niveau,nbr_élèves,id_salle) values(?,?,?,?)";
    connection.query(query,[classes.nom,classes.niveau,classes.nbr_élèves,classes.id_salle],(err,results) => {
        if(!err){
            return res.status(200).json({ message : "classe added succesfuly !!"});
        }
        else{
            return res.status(500).json(err);
        }
    });

});

//api pour récupérer tous les classes que jai dans ma base de donnée 
router.get('/get', (req, res) => {
    var query = "select * from classe";
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
    const id_classe = req.query.id;
    var query = "delete from classe where id_classe = ? ";
    connection.query(query,[id_classe],(err,results) =>{
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
    const id_classe= req.query.id;
    const { nom,niveau,nbr_élèves,id_salle } = req.body; 
    
    var query = "UPDATE classe SET nom = ?, niveau = ?, nbr_élèves = ?, id_salle = ? WHERE id_classe = ?";
    connection.query(query, [nom, niveau,nbr_élèves,id_salle, id_classe], (err, results) => {
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
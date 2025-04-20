const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
require('dotenv').config();


// login api working with succes
router.post('/login', (req, res) => {
    const professeur = req.body;
    
    // nvérifier wach hadchi bhal bhal 
    if (!professeur.email || !professeur.motpass) {
        return res.status(400).json({ message: "L'email et le mot de passe sont requis" });
    }
    
    query = "select email, motpass, nom from professeur where email = ?";
    connection.query(query, [professeur.email], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        
        if (results.length <= 0) {
            return res.status(401).json({message: "Email ou mot de passe incorrect"});
        } 
        
        if (results[0].motpass === professeur.motpass) {
            const response = {email: results[0].email, nom: results[0].nom};
            const accestoken = jwt.sign(response, process.env.ACCES_TOKEN, {expiresIn: '10h'});
            return res.status(200).json({token: accestoken});

        } else {
            return res.status(401).json({message: "Email ou mot de passe incorrect"});
        }
    });
});
var transporter = nodeMailer.createTransport({
    service : 'gmail',
    auth : {
        professeur : process.env.EMAIL,
        pass : process.env.PASSWORD
    }

});

//forgot password api

router.post('/forgotpassword', (req, res) => {
     const professeur = req.body;
     query = "select email, motpass from professeur where email= ?";
     connection.query(query , [professeur.email], (err, results) => {
     //ghnkteb logic daba hna wslt

     })

})







module.exports =router;

const express = require('express');
const connection = require('../../../backend/connection');
const router = express.Router();
require('dotenv').config();
//les nombres des classes
router.get('/NbrClasses', (req, res) => {
    const query = "SELECT COUNT(*) AS nbrClasses FROM classe";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.json(results[0]);
        } else {
            return res.status(500).json({ error: err.message });
        }
    });
});
//nombres des salles
router.get('/NbrSalles', (req, res) => {
    const query = "SELECT COUNT(*) AS nbrSalles FROM salle";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.json(results[0]);
        } else {
            return res.status(500).json({ error: err.message });
        }
    });
});
//nombres des professeurs 
router.get('/NbrProfs', (req, res) => {
    const query = "SELECT COUNT(*) AS nbrProfs FROM professeur";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.json(results[0]);
        } else {
            return res.status(500).json({ error: err.message });
        }
    });
});

module.exports =router;

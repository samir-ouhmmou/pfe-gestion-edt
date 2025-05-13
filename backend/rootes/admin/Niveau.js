const express = require('express');
const connection = require('../../../backend/connection');
const router = express.Router();
require('dotenv').config();

router.get('/get', (req, res) => {
    var query = "select niveau from classe";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.json(results);
        } else {
            return res.status(500).json({ error: err.message });
        }
    });
});

module.exports = router;
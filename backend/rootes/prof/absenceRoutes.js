const express = require('express');
const router = express.Router();
const connection = require('../../connection');
const { verifyToken, isTeacher } = require('./auth');

// Déclarer une absence
router.post('/declarer', verifyToken, isTeacher, async (req, res) => {
    const { date, type } = req.body;
    const id_prof = req.user.id;

    // Validation des types d'absence
    const typesValides = ['maladie', 'formation', 'personnel', 'autre'];
    if (!typesValides.includes(type)) {
        return res.status(400).json({ 
            message: "Type d'absence invalide",
            types_acceptes: typesValides
        });
    }

    try {
        // Vérification de la date
        const today = new Date().toISOString().split('T')[0];
        if (date < today) {
            return res.status(400).json({ 
                message: "La date doit être aujourd'hui ou dans le futur" 
            });
        }

        // Insertion dans la base
        const [result] = await connection.promise().query(
            'INSERT INTO absence_reserve (date, type, id_prof) VALUES (?, ?, ?)',
            [date, type, id_prof]
        );

        // Récupération de l'absence créée
        const [rows] = await connection.promise().query(
            'SELECT * FROM absence_reserve WHERE id = ?',
            [result.insertId]
        );

        // Formatage de la réponse
        const newAbsence = {
            ...rows[0],
            status: 'confirmed',
            created_at: new Date().toISOString()
        };

        res.status(201).json(newAbsence);

    } catch (error) {
        console.error("Erreur SQL:", error.sql);
        res.status(500).json({ 
            message: "Erreur lors de la déclaration",
            detail: error.sqlMessage || error.message
        });
    }
});

// Récupérer les absences
router.get('/mes-absences', verifyToken, isTeacher, async (req, res) => {
    const id_prof = req.user.id;

    try {
        const [absences] = await connection.promise().query(
            `SELECT 
                id,
                DATE_FORMAT(date, '%Y-%m-%d') as date,
                type,
                id_prof
             FROM absence_reserve 
             WHERE id_prof = ?
             ORDER BY date DESC`,
            [id_prof]
        );

        // Ajout des champs manquants pour le frontend
        const formattedAbsences = absences.map(absence => ({
            ...absence,
            status: 'confirmed',
            created_at: absence.date + 'T00:00:00' // Approximation si created_at n'existe pas
        }));

        res.status(200).json(formattedAbsences);

    } catch (error) {
        console.error("Erreur SQL complète:", {
            message: error.message,
            sql: error.sql,
            stack: error.stack
        });
        res.status(500).json({ 
            message: "Impossible de charger les absences",
            detail: error.sqlMessage || "Erreur de connexion à la base"
        });
    }
});

// Annuler une absence
router.delete('/annuler/:id', verifyToken, isTeacher, async (req, res) => {
    const { id } = req.params;
    const id_prof = req.user.id;

    try {
        // Vérification que l'absence appartient au professeur
        const [check] = await connection.promise().query(
            'SELECT id FROM absence_reserve WHERE id = ? AND id_prof = ?',
            [id, id_prof]
        );

        if (check.length === 0) {
            return res.status(404).json({ 
                message: "Absence non trouvée ou non autorisée" 
            });
        }

        // Suppression
        await connection.promise().query(
            'DELETE FROM absence_reserve WHERE id = ?',
            [id]
        );

        res.status(200).json({ 
            message: "Absence annulée avec succès",
            id: id
        });

    } catch (error) {
        console.error("Erreur SQL:", error.sql);
        res.status(500).json({ 
            message: "Erreur lors de l'annulation",
            detail: error.sqlMessage
        });
    }
});

module.exports = router;
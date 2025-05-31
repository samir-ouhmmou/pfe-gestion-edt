const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Token manquant" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Erreur JWT:", err.message);
            return res.status(403).json({ message: "Token invalide" });
        }
        
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        next();
    });
};

const isTeacher = (req, res, next) => {
    if (req.user.role !== 'professeur') {
        return res.status(403).json({ 
            message: "Réservé aux professeurs",
            requiredRole: "professeur",
            yourRole: req.user.role
        });
    }
    next();
};

module.exports = { verifyToken, isTeacher };
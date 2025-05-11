import React, { useState } from "react";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const heures = ["08:00 - 09:00", "09:00 - 10:00", "10:15 - 11:00", "11:00 - 12:00", "13:00 - 14:00", "14:00 - 15:00", "15:15 - 16:00", "16:00 - 15:00"];

const EmploiDuTemps = () => {
    const [emploi, setEmploi] = useState(
        Array(jours.length).fill().map(() => Array(heures.length).fill(""))
    );

    const handleChange = (jourIndex, heureIndex, event) => {
        const newEmploi = [...emploi];
        newEmploi[jourIndex][heureIndex] = event.target.value;
        setEmploi(newEmploi);
    };

    const handleSave = async () => {
        const emploiData = [];

        jours.forEach((jour, jourIndex) => {
            heures.forEach((heure, heureIndex) => {
                if (emploi[jourIndex][heureIndex]) {
                    emploiData.push({
                        jour,
                        heure,
                        cours: emploi[jourIndex][heureIndex]
                    });
                }
            });
        });

        try {
            const response = await fetch("http://localhost:8888/api/emploi-du-temps", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emploiData),
            });

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
        }
    };

    return (
        <div>
            <h2>Créer l'Emploi du Temps</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Jours / Heures</th>
                        {heures.map((heure, i) => <th key={i}>{heure}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {jours.map((jour, jourIndex) => (
                        <tr key={jourIndex}>
                            <td><strong>{jour}</strong></td>
                            {heures.map((_, heureIndex) => (
                                <td key={heureIndex}>
                                    <input
                                        type="text"
                                        value={emploi[jourIndex][heureIndex]}
                                        onChange={(event) => handleChange(jourIndex, heureIndex, event)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSave} style={{ marginTop: "10px", padding: "10px", background: "blue", color: "white", border: "none", cursor: "pointer" }}>
                Enregistrer
            </button>
        </div>
    );
};

export default EmploiDuTemps;

// src/Components/Admin/AdminHome.js
import React, { useContext } from 'react';
import { useAppContext } from '../../Admin/ContextappAdmin';
import '../../AdminHome.css'; // si besoin

const AdminHome = () => {
  const { professeurs, classes, salles } = useAppContext();

  return (
    <div className="admin-home container mt-4">
      <h2 className="fw-bold mb-4">Bienvenue Admin!</h2>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center p-3 shadow">
            <img src="/image/classes.jpeg" alt="Classes" height="80" />
            <h5 className="mt-2">Classes</h5>
            <p className="fs-4 fw-bold">{classes.length}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center p-3 shadow">
            <img src="/image/salles.jpeg" alt="Salles" height="80" />
            <h5 className="mt-2">Salles</h5>
            <p className="fs-4 fw-bold">{salles.length}</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center p-3 shadow">
            <img src="/image/professeurs.jpeg" alt="Professeurs" height="80" />
            <h5 className="mt-2">Professeurs</h5>
            <p className="fs-4 fw-bold">{professeurs.length}</p>
          </div>
        </div>
      </div>

      <h4 className="fw-bold mb-3">Raccourcis de Tâches</h4>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div
            className="shortcut-card p-3 text-center shadow rounded bg-white"
            style={{ cursor: 'pointer' }}
            onClick={() => console.log("Générer automatiquement")}
          >
            <i className="bi bi-gear-fill display-5 text-primary"></i>
            <div className="mt-2 fw-bold">Générer automatiquement<br />un emploi du temps</div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div
            className="shortcut-card p-3 text-center shadow rounded bg-white"
            style={{ cursor: 'pointer' }}
            onClick={() => console.log("Générer manuellement")}
          >
            <i className="bi bi-pencil-square display-5 text-primary"></i>
            <div className="mt-2 fw-bold">Générer manuellement<br />un emploi du temps</div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div
            className="shortcut-card p-3 text-center shadow rounded bg-white"
            style={{ cursor: 'pointer' }}
            onClick={() => console.log("Voir emploi du temps")}
          >
            <i className="bi bi-eye display-5 text-primary"></i>
            <div className="mt-2 fw-bold">Voir<br />un emploi du temps</div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div
            className="shortcut-card p-3 text-center shadow rounded bg-white"
            style={{ cursor: 'pointer' }}
            onClick={() => console.log("Exporter PDF")}
          >
            <i className="bi bi-file-earmark-pdf display-5 text-primary"></i>
            <div className="mt-2 fw-bold">Exporter les emplois<br />du temps en PDF</div>
          </div>
        </div>
      </div>


      <p className="text-center text-muted mt-4">
        école privé primier NAWABIGH
      </p>
    </div>
  );
};

export default AdminHome;

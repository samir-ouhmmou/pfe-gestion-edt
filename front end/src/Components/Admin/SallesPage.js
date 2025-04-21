import React, { useState, useEffect, useRef } from 'react';
import SallesRow from './SallesRow';

function SallesPage() {
  const [salles, setSalles] = useState([]);

  const tableRef = useRef(null);
  const isClickInsideInput = useRef(false); // 👈 pour éviter fermeture immédiate

  const addSalle = () => {
    setSalles([...salles, { Id_Salle: '',  capacite: 0, isEditing: true }]);
  };

  const deleteSalle = (index) => {
    const newSalles = [...salles];
    newSalles.splice(index, 1);
    setSalles(newSalles);
  };

  const toggleEdit = (index) => {
    const newSalles = [...salles];
    newSalles.forEach((item, i) => {
      if (i !== index) item.isEditing = false;
    });
    newSalles[index].isEditing = !newSalles[index].isEditing;
    setSalles(newSalles);
  };

  const handleEdit = (index, field, value) => {
    const newSalles = [...salles];
    newSalles[index][field] = value;
    setSalles(newSalles);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(e.target) &&
        !isClickInsideInput.current
      ) {
        const newSalles = salles.map(c => ({ ...c, isEditing: false }));
        setSalles(newSalles);
      }
      isClickInsideInput.current = false; // reset après clic
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [salles]);

  return (
    <div className="bg-light p-3 m-3 rounded">
      <h2 className="text-left mb-4">Gérer Les Salles</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className="font-weight-bold">N°Salles </span>
          <span className="mx-2">...{salles.length}...</span>
        </div>
        <button
          className="btn btn-light"
          onClick={addSalle}
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '40px',
            height: '40px',
            fontSize: '24px',
            lineHeight: '24px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          +
        </button>
      </div>

      <div className="table-responsive" ref={tableRef}>
        <table className="table bg-white">
          <thead>
            <tr>
              <th>Id Sall</th>
              <th>Capacité</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {salles.map((salle, index) => (
              <SallesRow
                key={index}
                salle={salle}
                index={index}
                handleEdit={handleEdit}
                deleteSalle={deleteSalle}
                toggleEdit={toggleEdit}
                isClickInsideInput={isClickInsideInput} // 👈 on le passe ici
              />
              
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SallesPage;

import React, { useState, useEffect, useRef } from 'react';
import ClassRow from './ClassRow';

function ClassManager() {
  const [classes, setClasses] = useState([]);

  const tableRef = useRef(null);
  const isClickInsideInput = useRef(false); // 👈 pour éviter fermeture immédiate

  const addClass = () => {
    setClasses([...classes, { niveau: '', classe: '', capacite: 0, isEditing: true }]);
  };

  const deleteClass = (index) => {
    const newClasses = [...classes];
    newClasses.splice(index, 1);
    setClasses(newClasses);
  };

  const toggleEdit = (index) => {
    const newClasses = [...classes];
    newClasses.forEach((item, i) => {
      if (i !== index) item.isEditing = false;
    });
    newClasses[index].isEditing = !newClasses[index].isEditing;
    setClasses(newClasses);
  };

  const handleEdit = (index, field, value) => {
    const newClasses = [...classes];
    newClasses[index][field] = value;
    setClasses(newClasses);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(e.target) &&
        !isClickInsideInput.current
      ) {
        const newClasses = classes.map(c => ({ ...c, isEditing: false }));
        setClasses(newClasses);
      }
      isClickInsideInput.current = false; // reset après clic
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [classes]);

  return (
    <div className="bg-light p-3 m-3 rounded">
      <h2 className="text-center mb-4">Gérer Les Classes</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className="font-weight-bold">N°Classes </span>
          <span className="mx-2">...{classes.length}...</span>
        </div>
        <button
          className="btn btn-light"
          onClick={addClass}
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
              <th>Niveau</th>
              <th>Classe</th>
              <th>Capacité</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classe, index) => (
              <ClassRow
                key={index}
                classe={classe}
                index={index}
                handleEdit={handleEdit}
                deleteClass={deleteClass}
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

export default ClassManager;

import React from 'react';

function SallesRow({ salle, index, handleEdit, deleteSalle, toggleEdit }) {
  return (
    <tr>
      <td>
        {salle.isEditing ? (
          <input
            type="text"
            className="form-control"
            value={salle.Id_Salle}
            onChange={(e) => handleEdit(index, 'Id_Salle', e.target.value)}
          />
        ) : (
          salle.Id_Salle
        )}
      </td>
      <td>
        {salle.isEditing ? (
          <input
            type="number"
            className="form-control"
            value={salle.capacite}
            onChange={(e) => handleEdit(index, 'capacite', parseInt(e.target.value) || 0)}
            min="0"
            max="40"
            
          />
        ) : (
          salle.capacite
        )}
      </td>
      <td className="d-flex gap-2">
        <button 
          className={`btn ${salle.isEditing ? 'btn-success' : 'btn-light'}`} 
          onClick={() => toggleEdit(index)}
          title={salle.isEditing ? 'Enregistrer' : 'Modifier'}
          style={{
            borderRadius: '4px',
            width: '35px',
            height: '35px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label={salle.isEditing ? 'Enregistrer les modifications' : 'Modifier la salle'}
        >
          {salle.isEditing ? '✔️' : '✏️'}
        </button>

        <button 
          className="btn btn-light" 
          onClick={() => deleteSalle(index)}
          title="Supprimer"
          style={{
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            width: '35px',
            height: '35px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Supprimer la salle"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}

export default SallesRow;

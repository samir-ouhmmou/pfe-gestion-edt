import React from 'react';

function ClassRow({ classe, index, handleEdit, deleteClass, toggleEdit }) {
  return (
    <tr>
      <td>
        {classe.isEditing ? (
          <input
            type="text"
            className="form-control"
            value={classe.niveau}
            onChange={(e) => handleEdit(index, 'niveau', e.target.value)}
          />
        ) : (
          classe.niveau
        )}
      </td>
      <td>
        {classe.isEditing ? (
          <input
            type="text"
            className="form-control"
            value={classe.classe}
            onChange={(e) => handleEdit(index, 'classe', e.target.value)}
          />
        ) : (
          classe.classe
        )}
      </td>
      <td>
        {classe.isEditing ? (
          <input
          type="number"
          className="form-control"
          value={classe.capacite}
          onChange={(e) => handleEdit(index, 'capacite', parseInt(e.target.value) || 0)}
          min="0"
          max="40"
          
        />
        ) : (
          classe.capacite
        )}
      </td>
      <td className="d-flex gap-2">
        <button 
          className={`btn ${classe.isEditing ? 'btn-success' : 'btn-light'}`} 
          onClick={() => toggleEdit(index)}
          title={classe.isEditing ? 'Enregistrer' : 'Modifier'}
          style={{
            borderRadius: '4px',
            width: '35px',
            height: '35px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {classe.isEditing ? '💾' : '✏️'}
        </button>

        <button 
          className="btn btn-light" 
          onClick={() => deleteClass(index)}
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
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}

export default ClassRow;

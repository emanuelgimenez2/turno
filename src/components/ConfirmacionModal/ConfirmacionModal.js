import React from 'react';
import './ConfirmacionModal.css';

const ConfirmacionModal = ({ show, onConfirm, onClose, mensaje }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{mensaje || "¿Está seguro que desea cancelar este turno?"}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button">Confirmar</button>
          <button onClick={onClose} className="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionModal;

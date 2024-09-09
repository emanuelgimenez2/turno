import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, turno }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que quieres eliminar este turno?</p>
        <div className="turno-details">
          <p><strong>Nombre:</strong> {turno.nombreApellido}</p>
          <p><strong>Fecha:</strong> {turno.fecha.toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {turno.hora}</p>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">Cancelar</button>
          <button onClick={onConfirm} className="confirm-button">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
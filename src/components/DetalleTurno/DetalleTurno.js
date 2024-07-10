import React from "react";

const DetalleTurno = ({ turno, onClose }) => {
  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="detalle-turno">
      <h2>Detalles del Turno</h2>
      <p><strong>Nombre y Apellido:</strong> {turno.nombreApellido}</p>
      <p><strong>Descripción:</strong> {turno.descripcion}</p>
      <p><strong>Fecha:</strong> {formatDate(turno.fecha)}</p>
      <p><strong>Hora:</strong> {turno.hora}</p>
      <p><strong>Categoría:</strong> {turno.categoria}</p>
      <p><strong>Celular:</strong> {turno.telefono}</p>
      <p><strong>Completado:</strong> {turno.completado}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default DetalleTurno;

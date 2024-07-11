import React from "react";
import { User } from "lucide-react";
import './DetalleTurno.css';

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
      <div className="detalle-turno__header">
        <h2 className="detalle-turno__title">Detalles del Turno</h2>
        {turno.imagenUrl ? (
          <img
            src={turno.imagenUrl}
            alt={turno.nombreApellido}
            className="detalle-turno__imagen"
          />
        ) : (
          <User className="detalle-turno__imagen-default" />
        )}
      </div>
      <div className="detalle-turno__content">
        <p><strong>Nombre y Apellido:</strong> {turno.nombreApellido}</p>
        <p><strong>Descripción:</strong> {turno.descripcion}</p>
        <p><strong>Fecha:</strong> {formatDate(turno.fecha)}</p>
        <p><strong>Hora:</strong> {turno.hora}</p>
        <p><strong>Categoría:</strong> {turno.categoria}</p>
        <p><strong>Celular:</strong> {turno.telefono}</p>
        <p><strong>Completado:</strong> {turno.completado ? "Sí" : "No"}</p>
      </div>
      <div className="detalle-turno__footer">
        <button className="detalle-turno__button" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default DetalleTurno;
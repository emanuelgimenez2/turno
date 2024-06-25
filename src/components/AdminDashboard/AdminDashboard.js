import React, { useEffect, useState } from 'react';
import './AdminDashboard.css'; // Archivo CSS local
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AdminDashboard = () => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const turnosCollection = collection(db, 'turnos');
        const snapshot = await getDocs(turnosCollection);
      
        const turnosData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(turnosData)

        setTurnos(turnosData);
      } catch (error) {
        console.error('Error al obtener los turnos:', error);
      }
    };

    fetchTurnos();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h2>Panel de Administración</h2>
      <table className="turnos-table">
        <thead>
          <tr>
            <th>Nombre y Apellido</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Categoría</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.id} className="turno-item">
              <td>{turno.nombreApellido} </td>
              <td>{turno.descripcion}</td>
              <td>{turno.fecha}</td>
              <td>{turno.hora}</td>
              <td>{turno.categoria}</td>
              <td>{turno.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;



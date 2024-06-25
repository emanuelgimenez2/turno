// /src/components/AdminDashboard/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'turnos'));
        const turnosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTurnos(turnosList);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los turnos:', error);
        setLoading(false);
      }
    };

    fetchTurnos();
  }, []);

  const turnosPorSemana = turnos.reduce((acc, turno) => {
    const semana = new Date(turno.fecha).toLocaleDateString('es-ES', { week: 'numeric', year: 'numeric' });
    if (!acc[semana]) {
      acc[semana] = [];
    }
    acc[semana].push(turno);
    return acc;
  }, {});

  const turnosPorMes = turnos.reduce((acc, turno) => {
    const mes = new Date(turno.fecha).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    if (!acc[mes]) {
      acc[mes] = [];
    }
    acc[mes].push(turno);
    return acc;
  }, {});

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      
      <div className="turnos-por-semana">
        <h3>Turnos por Semana</h3>
        {Object.keys(turnosPorSemana).map(semana => (
          <div key={semana}>
            <h4>Semana {semana}</h4>
            <table className="turno-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                </tr>
              </thead>
              <tbody>
                {turnosPorSemana[semana].map(turno => (
                  <tr key={turno.id}>
                    <td>{turno.nombre}</td>
                    <td>{turno.apellido}</td>
                    <td>{turno.fecha}</td>
                    <td>{turno.hora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="turnos-por-mes">
        <h3>Turnos por Mes</h3>
        {Object.keys(turnosPorMes).map(mes => (
          <div key={mes}>
            <h4>{mes}</h4>
            <table className="turno-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                </tr>
              </thead>
              <tbody>
                {turnosPorMes[mes].map(turno => (
                  <tr key={turno.id}>
                    <td>{turno.nombre}</td>
                    <td>{turno.apellido}</td>
                    <td>{turno.fecha}</td>
                    <td>{turno.hora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;


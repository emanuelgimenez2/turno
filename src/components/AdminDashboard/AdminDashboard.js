import React, { useEffect, useState } from 'react';
import './AdminDashboard.css'; // Archivo CSS local
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminDashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [filterType, setFilterType] = useState('all'); // Puede ser 'all', 'month', 'week'

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const turnosCollection = collection(db, 'turnos');
        const snapshot = await getDocs(turnosCollection);

        const turnosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTurnos(turnosData);
      } catch (error) {
        console.error('Error al obtener los turnos:', error);
      }
    };

    fetchTurnos();
  }, []);

  // Función para marcar un turno como completado o no completado
  const handleCompleteToggle = async (id, completado) => {
    try {
      const turnoRef = doc(db, 'turnos', id);
      await updateDoc(turnoRef, { completado: !completado });

      const updatedTurnos = turnos.map(turno =>
        turno.id === id ? { ...turno, completado: !completado } : turno
      );
      setTurnos(updatedTurnos);
    } catch (error) {
      console.error('Error al marcar como completado:', error);
    }
  };

  // Función para filtrar y ordenar los turnos por tipo (todos, semana, mes)
  useEffect(() => {
    let filtered = [...turnos];

    if (filterType === 'month') {
      const currentDate = new Date();
      filtered = turnos.filter(turno => {
        const turnoDate = new Date(turno.fecha);
        return turnoDate.getMonth() === currentDate.getMonth() && turnoDate.getFullYear() === currentDate.getFullYear();
      });
    } else if (filterType === 'week') {
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Domingo
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
      endOfWeek.setHours(23, 59, 59, 999);

      filtered = turnos.filter(turno => {
        const turnoDate = new Date(turno.fecha);
        return turnoDate >= startOfWeek && turnoDate <= endOfWeek;
      });
    }

    // Ordenar los turnos filtrados por fecha y hora ascendente
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.fecha} ${a.hora}`);
      const dateB = new Date(`${b.fecha} ${b.hora}`);
      return dateA - dateB;
    });

    setFilteredTurnos(filtered);
  }, [filterType, turnos]);

  return (
    <div className="admin-dashboard-container">
      <h2>Panel de Administración</h2>

      {/* Filtros */}
      <div className="filters">
        <button onClick={() => setFilterType('all')}>Todos</button>
        <button onClick={() => setFilterType('month')}>Este mes</button>
        <button onClick={() => setFilterType('week')}>Esta semana</button>
      </div>

      {/* Tabla de Turnos */}
      <table className="turnos-table">
        <thead>
          <tr>
            <th>Nombre y Apellido</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Categoría</th>
            <th>Observaciones</th>
            <th>Completado</th>
          </tr>
        </thead>
        <tbody>
          {filteredTurnos.map(turno => (
            <tr key={turno.id} className={turno.completado ? 'turno-item completed' : 'turno-item'}>
              <td>{turno.nombreApellido}</td>
              <td>{turno.descripcion}</td>
              <td>{turno.fecha}</td>
              <td>{turno.hora}</td>
              <td>{turno.categoria}</td>
              <td>{turno.observaciones}</td>
              <td>
                <input
                  type="checkbox"
                  checked={turno.completado}
                  onChange={() => handleCompleteToggle(turno.id, turno.completado)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

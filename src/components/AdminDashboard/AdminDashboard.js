import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { db } from '../../firebase';
import { collection, getDocs,  } from 'firebase/firestore';

const AdminDashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [filterType, setFilterType] = useState('all');

  // Función auxiliar para asegurarnos de que trabajamos con objetos Date
  const ensureDate = (dateValue) => {
    if (dateValue instanceof Date) {
      return dateValue;
    }
    if (dateValue && dateValue.toDate && typeof dateValue.toDate === 'function') {
      return dateValue.toDate();
    }
    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      return new Date(dateValue);
    }
    console.error('Formato de fecha no reconocido:', dateValue);
    return new Date(); // Fecha por defecto si no podemos convertir
  };

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const turnosCollection = collection(db, 'turnos');
        const snapshot = await getDocs(turnosCollection);

        const turnosData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fecha: ensureDate(data.fecha)
          };
        });
        setTurnos(turnosData);
      } catch (error) {
        console.error('Error al obtener los turnos:', error);
      }
    };

    fetchTurnos();
  }, []);

  useEffect(() => {
    const filterTurnos = () => {
      const currentDate = new Date();
      let filtered = [...turnos];

      if (filterType === 'today') {
        filtered = turnos.filter(turno => {
          const turnoDate = ensureDate(turno.fecha);
          return (
            turnoDate.getDate() === currentDate.getDate() &&
            turnoDate.getMonth() === currentDate.getMonth() &&
            turnoDate.getFullYear() === currentDate.getFullYear()
          );
        });
      } else if (filterType === 'month') {
        filtered = turnos.filter(turno => {
          const turnoDate = ensureDate(turno.fecha);
          return (
            turnoDate.getMonth() === currentDate.getMonth() && 
            turnoDate.getFullYear() === currentDate.getFullYear()
          );
        });
      } else if (filterType === 'week') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        filtered = turnos.filter(turno => {
          const turnoDate = ensureDate(turno.fecha);
          return turnoDate >= startOfWeek && turnoDate <= endOfWeek;
        });
      }

      filtered.sort((a, b) => ensureDate(a.fecha) - ensureDate(b.fecha));
      setFilteredTurnos(filtered);
    };

    filterTurnos();
  }, [filterType, turnos]);

  const formatDate = (date) => {
    const dateObj = ensureDate(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Panel de Administración</h2>

      <div className="filters">
        <button onClick={() => setFilterType('all')}>Todos</button>
        <button onClick={() => setFilterType('today')}>Hoy</button>
        <button onClick={() => setFilterType('month')}>Este mes</button>
        <button onClick={() => setFilterType('week')}>Esta semana</button>
      </div>

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
              <td>{formatDate(turno.fecha)}</td>
              <td>{turno.hora}</td>
              <td>{turno.categoria}</td>
              <td>{turno.observaciones}</td>
              <td>
                <input
                  type="checkbox"
                  checked={turno.completado}
                  // onChange={() => handleCompleteToggle(turno.id, turno.completado)}
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

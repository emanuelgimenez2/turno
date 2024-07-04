import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminDashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);

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
    return new Date();
  };

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const turnosCollection = collection(db, 'turnos');
        const snapshot = await getDocs(turnosCollection);

        const turnosData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fecha: ensureDate(data.fecha),
          };
        }).sort((a, b) => ensureDate(a.fecha) - ensureDate(b.fecha));

        setTurnos(turnosData);
      } catch (error) {
        console.error('Error al obtener los turnos:', error);
      }
    };

    fetchTurnos();
  }, []);

  useEffect(() => {
    const filterTurnos = () => {
      let filtered = [...turnos];

      if (filterType === 'today') {
        const currentDate = new Date();
        filtered = turnos.filter((turno) => {
          const turnoDate = ensureDate(turno.fecha);
          return (
            turnoDate.getDate() === currentDate.getDate() &&
            turnoDate.getMonth() === currentDate.getMonth() &&
            turnoDate.getFullYear() === currentDate.getFullYear()
          );
        });
      } else if (filterType === 'month') {
        const currentDate = new Date();
        filtered = turnos.filter((turno) => {
          const turnoDate = ensureDate(turno.fecha);
          return (
            turnoDate.getMonth() === currentDate.getMonth() &&
            turnoDate.getFullYear() === currentDate.getFullYear()
          );
        });
      }

      if (selectedDate) {
        filtered = turnos.filter((turno) => {
          const turnoDate = ensureDate(turno.fecha);
          const selectedDateObj = new Date(selectedDate);
          return (
            turnoDate.getDate() === selectedDateObj.getDate() &&
            turnoDate.getMonth() === selectedDateObj.getMonth() &&
            turnoDate.getFullYear() === selectedDateObj.getFullYear()
          );
        }).sort((a, b) => a.hora.localeCompare(b.hora));
      }

      setFilteredTurnos(filtered);
    };

    filterTurnos();
  }, [filterType, selectedDate, turnos]);

  const formatDate = (date) => {
    const dateObj = ensureDate(date);
    return dateObj.toLocaleDateString();
  };

  const handleCompleteToggle = async (turnoId, newStatus) => {
    try {
      await updateDoc(doc(db, 'turnos', turnoId), {
        completado: newStatus,
      });

      const updatedTurnos = turnos.map((turno) => {
        if (turno.id === turnoId) {
          return { ...turno, completado: newStatus };
        }
        return turno;
      });
      setTurnos(updatedTurnos);
    } catch (error) {
      console.error('Error al actualizar estado de completado:', error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Panel de Administración</h2>

      <div className="filters">
        <button
          className={filterType === 'all' ? 'active' : ''}
          onClick={() => {
            setFilterType('all');
            setSelectedDate(null);
          }}
        >
          Todos
        </button>
        <button
          className={filterType === 'today' ? 'active' : ''}
          onClick={() => {
            setFilterType('today');
            setSelectedDate(null);
          }}
        >
          Hoy
        </button>
        <button
          className={filterType === 'month' ? 'active' : ''}
          onClick={() => {
            setFilterType('month');
            setSelectedDate(null);
          }}
        >
          Este mes
        </button>
      </div>

      <div className="date-picker-container">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecciona una fecha"
          className="date-picker"
          locale="es"
          
        />
      </div>

      <table className="turnos-table">
        <thead>
          <tr>
            <th>Nombre y Apellido</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Categoría</th>
            <th>Celular</th>
            <th>Completado</th>
          </tr>
        </thead>
        <tbody>
          {filteredTurnos.map((turno) => (
            <tr
              key={turno.id}
              className={`turno-item ${turno.completado === 'entramite' ? 'entramite' : ''}`}
            >
              <td>{turno.nombreApellido}</td>
              <td>{turno.descripcion}</td>
              <td>{formatDate(turno.fecha)}</td>
              <td>{turno.hora}</td>
              <td>{turno.categoria}</td>
              <td>{turno.telefono}</td>
              <td>
                <select
                  className="select"
                  value={turno.completado}
                  onChange={(e) => handleCompleteToggle(turno.id, e.target.value)}
                >
                  <option value="esperando">Esperando</option>
                  <option value="completado">Completado</option>
                  <option value="entramite">En trámite</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

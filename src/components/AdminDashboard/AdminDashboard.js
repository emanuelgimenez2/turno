import React, { useEffect, useState } from 'react';
import './AdminDashboard.css'; // Archivo CSS local
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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

  const handleCompleteToggle = async (id, completado) => {
    try {
      const turnoRef = doc(db, 'turnos', id);
      await updateDoc(turnoRef, {
        completado: !completado // Alternar el estado de completado
      });

      // Actualizar la lista localmente después de marcar como completado
      const updatedTurnos = turnos.map((turno) =>
        turno.id === id ? { ...turno, completado: !completado } : turno
      );
      setTurnos(updatedTurnos);
    } catch (error) {
      console.error('Error al marcar como completado:', error);
    }
  };

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
            <th>Completado</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
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
                  checked={turno.completado || false}
                  onChange={() => handleCompleteToggle(turno.id, turno.completado || false)}
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




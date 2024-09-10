import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../../firebase";
import "./AdminDashboard.css";
import DetalleTurno from "../DetalleTurno/DetalleTurno";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const AdminDashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [turnosPorDia, setTurnosPorDia] = useState({});
  const [fechasInvalidas, setFechasInvalidas] = useState([]);
  const [nuevaFechaInvalida, setNuevaFechaInvalida] = useState(null);
  const [razonInvalidacion, setRazonInvalidacion] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [detalleTurno, setDetalleTurno] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [turnoToDelete, setTurnoToDelete] = useState(null);

  const ensureDate = (dateValue) => {
    if (dateValue instanceof Date) {
      return new Date(dateValue.getTime() + dateValue.getTimezoneOffset() * 60000);
    }
    if (dateValue && dateValue.toDate && typeof dateValue.toDate === "function") {
      const date = dateValue.toDate();
      return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    }
    if (typeof dateValue === "string" || typeof dateValue === "number") {
      const date = new Date(dateValue);
      return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    }
    console.error("Formato de fecha no reconocido:", dateValue);
    return new Date();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const turnosCollection = collection(db, "turnos");
        const turnosSnapshot = await getDocs(turnosCollection);
        const turnosData = turnosSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              fecha: ensureDate(data.fecha),
            };
          })
          .sort((a, b) => a.fecha - b.fecha);
        setTurnos(turnosData);

        const turnosPorDiaCount = turnosData.reduce((acc, turno) => {
          const fechaKey = turno.fecha.toDateString();
          acc[fechaKey] = (acc[fechaKey] || 0) + 1;
          return acc;
        }, {});
        setTurnosPorDia(turnosPorDiaCount);

        const fechasInvalidasCollection = collection(db, "fechasInvalidas");
        const fechasInvalidasSnapshot = await getDocs(fechasInvalidasCollection);
        const fechasInvalidasData = fechasInvalidasSnapshot.docs.map((doc) => ({
          fecha: ensureDate(doc.data().fecha),
          razon: doc.data().razon,
        }));
        setFechasInvalidas(fechasInvalidasData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterTurnos = () => {
      let filtered = [...turnos];
      if (filterType === "today") {
        const currentDate = new Date();
        filtered = turnos.filter((turno) => {
          return (
            turno.fecha.getDate() === currentDate.getDate() &&
            turno.fecha.getMonth() === currentDate.getMonth() &&
            turno.fecha.getFullYear() === currentDate.getFullYear()
          );
        });
      } else if (filterType === "month") {
        const currentDate = new Date();
        filtered = turnos.filter((turno) => {
          return (
            turno.fecha.getMonth() === currentDate.getMonth() &&
            turno.fecha.getFullYear() === currentDate.getFullYear()
          );
        });
      }
      if (selectedDate) {
        filtered = turnos
          .filter((turno) => {
            return (
              turno.fecha.getDate() === selectedDate.getDate() &&
              turno.fecha.getMonth() === selectedDate.getMonth() &&
              turno.fecha.getFullYear() === selectedDate.getFullYear()
            );
          })
          .sort((a, b) => a.hora.localeCompare(b.hora));
      }
      setFilteredTurnos(filtered);
    };
    filterTurnos();
  }, [filterType, selectedDate, turnos]);

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCompleteToggle = async (turnoId, newStatus) => {
    try {
      await updateDoc(doc(db, "turnos", turnoId), {
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
      console.error("Error al actualizar estado de completado:", error);
    }
  };

  const renderDayContents = (day, date) => {
    const fechaKey = date.toDateString();
    const turnosCount = turnosPorDia[fechaKey] || 0;
    const esFechaInvalida = fechasInvalidas.some(
      (fi) => {
        const fiDate = ensureDate(fi.fecha);
        return (
          fiDate.getDate() === date.getDate() &&
          fiDate.getMonth() === date.getMonth() &&
          fiDate.getFullYear() === date.getFullYear()
        );
      }
    );

    let className = "custom-day-contents";
    if (turnosCount >= 5) {
      className += " day-full";
    } else if (turnosCount === 4) {
      className += " day-five-turnos";
    }

    return (
      <div className={className}>
        {day}
        {esFechaInvalida && <span className="day-invalid">&#128683;</span>}
      </div>
    );
  };

  const handleInvalidarFecha = async () => {
    if (nuevaFechaInvalida && razonInvalidacion) {
      try {
        const formattedDate = nuevaFechaInvalida.toISOString().split('T')[0];
        const fechaInvalidaRef = doc(collection(db, "fechasInvalidas"));
        await setDoc(fechaInvalidaRef, {
          fecha: formattedDate,
          razon: razonInvalidacion,
        });
        setFechasInvalidas([
          ...fechasInvalidas,
          { fecha: ensureDate(formattedDate), razon: razonInvalidacion },
        ]);
        setNuevaFechaInvalida(null);
        setRazonInvalidacion("");
      } catch (error) {
        console.error("Error al invalidar la fecha:", error);
      }
    }
  };

  const handleVerDetalle = (turno) => {
    setDetalleTurno(turno);
    setShowTable(false);
  };

  const handleCloseDetalle = () => {
    setDetalleTurno(null);
    setShowTable(true);
  };

  const handleEliminarTurno = (turno) => {
    setTurnoToDelete(turno);
    setModalOpen(true);
  };

  const confirmEliminarTurno = async () => {
    if (turnoToDelete) {
      try {
        await deleteDoc(doc(db, "turnos", turnoToDelete.id));
        const updatedTurnos = turnos.filter(turno => turno.id !== turnoToDelete.id);
        setTurnos(updatedTurnos);
        setFilteredTurnos(filteredTurnos.filter(turno => turno.id !== turnoToDelete.id));
        
        // Actualizar turnosPorDia
        const fechaKey = turnoToDelete.fecha.toDateString();
        setTurnosPorDia(prevTurnosPorDia => ({
          ...prevTurnosPorDia,
          [fechaKey]: (prevTurnosPorDia[fechaKey] || 1) - 1
        }));

        setModalOpen(false);
        setTurnoToDelete(null);
      } catch (error) {
        console.error("Error al eliminar el turno:", error);
      }
    }
  };
  
  return (
    <div className="admin-dashboard">
      <div className="container">
        <nav className="dashboardnavbar">
          <div className="navbar-container">
            <h1>Panel de Administración</h1>
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </nav>
      </div>

      <div className="dashboard-container">
        <div className={`filters-section ${isMenuOpen ? 'open' : ''}`}>
          <div className="filter-card">
            <h3>Filtros</h3>
            <div className="filter-buttons">
              {['all', 'today', 'month'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilterType(type);
                    setSelectedDate(null);
                  }}
                  className={`filter-button ${filterType === type ? 'active' : ''}`}
                >
                  {type === 'all' ? 'Todos' : type === 'today' ? 'Hoy' : 'Este mes'}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-card">
            <h3>Buscar turnos por fecha</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha"
              className="date-picker"
              locale="es"
              renderDayContents={renderDayContents}
            />
          </div>

          <div className="filter-card">
            <h3>Invalidar Fecha</h3>
            <DatePicker
              selected={nuevaFechaInvalida}
              onChange={(date) => setNuevaFechaInvalida(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha para invalidar"
              className="date-picker"
              locale="es"
              minDate={new Date()}
            />
            <input
              type="text"
              value={razonInvalidacion}
              onChange={(e) => setRazonInvalidacion(e.target.value)}
              placeholder="Razón de invalidación"
              className="invalidar-input"
            />
            <button
              onClick={handleInvalidarFecha}
              className="invalidar-button"
            >
              Invalidar Fecha
            </button>
          </div>
        </div>

        {showTable ? (
          <div className="table-container">
            {filteredTurnos.length > 0 ? (
              <table className="turnos-table">
                <thead>
                  <tr>
                    <th>Nombre y Apellido</th>
                    <th>Fecha</th>
                    <th>Categoria</th>
                    <th>Hora</th>
                    <th>Celular</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTurnos.map((turno) => (
                 
                    <tr key={turno.id} className={turno.completado === "entramite" ? "entramite" : ""}>
                      <td>{turno.nombreApellido}</td>
                      <td>{formatDate(turno.fecha)}</td>
                      <td>{turno.categoria}</td>
                      <td>{turno.hora}</td>
                      <td>{turno.telefono}</td>
                      <td>
                        <button onClick={() => handleVerDetalle(turno)}>Ver</button>
                        <button onClick={() => handleEliminarTurno(turno)} className="eliminar-button">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-turnos-message">
                No hay turnos para mostrar en esta fecha.
              </div>
            )}
          </div>
        ) : (
          detalleTurno && (
            <div className="detalle-turno-container">
              <DetalleTurno turno={detalleTurno} onClose={handleCloseDetalle} />
            </div>
          )
        )}
      </div>

      <ConfirmModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmEliminarTurno}
        turno={turnoToDelete}
      />
    </div>
  );
};

export default AdminDashboard;
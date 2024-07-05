import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminDashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [turnosPorDia, setTurnosPorDia] = useState({});
  const [fechasInvalidas, setFechasInvalidas] = useState([]);
  const [nuevaFechaInvalida, setNuevaFechaInvalida] = useState(null);
  const [razonInvalidacion, setRazonInvalidacion] = useState("");

  const ensureDate = (dateValue) => {
    if (dateValue instanceof Date) {
      return new Date(
        dateValue.getTime() + dateValue.getTimezoneOffset() * 60000
      );
    }
    if (
      dateValue &&
      dateValue.toDate &&
      typeof dateValue.toDate === "function"
    ) {
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
        // Fetch turnos
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

        // Contar turnos por día
        const turnosPorDiaCount = turnosData.reduce((acc, turno) => {
          const fechaKey = turno.fecha.toDateString();
          acc[fechaKey] = (acc[fechaKey] || 0) + 1;
          return acc;
        }, {});

        setTurnosPorDia(turnosPorDiaCount);

        // Fetch fechas inválidas
        const fechasInvalidasCollection = collection(db, "fechasInvalidas");
        const fechasInvalidasSnapshot = await getDocs(
          fechasInvalidasCollection
        );

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
      (fi) =>
        fi.fecha.getDate() === date.getDate() &&
        fi.fecha.getMonth() === date.getMonth() &&
        fi.fecha.getFullYear() === date.getFullYear()
    );

    return (
      <div className="custom-day-contents">
        {day}
        {turnosCount >= 6 && <span className="day-cross">&#10060;</span>}
        {esFechaInvalida && <span className="day-invalid">&#128683;</span>}
      </div>
    );
  };

  // eslint-disable-next-line no-unused-vars
  const handleInvalidarFecha = async () => {
    if (nuevaFechaInvalida && razonInvalidacion) {
      try {
        const fechaInvalidaRef = doc(collection(db, "fechasInvalidas"));
        await setDoc(fechaInvalidaRef, {
          fecha: nuevaFechaInvalida,
          razon: razonInvalidacion,
        });

        setFechasInvalidas([
          ...fechasInvalidas,
          { fecha: nuevaFechaInvalida, razon: razonInvalidacion },
        ]);
        setNuevaFechaInvalida(null);
        setRazonInvalidacion("");
      } catch (error) {
        console.error("Error al invalidar la fecha:", error);
      }
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Panel de Administración</h2>
      <div className="container-filter">
      <h3>Filtros</h3>
      <div className="filters">
        <button
          className={filterType === "all" ? "active" : ""}
          onClick={() => {
            setFilterType("all");
            setSelectedDate(null);
          }}
        >
          Todos
        </button>
        <button
          className={filterType === "today" ? "active" : ""}
          onClick={() => {
            setFilterType("today");
            setSelectedDate(null);
          }}
        >
          Hoy
        </button>
        <button
          className={filterType === "month" ? "active" : ""}
          onClick={() => {
            setFilterType("month");
            setSelectedDate(null);
          }}
        >
          Este mes
        </button>
      </div>

      <div className="date-picker-container">
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

      {/* <div className="date-picker-container">
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
          className="input"
        />
        <button onClick={handleInvalidarFecha}>Invalidar Fecha</button>
      </div> */}
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
              className={`turno-item ${
                turno.completado === "entramite" ? "entramite" : ""
              }`}
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
                  onChange={(e) =>
                    handleCompleteToggle(turno.id, e.target.value)
                  }
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

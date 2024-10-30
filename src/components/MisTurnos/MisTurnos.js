import React, { useState, useEffect, useContext } from "react";
import { X, Calendar, Trash2, Clock, Phone, Mail, FileText } from "lucide-react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { AuthContext } from '../FirebaseAuthProvider';
import Message from "../Message/Message";
import ConfirmacionModal from "../ConfirmacionModal/ConfirmacionModal";
import "./MisTurnos.css";

const MisTurnos = () => {
  const { user } = useContext(AuthContext);
  const [turnos, setTurnos] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos"); // 'todos', 'pendientes', 'completados'
  const [modalVisible, setModalVisible] = useState(false);
  const [turnoIdToCancel, setTurnoIdToCancel] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTurnos();
    }
  }, [user]);

  const fetchTurnos = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, "turnos"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      const turnosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      // Ordenar por fecha y hora
      turnosData.sort((a, b) => {
        const dateCompare = new Date(a.fecha) - new Date(b.fecha);
        if (dateCompare === 0) {
          return a.hora.localeCompare(b.hora);
        }
        return dateCompare;
      });

      setTurnos(turnosData);
      setMessage(null);
    } catch (error) {
      console.error("Error al cargar los turnos:", error);
      setMessage({
        title: "Error",
        content: "Error al cargar los turnos. Por favor, intente nuevamente.",
        type: "error"
      });
    }
    setLoading(false);
  };

  const cancelarTurno = async () => {
    try {
      await deleteDoc(doc(db, "turnos", turnoIdToCancel));
      setTurnos(turnos.filter((turno) => turno.id !== turnoIdToCancel));
      setMessage({
        title: "Éxito",
        content: "Turno cancelado correctamente",
        type: "success"
      });
    } catch (error) {
      console.error("Error al cancelar el turno:", error);
      setMessage({
        title: "Error",
        content: "Error al cancelar el turno. Por favor, intente nuevamente.",
        type: "error"
      });
    }
    setModalVisible(false);
    setTurnoIdToCancel(null);
  };

  const openCancelModal = (turnoId) => {
    setTurnoIdToCancel(turnoId);
    setModalVisible(true);
  };

  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset()); // Ajusta la fecha al horario local
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  

  const esTurnoProximo = (fecha) => {
    const fechaTurno = new Date(fecha);
    const hoy = new Date();
    const diferenciaDias = Math.ceil((fechaTurno - hoy) / (1000 * 60 * 60 * 24));
    return diferenciaDias <= 3 && diferenciaDias >= 0;
  };

  const filtrarTurnos = () => {
    const hoy = new Date();
    return turnos.filter((turno) => {
      const fechaTurno = new Date(turno.fecha);
      switch (filtroEstado) {
        case "pendientes":
          return fechaTurno >= hoy;
        case "completados":
          return fechaTurno < hoy;
        default:
          return true;
      }
    });
  };

  if (!user) {
    return (
      <div className="container-misturnos">
        <div className="login-required">
          <h2>Acceso Requerido</h2>
          <p>Por favor, inicia sesión para ver tus turnos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-misturnos">
      <h2>Mis Turnos</h2>

      <div className="filtros-container">
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="filtro-select"
        >
          <option value="todos">Todos los turnos</option>
          <option value="pendientes">Turnos pendientes</option>
          <option value="completados">Turnos completados</option>
        </select>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tus turnos...</p>
        </div>
      )}

      {!loading && filtrarTurnos().length === 0 && (
        <div className="no-turnos">
          <p>No se encontraron turnos {filtroEstado !== "todos" ? `${filtroEstado}` : ""}.</p>
        </div>
      )}

      {!loading && (
        <div className="turnos-grid">
          {filtrarTurnos().map((turno) => (
            <div
              key={turno.id}
              className={`turno-card ${esTurnoProximo(turno.fecha) ? "proximo" : ""}`}
            >
              <div className="turno-header">
                <Calendar size={18} />
                <h3>{turno.nombreApellido}</h3>
                {esTurnoProximo(turno.fecha) && (
                  <span className="badge-proximo">Próximo</span>
                )}
              </div>

              <div className="turno-info">
                <div className="info-item">
                  <Calendar size={16} />
                  <span>
                    <strong>Fecha:</strong> {formatFecha(turno.fecha)}
                  </span>
                </div>

                <div className="info-item">
                  <Clock size={16} />
                  <span>
                    <strong>Hora:</strong> {turno.hora}
                  </span>
                </div>

                <div className="info-item">
                  <FileText size={16} />
                  <span>
                    <strong>Categoría:</strong> {turno.categoria}
                  </span>
                </div>

                <div className="info-item">
                  <Phone size={16} />
                  <span>
                    <strong>Teléfono:</strong> {turno.telefono}
                  </span>
                </div>

                <div className="info-item">
                  <Mail size={16} />
                  <span>
                    <strong>Email:</strong> {turno.email}
                  </span>
                </div>

                {turno.descripcion && (
                  <div className="info-item descripcion">
                    <strong>Descripción:</strong>
                    <p>{turno.descripcion}</p>
                  </div>
                )}
              </div>

              {new Date(turno.fecha) > new Date() && (
                <button
                  onClick={() => openCancelModal(turno.id)}
                  className="button-cancel"
                >
                  <Trash2 size={18} />
                  Cancelar Turno
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {message && (
        <Message
          title={message.title}
          message={message.content}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <ConfirmacionModal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={cancelarTurno}
        mensaje="¿Está seguro que desea cancelar este turno?"
      />
    </div>
  );
};

export default MisTurnos;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./TurnoForm.css";
import Message from "../Message/Message"; // Componente genérico de mensajes
import { db } from "../../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const TurnoForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [observations, setObservations] = useState("");
  const [description, setDescription] = useState("");
  const [nombreApellido, setNombreApellido] = useState("");
  const [bookedHours, setBookedHours] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [dateDisabled, setDateDisabled] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [availableDays, setAvailableDays] = useState({});
  const [message, setMessage] = useState("");

  const categories = [
    "Inscripcion",
    "Marina Mercante",
    "permisos u otros",
    "Carnet Nautico",
  ];
  const availableHours = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"];

  useEffect(() => {
    if (date) {
      const fetchBookedHours = async () => {
        const q = query(collection(db, "turnos"), where("fecha", "==", date));
        const querySnapshot = await getDocs(q);
        const booked = querySnapshot.docs.map((doc) => doc.data().hora);
        setBookedHours(booked);
        setDateDisabled(booked.length === availableHours.length);
      };
      fetchBookedHours();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    const fetchAvailableDays = async () => {
      const q = query(collection(db, "turnos"));
      const querySnapshot = await getDocs(q);
      const turnosByDate = {};

      querySnapshot.forEach((doc) => {
        const { fecha } = doc.data();
        if (turnosByDate[fecha]) {
          turnosByDate[fecha] += 1;
        } else {
          turnosByDate[fecha] = 1;
        }
      });

      setAvailableDays(turnosByDate);
    };

    fetchAvailableDays();
  }, []);

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "turnos"), {
        ...data,
        fecha: date,
        hora: time,
        categoria: category,
        telefono: cellphone,
        observaciones: observations,
        descripcion: description,
        nombreApellido: nombreApellido,
        completado: false,
      });

      setShowSuccessMessage(true);

      reset();
      setDate("");
      setTime("");
      setCategory("");
      setCellphone("");
      setObservations("");
      setDescription("");
      setNombreApellido("");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error al guardar el turno:", error);
      setMessage(
        "Hubo un error al guardar el turno. Por favor, inténtelo nuevamente."
      );
    }
  };

  const isWeekend = (selectedDate) => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    return day === 5 || day === 6;
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container-turnform">
      <h2>Crear turno</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="form-vertical">
        <div className="form-group">
          <label htmlFor="nombreApellido" className="label">
            Nombre y Apellido:
          </label>
          <input
          placeholder="Juan Perez"
            id="nombreApellido"
            type="text"
            {...register("nombreApellido", {
              required: "Este campo es requerido",
              pattern: {
                value: /^[a-zA-Z\s]*$/,
                message:
                  "El nombre no puede contener números ni caracteres especiales",
              },
            })}
            className="input"
            value={nombreApellido}
            onChange={(e) => {
              setNombreApellido(e.target.value);
              setMessage(""); // Limpiar mensaje de error al editar
            }}
          />
          {errors.nombreApellido && (
            <Message
              title="Error en el nombre"
              message={errors.nombreApellido.message}
              type="error"
              onClose={() => setMessage("")}
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="descripcion" className="label">
            Descripción:
          </label>
          <textarea
           placeholder="Descripcion de una situacion especial"
            id="descripcion"
            {...register("descripcion")}
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fecha" className="label">
            Fecha:
          </label>
          <input
          
            id="fecha"
            type="date"
            value={date}
            min={today}
            onChange={(e) => {
              const selectedDate = e.target.value;
              if (!isWeekend(selectedDate)) {
                setMessage("");
                setDate(selectedDate);
              } else {
                setMessage("No se permiten fechas de fin de semana");
                setDate("");
              }
            }}
            className="input"
            disabled={dateDisabled}
          />
          {message && (
            <Message
              title="Error de fecha"
              message={message}
              type="error"
              onClose={() => setMessage("")}
            />
          )}
          {dateDisabled && (
            <Message
              title="Turnos completos"
              message="No hay turnos disponibles para esta fecha."
              type="error"
              onClose={() => setMessage("")}
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="hora" className="label">
            Hora:
          </label>
          <select
            id="hora"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="select"
          >
            <option value="">Seleccione una hora</option>
            {availableHours
              .filter((hour) => !bookedHours.includes(hour))
              .map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="categoria" className="label">
            Categoría:
          </label>
          <select
            id="categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select"
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="telefono" className="label">
            Número de Celular:
          </label>
          <input
           placeholder="3442535263"
            id="telefono"
            type="tel"
            pattern="[0-9]{10}"
            required
            value={cellphone}
            onChange={(e) => setCellphone(e.target.value)}
            className="input"
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="observaciones" className="label">
            Observaciones:
          </label>
          <textarea
            id="observaciones"
            {...register("observaciones")}
            className="input"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </div> */}
        <button type="submit" className="button">
          Guardar cambios
        </button>
      </form>
      {showSuccessMessage && (
        <Message
          title="¡Turno generado con éxito!"
          message="El turno ha sido registrado correctamente."
          type="success"
          onClose={handleCloseSuccessMessage}
        />
      )}
    </div>
  );
};

export default TurnoForm;

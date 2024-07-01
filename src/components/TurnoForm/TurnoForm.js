import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X, Calendar } from "lucide-react";
import es from 'date-fns/locale/es';
import "./TurnoForm.css";
import Message from "../Message/Message";
import { db } from "../../firebase";
import { collection, addDoc, query, getDocs } from "firebase/firestore";

registerLocale('es', es);

const TurnoForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [description, setDescription] = useState("");
  const [nombreApellido, setNombreApellido] = useState("");
  const [bookedHours, setBookedHours] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fullDates, setFullDates] = useState([]);
  const [message, setMessage] = useState("");

  const categories = [
    "Inscripcion",
    "Marina Mercante",
    "permisos u otros",
    "Carnet Nautico",
  ];
  const availableHours = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"];

  useEffect(() => {
    const fetchFullDates = async () => {
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

      const fullDatesArray = Object.entries(turnosByDate)
        .filter(([, count]) => count >= 6)
        .map(([date]) => new Date(date));

      setFullDates(fullDatesArray);
    };

    fetchFullDates();
  }, []);

  useEffect(() => {
    if (date) {
      const fetchBookedHours = async () => {
        const dateString = date.toISOString().split('T')[0];
        const q = query(collection(db, "turnos"));
        const querySnapshot = await getDocs(q);
        const booked = querySnapshot.docs
          .filter(doc => doc.data().fecha === dateString)
          .map(doc => doc.data().hora);
        setBookedHours(booked);
      };
      fetchBookedHours();
    }
  }, [date]);

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "turnos"), {
        ...data,
        fecha: date.toISOString().split('T')[0],
        hora: time,
        categoria: category,
        telefono: cellphone,
        descripcion: description,
        nombreApellido: nombreApellido,
        completado: false,
      });

      setShowSuccessMessage(true);

      reset();
      setDate(null);
      setTime("");
      setCategory("");
      setCellphone("");
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

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 5 || day === 6;
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const isDateDisabled = (date) => {
    return fullDates.some(fullDate => 
      fullDate.getDate() === date.getDate() &&
      fullDate.getMonth() === date.getMonth() &&
      fullDate.getFullYear() === date.getFullYear()
    ) || isWeekend(date);
  };

  const renderDayContents = (day, date) => {
    const isDisabled = isDateDisabled(date);
    return (
      <div className={`custom-day ${isDisabled ? 'disabled' : ''}`}>
        {day}
        {isDisabled && <X size={12} color="red" className="cross-icon" />}
      </div>
    );
  };

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
              setMessage("");
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
          <div className="date-picker-container">
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              minDate={new Date()}
              filterDate={(date) => !isDateDisabled(date)}
              renderDayContents={renderDayContents}
              placeholderText="Seleccione una fecha"
              className="input date-picker-input"
              locale="es"
              dateFormat="dd/MM/yyyy"
            />
            <Calendar className="calendar-icon" />
          </div>
          {message && (
            <Message
              title="Error de fecha"
              message={message}
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
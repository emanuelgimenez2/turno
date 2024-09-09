import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { X, Calendar } from "lucide-react";
import es from "date-fns/locale/es";
import "./TurnoForm.css";
import Message from "../Message/Message";
import { db } from "../../firebase";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import sendConfirmationEmail from '../EmailService/EmailService';

registerLocale("es", es);

const CATEGORIES = [
  "Inscripcion",
  "Marina Mercante",
  "permisos u otros",
  "Carnet Nautico",
];

const AVAILABLE_HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00"];

const TurnoForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [bookedHours, setBookedHours] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fullDates, setFullDates] = useState([]);
  const [invalidDates, setInvalidDates] = useState([]);
  const [message, setMessage] = useState("");

  const fetchFullDates = useCallback(async () => {
    const q = query(collection(db, "turnos"));
    const querySnapshot = await getDocs(q);
    const turnosByDate = {};

    querySnapshot.forEach((doc) => {
      const { fecha } = doc.data();
      turnosByDate[fecha] = (turnosByDate[fecha] || 0) + 1;
    });

    const fullDatesArray = Object.entries(turnosByDate)
      .filter(([, count]) => count >= AVAILABLE_HOURS.length)
      .map(([date]) => new Date(date + "T00:00:00")); // Añade la hora para asegurar la zona horaria correcta

    setFullDates(fullDatesArray);
  }, []);

  const fetchInvalidDates = useCallback(async () => {
    try {
      const q = query(collection(db, "fechasInvalidas"));
      const querySnapshot = await getDocs(q);
      
      const invalidDatesArray = querySnapshot.docs.map((doc) => {
        const { fecha } = doc.data();
        return new Date(fecha + "T00:00:00"); // Añade la hora para asegurar la zona horaria correcta
      });
      
      setInvalidDates(invalidDatesArray);
    } catch (error) {
      console.error("Error al obtener fechas inválidas:", error);
      setMessage("Error al cargar fechas inválidas. Por favor, recarga la página.");
    }
  }, []);

  useEffect(() => {
    fetchFullDates();
    fetchInvalidDates();
  }, [fetchFullDates, fetchInvalidDates]);

  const fetchBookedHours = useCallback(async (selectedDate) => {
    if (!selectedDate) return;
    const dateString = selectedDate.toISOString().split("T")[0];
    const q = query(collection(db, "turnos"), where("fecha", "==", dateString));
    const querySnapshot = await getDocs(q);
    const booked = querySnapshot.docs.map((doc) => doc.data().hora);
    setBookedHours(booked);
  }, []);

  useEffect(() => {
    fetchBookedHours(date);
  }, [date, fetchBookedHours]);

  const onSubmit = async (data) => {
    if (!date) {
      setMessage("Por favor, seleccione una fecha.");
      return;
    }
    try {
      // Crear una nueva fecha con la hora establecida a medianoche en la zona horaria local
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      // Convertir la fecha local a una cadena ISO 8601 en UTC
      const isoDate = localDate.toISOString();

      const docRef = await addDoc(collection(db, "turnos"), {
        ...data,
        fecha: isoDate.split('T')[0], // Guardar solo la parte de la fecha
        completado: false,
      });

      // Enviar correo de confirmación
      await sendConfirmationEmail(data.email, data.nombreApellido, localDate, data.hora);

      setShowSuccessMessage(true);
      reset();
      setDate(new Date());

      // Actualizar la lista de horas reservadas
      await fetchBookedHours(localDate);
      // Actualizar la lista de fechas completas
      await fetchFullDates();

      setTimeout(() => {
        navigate(`/confirmacion/${docRef.id}`);
      }, 3000);
    } catch (error) {
      console.error("Error al guardar el turno:", error);
      setMessage("Hubo un error al guardar el turno. Por favor, inténtelo nuevamente.");
    }
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 6 || day === 0;
  };

  const isDateDisabled = (date) => {
    const selectedDateISO = date.toISOString().split("T")[0];

    const isFullDate = fullDates.some(
      (fullDate) => fullDate.toISOString().split("T")[0] === selectedDateISO
    );

    const isInvalidDate = invalidDates.some(
      (invalidDate) => invalidDate.toISOString().split("T")[0] === selectedDateISO
    );

    return isFullDate || isInvalidDate || isWeekend(date);
  };

  const renderDayContents = (day, date) => {
    const isDisabled = isDateDisabled(date);
    return (
      <div className={`custom-day ${isDisabled ? "disabled" : ""}`}>
        {day}
        {isDisabled && <X size={12} color="red" className="cross-icon" />}
      </div>
    );
  };

  const renderCalendarIcon = () => (
    <Calendar size={18} color="#2c3e50" className="calendar-icon" />
  );

  return (
    <div className="container-turnform">
      <h2>Crear turno</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="form-vertical">
        <InputField
          id="nombreApellido"
          label="Nombre y Apellido:"
          type="text"
          placeholder="Juan Perez"
          register={register}
          required="Este campo es requerido"
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "El nombre no puede contener números ni caracteres especiales",
          }}
          error={errors.nombreApellido}
        />

        <InputField
          id="email"
          label="Correo electrónico:"
          type="email"
          placeholder="ejemplo@correo.com"
          register={register}
          required="Este campo es requerido"
          pattern={{
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Dirección de correo electrónico inválida",
          }}
          error={errors.email}
        />

        <InputField
          id="descripcion"
          label="Descripción:"
          type="textarea"
          placeholder="Descripcion de una situacion especial"
          register={register}
        />

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
              className="date-picker-input"
              locale="es"
              dateFormat="dd/MM/yyyy"
              calendarIcon={renderCalendarIcon()}
            />
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

        <SelectField
          id="hora"
          label="Hora:"
          register={register}
          options={AVAILABLE_HOURS.filter(
            (hour) => !bookedHours.includes(hour)
          )}
          placeholder="Seleccione una hora"
          required="Este campo es requerido"
        />

        <SelectField
          id="categoria"
          label="Categoría:"
          register={register}
          options={CATEGORIES}
          placeholder="Seleccione una categoría"
          required="Este campo es requerido"
        />

        <InputField
          id="telefono"
          label="Número de Celular:"
          type="tel"
          placeholder="3442535263"
          register={register}
          required="Este campo es requerido"
          pattern={{
            value: /^[0-9]{10}$/,
            message: "El número de teléfono debe tener 10 dígitos",
          }}
          error={errors.telefono}
        />

        <button type="submit" className="button">
          Guardar cambios
        </button>
      </form>

      {showSuccessMessage && (
        <Message
          title="¡Turno generado con éxito!"
          message="El turno ha sido registrado correctamente. Serás redirigido a la página de confirmación."
          type="success"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
    </div>
  );
};

const InputField = ({
  id,
  label,
  type,
  placeholder,
  register,
  required,
  pattern,
  error,
}) => (
  <div className="form-group">
    <label htmlFor={id} className="label">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        placeholder={placeholder}
        {...register(id, { required, pattern })}
        className="input"
      />
    ) : (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id, { required, pattern })}
        className="input"
      />
    )}
    {error && (
      <Message
        title={`Error en ${label}`}
        message={error.message}
        type="error"
        onClose={() => {}}
      />
    )}
  </div>
);

const SelectField = ({
  id,
  label,
  register,
  options,
  placeholder,
  required,
}) => (
  <div className="form-group">
    <label htmlFor={id} className="label">
      {label}
    </label>
    <select id={id} {...register(id, { required })} className="select">
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default TurnoForm;
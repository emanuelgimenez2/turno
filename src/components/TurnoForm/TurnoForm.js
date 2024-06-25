import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './TurnoForm.css';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const TurnoForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [observations, setObservations] = useState('');
  const [description, setDescription] = useState('');
  const [nombreApellido, setNombreApellido] = useState('');
  const [bookedHours, setBookedHours] = useState([]);

  const categories = ["Inscripcion", "Marina Mercante", "permisos u otros", "Carnet Nautico"];
  const availableHours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

  useEffect(() => {
    if (date) {
      const fetchBookedHours = async () => {
        const q = query(collection(db, 'turnos'), where('fecha', '==', date));
        const querySnapshot = await getDocs(q);
        const booked = querySnapshot.docs.map(doc => doc.data().hora);
        setBookedHours(booked);
      };
      fetchBookedHours();
    }
  }, [date]);

  const onSubmit = async (data) => {
    try {
      // Guardar en Firebase Firestore
      await addDoc(collection(db, 'turnos'), {
        ...data,
        fecha: date,
        hora: time,
        categoria: category,
        telefono: cellphone,
        observaciones: observations,
        descripcion: description,
        nombreApellido: nombreApellido
      });
      alert('Turno guardado exitosamente');
      // Limpiar campos después de guardar
      reset();
      setDate('');
      setTime('');
      setCategory('');
      setCellphone('');
      setObservations('');
      setDescription('');
      setNombreApellido('');
      navigate('/');
    } catch (error) {
      console.error('Error al guardar el turno:', error);
      alert('Hubo un error al guardar el turno. Por favor, inténtelo nuevamente.');
    }
  };

  const isWeekend = (selectedDate) => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="container-turnform">
      <h2 style={{ textAlign: 'center' }}>Crear turno</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="form-vertical">
        <div className="form-group">
          <label className="label">Nombre y Apellido:</label>
          <input
            type="text"
            {...register('nombreApellido', { required: true })}
            className="input"
            value={nombreApellido}
            onChange={(e) => setNombreApellido(e.target.value)}
          />
          {errors.nombreApellido && <span className="error-message">Este campo es requerido</span>}
        </div>
        <div className="form-group">
          <label className="label">Descripción:</label>
          <textarea
            {...register('descripcion')}
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ height: '100px' }}
          />
        </div>
        <div className="form-group">
          <label className="label">Fecha:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              const selectedDate = e.target.value;
              if (!isWeekend(selectedDate)) {
                setMessage('');
                setDate(selectedDate);
              } else {
                setMessage('No se permiten fechas de fin de semana');
                setDate('');
              }
            }}
            className="input"
          />
          {message && <div className="error-message">{message}</div>}
        </div>
        <div className="form-group">
          <label className="label">Hora:</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="select"
          >
            <option value="">Seleccione una hora</option>
            {availableHours.filter(hour => !bookedHours.includes(hour)).map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="label">Categoría:</label>
          <select
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
          <label className="label">Número de Celular:</label>
          <input
            type="tel"
            pattern="[0-9]{10}"
            required
            value={cellphone}
            onChange={(e) => setCellphone(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Observaciones:</label>
          <textarea
            {...register('observaciones')}
            className="input"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            style={{ height: '100px' }}
          />
        </div>
        <button type="submit" className="button">Guardar cambios</button>
      </form>
    </div>
  );
};

export default TurnoForm;







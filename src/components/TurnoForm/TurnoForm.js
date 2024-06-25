import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './TurnoForm.css';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const TurnoForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [nombreApellido, setNombreApellido] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [availableHours, setAvailableHours] = useState(['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00']);
  const [disabledHours, setDisabledHours] = useState([]);

  const categories = ["Inscripcion", "Marina Mercante", "permisos u otros", "Carnet Nautico"];

  useEffect(() => {
    const fetchDisabledHours = async (selectedDate) => {
      const q = query(collection(db, 'turnos'), where('fecha', '==', selectedDate));
      const querySnapshot = await getDocs(q);
      const bookedHours = querySnapshot.docs.map(doc => doc.data().hora);
      setDisabledHours(bookedHours);
    };

    if (date) {
      fetchDisabledHours(date);
    }
  }, [date]);

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, 'turnos'), data);
      alert('Turno guardado exitosamente');
      resetForm();
    } catch (error) {
      console.error('Error al guardar el turno:', error);
      alert('Hubo un error al guardar el turno. Por favor, inténtelo nuevamente.');
    }
  };

  const resetForm = () => {
    reset();
    setDate('');
    setTime('');
    setCategory('');
    setCellphone('');
    setNombreApellido('');
    setDescripcion('');
    setObservaciones('');
  };

  const isWeekend = (selectedDate) => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    console.log(day);
    return day === 0 || day === 6; // 0 para domingo y 6 para sábado
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
            value={nombreApellido}
            onChange={(e) => setNombreApellido(e.target.value)}
            className="input"
          />
          {errors.nombreApellido && <span className="error-message">Este campo es requerido</span>}
        </div>
        <div className="form-group">
          <label className="label">Descripción:</label>
          <textarea
            {...register('descripcion')}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="input textarea"
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
            onBlur={() => {
              if (isWeekend(date)) {
                setMessage('No se permiten fechas de fin de semana');
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
            {availableHours.map((hour) => (
              <option key={hour} value={hour} disabled={disabledHours.includes(hour)}>
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
            id="cellphone"
            name="cellphone"
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
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="input textarea"
          />
        </div>
        <button type="submit" className="button">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default TurnoForm;






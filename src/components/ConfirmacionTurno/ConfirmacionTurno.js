import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './ConfirmacionTurno.css';
import { jsPDF } from "jspdf";


const ConfirmacionTurno = () => {
  const { id } = useParams();
  const [turno, setTurno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurno = async () => {
      try {
        const docRef = doc(db, "turnos", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setTurno(docSnap.data());
        } else {
          setError("No se encontró el turno especificado.");
        }
      } catch (error) {
        console.error("Error al obtener el turno:", error);
        setError("Hubo un error al cargar la información del turno.");
      } finally {
        setLoading(false);
      }
    };

    fetchTurno();
  }, [id]);

  if (loading) {
    return <div className="loading">Cargando información del turno...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const handlePrint = () => {
    window.print();
  };
  const generatePDF = () => {
    const pdf = new jsPDF();
  
    // Encabezado
    pdf.setFontSize(22);
    pdf.text('Confirmación de Turno', 105, 20, { align: 'center' });
  
    // Línea divisora
    pdf.setLineWidth(0.5);
    pdf.line(20, 25, 190, 25);
  
    // Detalles del turno
    pdf.setFontSize(14);
    pdf.setTextColor(40);
    
    const info = [
      `Nombre: ${turno.nombreApellido}`,
      `Correo electrónico: ${turno.email}`,
      `Fecha: ${turno.fecha}`,
      `Hora: ${turno.hora}`,
      `Categoría: ${turno.categoria}`,
      `Teléfono: ${turno.telefono}`,
    ];
    
    let yPosition = 40;
    
    info.forEach((text, index) => {
      pdf.text(text, 20, yPosition);
      yPosition += 10;  // Ajusta el espaciado entre líneas
    });
  
    if (turno.descripcion) {
      pdf.text(`Descripción: ${turno.descripcion}`, 20, yPosition);
    }
  
    // Pie de página
    pdf.setFontSize(10);
    pdf.setTextColor(150);
    pdf.text('Gracias por confiar en nuestros servicios.', 105, 290, { align: 'center' });
    pdf.text('Este documento fue generado automáticamente y no requiere firma.', 105, 295, { align: 'center' });
  
    // Guardar el PDF
    pdf.save('confirmacion_turno.pdf');
  };
  

  return (
    <div className="confirmacion-turno">
      <h2>Confirmación de Turno</h2>
      <div className="turno-details">
        <p><strong>Nombre:</strong> {turno.nombreApellido}</p>
   
        <p><strong>Fecha:</strong> {turno.fecha}</p>
        <p><strong>Hora:</strong> {turno.hora}</p>
        <p><strong>Categoría:</strong> {turno.categoria}</p>

      </div>
      <button className="print-button" onClick={generatePDF}>
        Descargar PDF
      </button>
    </div>
  );
};

export default ConfirmacionTurno;
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartsContainer = ({ turnos }) => {
  const chartMonthRef = useRef(null);

  // Función para contar los turnos completados por día del mes actual
  const countCompletedByMonth = () => {
    const daysInMonth = new Date().getDate(); // Obtener el número de días del mes actual
    const completedByMonth = Array.from({ length: daysInMonth }, () => 0); // Array para contar turnos por día

    turnos.forEach(turno => {
      const date = new Date(turno.fecha);
      const day = date.getDate();
      if (turno.completado) {
        completedByMonth[day - 1]++; // Día - 1 porque los índices de array comienzan en 0
      }
    });

    return completedByMonth;
  };

  useEffect(() => {
    // Lógica para crear o actualizar el gráfico de turnos completados por día del mes
    if (chartMonthRef.current) {
      if (chartMonthRef.current.chart) {
        chartMonthRef.current.chart.destroy(); // Destruir el gráfico existente si existe
      }

      const ctxMonth = chartMonthRef.current.getContext('2d');
      const chartMonth = new Chart(ctxMonth, {
        type: 'bar',
        data: {
          labels: Array.from({ length: new Date().getDate() }, (_, i) => i + 1),
          datasets: [{
            label: 'Turnos Completados por Día del Mes',
            data: countCompletedByMonth(),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              precision: 0
            }
          }
        }
      });

      chartMonthRef.current.chart = chartMonth; // Guardar el objeto del gráfico en la referencia
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnos]);

  return (
    <div className="charts-container">
      {/* Gráfico de Turnos Completados por Día del Mes */}
      <div className="chart-container">
        <canvas ref={chartMonthRef} id="chart-month"></canvas>
      </div>
    </div>
  );
};

export default ChartsContainer;

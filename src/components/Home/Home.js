import React, { useState } from "react";
import "./Home.css";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    {
      title: "Habilitación Náutico Deportiva",
      data: [
        {
          item: "Requisitos para el Carnet Náutico",
          description: [
            "Presentar Copia del acta examen",
            "Certificado médico",
            "2 Fotos color Fondo Celeste de Frente",
            "Fotocopia D.N.I. ",
            "Constancia de CUIL",
          ],
          link: "https://www.infobae.com/sociedad/policiales/2024/06/30/caso-loan-la-pericia-al-celular-de-la-tia-laudelina-es-la-pieza-que-falta-en-el-relato/",
        },
      ],
    },
    {
      title: "Renovación Náutico Deportiva",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Busque su embarcacion e imprima las bolatas"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Tasa Fija Anual",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Busque su embarcacion e imprima las bolatas"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Autorizacion de manejo",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Busque su embarcacion e imprima las bolatas"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Cambio – retiro de motor",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Busque su embarcacion e imprima las bolatas"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Estado de  dominio e inhibiciones",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Busque su embarcacion e imprima las bolatas"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Inscripcion embarcacion rey de 2 a 9 toneladas",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Busque su embarcacion e imprima las bolatas"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Inscripción de una embarcación jurisdiccional",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Busque su embarcacion e imprima las bolatas"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Transferencia embarcación rey",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Busque su embarcacion e imprima las bolatas"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Transferencia embarcación  jurisdiccionales",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Busque su embarcacion e imprima las bolatas"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
  ];

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const selectedData = categories.find(
    (category) => category.title === selectedCategory
  );

  return (
    <div className="home-container">
      <h1>Bienvenido al sistema de gestión de turnos</h1>
      <p>
        Este es el lugar donde puedes gestionar tus turnos de manera fácil y
        rápida.
      </p>

      <section className="info-section">
        <h2>Información General</h2>
        <div className="select-container">
          <label htmlFor="category-select">Seleccione una categoría:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Eliga el tema de su consulta</option>

            {categories.map((category, index) => (
              <option key={index} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      {selectedData && (
        <section className="tables-section">
          <div className="table-container">
            <h3>{selectedData.title}</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trámite</th>
                  <th>Documentos</th>
                </tr>
              </thead>
              <tbody>
                {selectedData.data.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.item}</td>
                    <td>
                      <ul>
                        {item.description.map((desc, dIdx) => (
                          <li key={dIdx}>{desc}</li>
                        ))}
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button>Descarga</button>
                        </a>
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

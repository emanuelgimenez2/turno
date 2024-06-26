import React from "react";
import "./Home.css"; // Archivo CSS local

const Home = () => {
  // Datos de las categorías y tablas
  const categories = [
    {
      title: "Carnet Náutico",
      data: [
        {
          item: "Requisitos para el Carnet Náutico",
          description: [
            "Documento de identidad",
            "Certificado médico",
            "Comprobante de pago",
          ],
        },
        // { item: "Dato 2", description: ["Descripción 2a", "Descripción 2b"] },
        // { item: "Dato 3", description: ["Descripción 3a", "Descripción 3b"] },
      ],
    },
    // {
    //   title: "Tabla 2",
    //   data: [
    //     { item: "Dato 4", description: ["Descripción 4a", "Descripción 4b"] },
    //     { item: "Dato 5", description: ["Descripción 5a", "Descripción 5b"] },
    //   ],
    // },
  ];

  return (
    <div className="home-container">
      <h1>Bienvenido al sistema de gestión de turnos</h1>
      <p>
        Este es el lugar donde puedes gestionar tus turnos de manera fácil y
        rápida.
      </p>

      <section className="info-section">
        <h2>Información General</h2>
        {/* Contenido adicional aquí */}
      </section>

      <section className="tables-section">
        {categories.map((category, index) => (
          <div key={index} className="table-container">
            <h3>{category.title}</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Dato</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {category.data.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.item}</td>
                    <td>
                      <ul>
                        {item.description.map((desc, dIdx) => (
                          <li key={dIdx}>{desc}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;

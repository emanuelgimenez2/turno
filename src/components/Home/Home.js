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
      ],
    },
    {
      title: "Tasa Fija Anual",
      data: [
        {
          item: "Tasa Fija Anual",
          description: [""],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
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
                  <th>Trámite</th>
                  <th>Documentos</th>
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
                        {/* Renderizamos el botón solo para el segundo elemento */}
                        {index === 1 && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button>ingrese</button>
                          </a>
                        )}
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

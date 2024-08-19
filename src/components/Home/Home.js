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
          link: "https://drive.google.com/file/d/1B3FK59BM_N7OM3r301QClbyTBvF7bA_J/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Renovación Náutico Deportiva",
      data: [
        {
          item: "Renovación",
          description: ["Certificado Náutico VENCIDO / o Constancia de Perdida/Robo/Extravió ",
            "Certificado Médico ",
            "2  Fotos color Fondo Celeste de Frente",
            "Fotocopia DNI",
            "	Constancia cuil."
          ],
          link: "https://drive.google.com/file/d/16VwkwAJ4XGISAJYP34Jpd0BR1ZikBwWT/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Tasa Fija Anual",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Busque su embarcacion e imprima las boletas"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Autorizacion de manejo",
      data: [
        {
          item: "Autorizacion de manejo",
          description: ["Formulario: Firma certificada por Escribano y Legalizada por el Colegio de Escribanos, o presentarse titular y certifica firma en Oficina de POLINAVE.",
            "Fotocopias del Certificado de Matrícula ",
            "Fotocopia del DNI ",
            "Fotocopia Habilitación Náutica Deportiva",
            "Constancia de CUIL O CUIT "
          ],
          link: "https://drive.google.com/file/d/1fcJU4kom8dbFNXhpJzPGhJk1egFSPJKq/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Cambio retiro de motor embarcación jurisdiccional ",
      data: [
        {
          item: "Cambio retiro de motor",
          description: ["Formulario Nº 003 RNBU CERTIFICADO  por escribano público y COLEGIO",
            "Factura original de compra del motor con sello y firma de la entidad vendedora (en caso de instalación – cambio de motor).",
            "Fotocopia DNI ",
            "Constancia de CUIL o CUIT",
            "Fotocopia de un servicio "
          ],
          link: "https://drive.google.com/file/d/1ScytuzWXVHPKYPqAKyjSOiUqWbDXNn95/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Cambio retiro de motor embarcacion REY ",
      data: [
        {
          item: "Cambio retiro de motor",
          description: ["Formulario Nº 003 RNBU CERTIFICADO  por escribano público y COLEGIO",
            "Factura original de compra del motor con sello y firma de la entidad vendedora (en caso de instalación – cambio de motor).",
            "Fotocopia DNI ",
            "Constancia de CUIL o CUIT",
            "Fotocopia de un servicio "
          ],
          link: "https://drive.google.com/file/d/10LbVQ1IGzIp4aoFmHIX1otuwpUERqGs8/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Estado de  dominio e inhibiciones",
      data: [
        {
          item: "Tasa Fija Anual",
          description: ["Formulario Nº 004 RNBU por duplicado",
            "Agregar copia CERTIFICADO DE MATRICULA",
            "Fotocopia DNI ",
            "Constancia de CUIL o CUIT"
          ],
          link: "https://drive.google.com/file/d/1b9rvXOFI-kdj1Gkkublk4uVE-2QnWiwy/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Inscripcion embarcacion REY de 2 a 9 toneladas",
      data: [
        {
          item: "Inscripcion embarcacion REY",
          description: ["Formulario Nº 001 RNBU CERTIFICADO",
            "Factura original de compra del casco y del motor ",
            "Certificado de aprobación de prototipo",
            "Certificado de conformidad de serie",
            "Certificado de registro de empresa ante PNA",
            "Fotocopia DNI",
            "Constancia de CUIL",
            "Fotocopia de un servicio ",
            "Traer la embarcación a la dependencia para inspección (DEBERÁ TENER NOMBRE Y REY E/T AMBOS LADOS) (12 CM DE ALTO COMO MÍNIMO)"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Inscripción de una embarcación jurisdiccional",
      data: [
        {
          item: "Inscripción jurisdiccional",
          description: ["Formulario Nº 1 CERTIFICADO ",
            "Factura original de compra de la embarcación ",
            "Fotocopia DNI ",
            "Fotocopia de un servicio ",
            "Constancia de Cuil ",
            "Traer la embarcación a la dependencia para inspección.- (DEBERÁ TENER NOMBRE Y CURU E/T AMBOS LADOS) (12 CM DE ALTO COMO MÍNIMO)"
          ],
          link: "https://drive.google.com/file/d/1eKkgFO0imPg5d4oQKAP3ubZr85yFsNmm/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Transferencia embarcación REY",
      data: [
        {
          item: "Transferencia",
          description: ["Formulario Nº 002 RNBU anverso y reverso CERTIFICADO",
            "Formulario Nº 002 RNBU anverso y reverso CERTIFICADO  ",
            "Fotocopia DNI de COMPRADOR y VENDEDOR",
            "Fotocopia DNI conyugue del comprador",
            "Constancia de CUIL ",
            "Fotocopia de un servicio ",
            "Formulario 381 (Nuevo Modelo) “Certificado de Bienes Registrales",
            "Traer la embarcación a la dependencia para (DEBERÁ TENER NOMBRE Y N° DE MATRICULA AMBOS LADOS) (12 CM DE ALTO COMO MÍNIMO) "
          ],
          link: "https://drive.google.com/file/d/1yjuNRto8k8rPFHW5HCIJy6yz2XBR1uU5/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Transferencia embarcación  jurisdiccionales",
      data: [
        {
          item: "Transferencia embarcación  jurisdiccionales",
          description: ["Formulario Nº 2 CERTIFICADO",
            "CERTIFICADO DE MATRICULA Y CONSTANCIA DE MATRICULA de la embarcación en original",
            "copia DNI (a color preferentemente) del COMPRADOR y VENDEDOR",
            "Constancia de CUIL ",
            "Copia de un servicio ",
            "Traer la embarcación a la dependencia para inspección.- (deberá tener nombre y N° de Matricula ambos lados) (12 cm de alto como mínimo) "
          ],
          link: "https://drive.google.com/file/d/1cSIqQhGr1DTp4oW4RhyMUqu0-M9Mrh0X/view?usp=drive_link",
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

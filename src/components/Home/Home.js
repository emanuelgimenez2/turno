import React, { useState } from "react";
import "./Home.css";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    {
      title: "Licencia Náutica Deportiva",
      data: [
        {
          item: "Requisitos para la Tarjeta Náutica",
          description: [
            "Aportar copia del informe del examen",
            "Certificado médico",
            "2 fotos a color con fondo azul claro del anverso",
            "Fotocopia del DNI",
            "Certificado del CUIL",
          ],
          link: "https://drive.google.com/file/d/1B3FK59BM_N7OM3r301QClbyTBvF7bA_J/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Renovación Náutica Deportiva",
      data: [
        {
          item: "Renovación",
          description: [
            "Certificado Náutico Caducado / o Certificado de Pérdida/Robado/Extraviado",
            "Certificado Médico",
            "2 fotos a color con fondo azul claro del anverso",
            "Fotocopia del DNI",
            "Constancia CUIL"
          ],
          link: "https://drive.google.com/file/d/16VwkwAJ4XGISAJYP34Jpd0BR1ZikBwWT/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Impuesto Anual Fijo",
      data: [
        {
          item: "Impuesto Anual Fijo",
          description: ["Busque su embarcación e imprima los comprobantes"],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Autorización de Manejo",
      data: [
        {
          item: "Autorización de Manejo",
          description: [
            "Formulario: Firma certificada por Escribano y Legalizada por el Colegio de Escribanos, o presentar al titular y certificar la firma en la Oficina de POLINAVE.",
            "Fotocopias del Certificado de Matriculación",
            "Fotocopia del DNI",
            "Fotocopia de la Licencia Náutica Deportiva",
            "Constancia de CUIL o CUIT"
          ],
          link: "https://drive.google.com/file/d/1fcJU4kom8dbFNXhpJzPGhJk1egFSPJKq/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Cambio de baja de motor de embarcación jurisdiccional",
      data: [
        {
          item: "Cambio de baja de motor",
          description: [
            "Formulario N.° 003 RNBU CERTIFICADO por escribano público y COLEGIO",
            "Factura original de compra del motor con sello y firma de la entidad vendedora (en caso de instalación – cambio de motor).",
            "Fotocopia del DNI",
            "Comprobante de CUIL o CUIT",
            "Fotocopia de un servicio"
          ],
          link: "https://drive.google.com/file/d/1ScytuzWXVHPKYPqAKyjSOiUqWbDXNn95/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Cambio - retirada de motor de embarcación REY",
      data: [
        {
          item: "Cambio - retirada de motor",
          description: [
            "Formulario n.º 003 RNBU CERTIFICADO por un registrador público y COLEGIO",
            "Factura original de compra del motor con sello y firma de la entidad vendedora (en caso de instalación - cambio de motor).",
            "Fotocopia del DNI",
            "Certificado de CUIL o CUIT",
            "Fotocopia de un servicio"
          ],
          link: "https://drive.google.com/file/d/10LbVQ1IGzIp4aoFmHIX1otuwpUERqGs8/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Situación de propiedad e inhibiciones",
      data: [
        {
          item: "Impuesto Fijo Anual",
          description: [
            "Formulario N° 004 RNBU por duplicado",
            "Agregar copia del CERTIFICADO DE MATRÍCULA",
            "Fotocopia del DNI",
            "Certificado de CUIL o CUIT"
          ],
          link: "https://drive.google.com/file/d/1b9rvXOFI-kdj1Gkkublk4uVE-2QnWiwy/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Matrícula de embarcaciones REY de 2 a 9 toneladas",
      data: [
        {
          item: "Matrícula de embarcaciones REY de 2 a 9 toneladas",
          description: [
            "Formulario N° 001 RNBU CERTIFICADO",
            "Factura original de compra del casco y motor",
            "Certificado de aprobación de prototipo",
            "Certificado de conformidad serial",
            "Certificado de inscripción de empresa ante PNA",
            "Fotocopia del DNI",
            "Certificado CUIL",
            "Fotocopia de un servicio",
            "Traer la embarcación a las instalaciones para inspección (DEBE TENER NOMBRE Y/O NOMBRE DEL REY EN AMBOS LADOS) (ALTURA MÍNIMA DE 12 CM)"
          ],
          link: "https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php",
        },
      ],
    },
    {
      title: "Matrícula de una embarcación jurisdiccional",
      data: [
        {
          item: "Matrícula jurisdiccional",
          description: [
            "Formulario N.° 1 CERTIFICADO",
            "Factura original de compra de la embarcación",
            "Fotocopia de DNI",
            "Fotocopia de un documento de servicio",
            "Comprobante de identidad",
            "Traer la embarcación a las instalaciones para inspección.- (DEBE TENER NOMBRE Y NOMBRE EN AMBOS LADOS) (ALTURA MÍNIMA DE 12 CM)"
          ],
          link: "https://drive.google.com/file/d/1eKkgFO0imPg5d4oQKAP3ubZr85yFsNmm/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Traspaso de embarcación REY",
      data: [
        {
          item: "Traspaso",
          description: [
            "Formulario N° 002 RNBU anverso y reverso CERTIFICADO",
            "Formulario N° 002 RNBU anverso y reverso CERTIFICADO",
            "Fotocopia de cédula de identidad del comprador y del vendedor",
            "Fotocopia de cédula de identidad del comprador",
            "Certificado de CUIL",
            "Fotocopia de un servicio",
            "Formulario 381 (Nuevo Modelo) 'Certificado de Registro de Bienes'",
            "Traer la embarcación al local para (DEBE TENER EL NOMBRE Y NÚMERO DE MATRÍCULA EN AMBOS LADOS) (MÍNIMO 12 CM DE ALTO)"
          ],
          link: "https://drive.google.com/file/d/1yjuNRto8k8rPFHW5HCIJy6yz2XBR1uU5/view?usp=drive_link",
        },
      ],
    },
    {
      title: "Transferencia uvar de jurisdicciones",
      data: [
        {
          item: "Transferencia uvar de jurisdicciones",
          description: [
            "CERTIFICADO Formulario Nº 2",
            "CERTIFICADO DE MATRÍCULA Y COMPROBANTE DE MATRÍCULA de la embarcación en original",
            "Copia del DNI (preferentemente a color) del COMPRADOR y VENDEDOR",
            "Comprobante de CUIL",
            "Copia de un servicio",
            "Traer la embarcación al local para su inspección.- (debe tener el nombre y el N.º de Matrícula en ambos lados) (altura mínima de 12 cm)"
          ],
          link: "https://drive.google.com/file/d/1cSIqQhGr1DTp4oW4RhyMUqu0-M9Mrh0X/view?usp=drive_link",
        },
      ],
    }
  ];

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const selectedData = categories.find(
    (category) => category.title === selectedCategory
  );

  return (
    <div className="home-container">
      <header className="welcome-header">
        <h1>Bienvenido al Sistema de Gestión de Trámites Náuticos</h1>
        <p className="welcome-text">
          Plataforma integral para la gestión de turnos y consultas relacionadas
          con sus embarcaciones.
        </p>
      </header>

      <section className="debt-query-section">
        <div className="debt-query-container">
          <h2>Consulta y Pago de Deudas</h2>
          <p>
            Para consultar y pagar los impuestos de su embarcación, diríjase al
            sistema oficial de Prefectura Naval
          </p>
          <a
            href="https://erecauda.prefecturanaval.gob.ar/erecauda/bb_form.php"
            target="_blank"
            rel="noopener noreferrer"
            className="payment-link"
          >
            <button className="query-button">
              Consultar Deuda en Prefectura
            </button>
          </a>
        </div>
      </section>

      <section className="info-section">
        <h2>Información de Trámites</h2>
        <p>
          Seleccione el trámite que desea realizar para ver los requisitos
          necesarios.
        </p>
        <div className="select-container">
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Seleccione el trámite que necesita</option>
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
                  <th>Documentos Requeridos</th>
                </tr>
              </thead>
              <tbody>
                {selectedData.data.map((item, idx) => (
                  <tr key={idx}>
                    <td className="procedure-name">{item.item}</td>
                    <td>
                      <ul className="documents-list">
                        {item.description.map((desc, dIdx) => (
                          <li key={dIdx}>{desc}</li>
                        ))}
                      </ul>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="download-link"
                        >
                          <button className="download-button">
                            Descargar Formulario
                          </button>
                        </a>
                      )}
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
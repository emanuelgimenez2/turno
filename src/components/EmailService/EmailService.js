import emailjs from 'emailjs-com';

const sendConfirmationEmail = (email, nombre, fecha, hora) => {
  const templateParams = {
    to_name: nombre,
    to_email: email,
    appointment_date: fecha.toLocaleDateString("es-ES"),
    appointment_time: hora,
  };

  console.log("Service ID:", process.env.REACT_APP_YOUR_SERVICE_ID);
  console.log("Template ID:", process.env.REACT_APP_YOUR_TEMPLATE_ID);
  console.log("User ID:", process.env.REACT_APP_YOUR_USER_ID);

  return emailjs.send(
    process.env.REACT_APP_YOUR_SERVICE_ID,
    process.env.REACT_APP_YOUR_TEMPLATE_ID,
    templateParams,
    process.env.REACT_APP_YOUR_USER_ID
  )
  .then((response) => {
    console.log('Email enviado con éxito!', response.status, response.text);
  })
  .catch((error) => {
    console.error('Error al enviar el email:', error);
  });
};

export default sendConfirmationEmail;
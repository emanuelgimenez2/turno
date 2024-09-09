import emailjs from 'emailjs-com';

const sendConfirmationEmail = (email, nombre, fecha, hora) => {
  const templateParams = {
    to_name: nombre,
    to_email: email,
    appointment_date: fecha.toLocaleDateString("es-ES"),
    appointment_time: hora,
  };

 

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
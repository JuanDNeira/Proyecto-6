import React, { useState } from 'react';
import axios from '../../axiosConfig';


  const EmailForm = () => {
    const [emailData, setEmailData] = useState({
      to: '',
      subject: '',
      text: '',
      messageType: 'custom'
    });
    const [status, setStatus] = useState('');
  

    const predefinedMessages = {
      welcome: {
        subject: '¡Bienvenido',
        text: `Estimado cliente,
  
Nos complace darle la más cordial bienvenida . Estamos encantados de tenerle con nosotros y queremos asegurarle que está en buenas manos.
  
Nuestro compromiso es brindarle el mejor servicio posible y estar siempre disponibles para ayudarle en lo que necesite.
  
Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.
  
  Saludos cordiales,
  Equipo Sistema JN`
      },
      reminder: {
        subject: 'Pagina Caida',
        text: `Estimado cliente,
  
Lamentamos informarle que hemos experimentado un inconveniente técnico y nuestra página se encuentra temporalmente fuera de servicio.

Nuestro equipo está trabajando arduamente para resolverlo lo antes posible.

Agradecemos su comprensión y paciencia.
  
  Saludos cordiales,
  Equipo Sistema JN`
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando...');
  
    try {
      const response = await axios.post('/send-email', emailData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data.success) {
        setStatus('Email enviado exitosamente!');
        setEmailData({ 
          to: '', 
          subject: '', 
          text: '', 
          messageType: 'custom' 
        });
      } else {
        setStatus('Error al enviar el email: ' + response.data.error);
      }
    } catch (error) {
      setStatus('Error al enviar el email: ' + (error.response ? error.response.data.error : error.message));
    }
  };
  

  const handleMessageTypeChange = (e) => {
    const type = e.target.value;
    if (type === 'custom') {
      setEmailData({
        ...emailData,
        messageType: 'custom',
        subject: '',
        text: ''
      });
    } else {
      setEmailData({
        ...emailData,
        messageType: type,
        subject: predefinedMessages[type].subject,
        text: predefinedMessages[type].text
      });
    }
  };

  const handleChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Enviar Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Para:</label>
          <input
            type="email"
            name="to"
            value={emailData.to}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tipo de mensaje:</label>
          <select
            name="messageType"
            value={emailData.messageType}
            onChange={handleMessageTypeChange}
            className="w-full p-2 border rounded"
          >
            <option value="custom">Mensaje personalizado</option>
            <option value="welcome">Mensaje de bienvenida</option>
            <option value="reminder">Mensaje Sobre la Pagina</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Asunto:</label>
          <input
            type="text"
            name="subject"
            value={emailData.subject}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Mensaje:</label>
          <textarea
            name="text"
            value={emailData.text}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Enviar Email
        </button>
      </form>
      {status && (
        <p className={`mt-4 text-center ${
          status.includes('Error') ? 'text-red-500' : 'text-green-500'
        }`}>
          {status}
        </p>
      )}
    </div>
  );
};

export default EmailForm;
import emailjs from "@emailjs/browser";
import { frontUrl } from "./url";

export const sendEmail = (data) => {
  const form = {
    from_name: "Administracion Natatorio Olimpico",
    to_name: data.nombre,
    from_email: data.email,
    enlace: `${frontUrl}verificar-cuenta?token=${data.token}`,
    reply_to: "natatorio@correo.com",
  };
  const serviceID = import.meta.env.VITE_REACT_APP_SERVICE_ID;
  const templateID = import.meta.env.VITE_REACT_APP_TEMPALTE_ID;
  const publicKey = import.meta.env.VITE_REACT_APP_PUBLIK_KEY;

  emailjs.send(serviceID, templateID, form, publicKey).then(
    (result) => {
      return result;
    },
    (error) => {
      return error;
    }
  );
};
export const sendEmailConfirmActivity = (data) => {
  const form = {
    from_name: "Administracion Natatorio Olimpico",
    to_name: data.nombre,
    from_email: data.email,
    message: `Se ha registrado en la actividad con exito, Actividad: ${
      data.activity[0].name
    }, Horario: ${data.activity[0].hourStart} - ${
      data.activity[0].hourFinish
    }, Días: ${data.activity[0].date.join("-")}
    
    Su numero de identificacion es: ${data.customId}
  
    Podra acceder a sus credenciales desde el perfil de usuario`,
    reply_to: "natatorio@correo.com",
  };
  const serviceID = import.meta.env.VITE_REACT_APP_SERVICE_ID;
  const templateID = "template_4cnpj3s";
  const publicKey = import.meta.env.VITE_REACT_APP_PUBLIK_KEY;

  emailjs.send(serviceID, templateID, form, publicKey).then(
    (result) => {
      return result;
    },
    (error) => {
      return error;
    }
  );
};

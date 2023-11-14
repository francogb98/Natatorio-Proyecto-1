import Activity from "../../models/models/Actividades.js";
import User from "../../models/models/User.js";

import { Resend } from "resend";

export const addUserFromActivity = async (req, res) => {
  const { idActividad } = req.body;

  console.log(idActividad);
  try {
    const user = await User.findOne({
      _id: req.user.id,
    });

    console.log(user);
    //verificamos si el usuario ya esta registrado en la actividad
    if (user.activity?.length) {
      return res.status(400).json({
        status: "error",
        message: "El usuario ya se encuentra inscripto en una actividad",
      });
    }

    const isActivityExist = await Activity.findById({
      _id: idActividad,
    });

    if (!isActivityExist) {
      return res.status(400).json({
        status: "error",
        message: "La actividad seleccionada no existe",
      });
    }

    //verificamos si hay cupo
    if (isActivityExist.userRegister >= isActivityExist.cupos) {
      return res.status(400).json({
        status: "error",
        message: "Cupos agotados",
      });
    }

    //agregamos el usuario, e incrementamos el cupo
    const activityUpdate = await Activity.findOneAndUpdate(
      { _id: isActivityExist._id },
      { $push: { users: user }, $inc: { userRegister: 1 } },
      { new: true }
    );

    //   //le añadimos al usuario la actividad, con sus respectivos horarios
    user.activity = activityUpdate;

    user.status = false;

    const userUpdate = await user.save();

    console.log(userUpdate);

    return res.status(200).json({
      status: "success",
      message: "Usuario agregado a la actividad",
      data: {
        activityUpdate,
        userUpdate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const DeshabilitarUser = async (req, res) => {
  //buscamos el usuario para deshabilitar por el id y lo actualizamos su stats a false y borramos la actividad de su campo y borramos el usuario del campo activity
  const { id, idActivity, mensaje } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: { status: false },
        $pull: { activity: idActivity },
        //añado el campo mensaje
        $set: { mensaje: mensaje },
      },
      { new: true }
    );
    const activity = await Activity.findOneAndUpdate(
      { _id: idActivity },
      { $pull: { users: id } },
      { new: true }
    );

    const resend = new Resend(`${process.env.RESEND_APIKEY}`);
    resend.emails
      .send({
        from: "administracionNatatorio@correo.com",
        to: user.email,
        subject: "Problemas en su inscripcion",
        html: `<h2>Saludos desde Natatorio Olimpico <strong>${user.nombre} ${user.apellido}</strong>!</h2>
        <p>Te informamos que has sido deshabilitado de la actividad <strong>${activity.name}</strong> por el siguiente motivo: <strong>${mensaje}</strong></p>
        <p>Para mas informacion comunicate con el administrador del natatorio</p>
        <p>Saludos cordiales</p>
        <p>No responda este mensaje, es un mensaje automatico</p>
        `,
      })
      .then((response) => {
        console.log("Email sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });

    return res.status(200).json({
      status: "success",
      message: "Usuario deshabilitado",
      data: {
        user,
        activity,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const HabilitarUser = async (req, res) => {
  //buscamos el usuario a habilitar por el id y lo actualizamos su stats a true
  const { id } = req.params;
  try {
    //acccedo al dia de la semana y lo guardo en una variable

    const dateNow = new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const dateNowSave = `${day}/${month}/${year}`;

    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: { status: true },
        //en caso de que tenga un campo mensaje lo borro
        $unset: { mensaje: 1 },
      },
      { new: true }
    ).populate({
      path: "activity",
      populate: {
        path: "name",
      },
    });

    user.asistencia = dateNowSave;
    await user.save();

    const resend = new Resend(`${process.env.RESEND_APIKEY}`);
    resend.emails
      .send({
        from: "administracionNatatorio@correo.com",
        to: user.email,
        subject: "Problemas en su inscripcion",
        html: `<h2>Saludos desde Natatorio Olimpico <strong>${user.nombre} ${
          user.apellido
        }</strong>!</h2>
        <p>Te informamos que has sido habilitado para la actividad <strong>${
          user.activity[0].name
        }</strong></p>
        <br/>
        <p>Los dias:${user.activity[0].date.join(" - ")}</p>
        <p>En el Horario:${user.activity[0].hourStart} - ${
          user.activity[0].hourFinish
        }</p>
        <p>Para mas informacion comunicate con el administrador del natatorio</p>
        <p>Saludos cordiales</p>
        <p>No responda este mensaje, es un mensaje automatico</p>
        `,
      })
      .then((response) => {
        console.log("Email sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });

    return res.status(200).json({
      status: "success",
      message: "Usuario habilitado",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

import Activity from "../../models/models/Actividades.js";
import User from "../../models/models/User.js";

export const addUserFromActivity = async (req, res) => {
  const { idActividad } = req.body;

  try {
    const user = await User.findOne({
      _id: req.user.id,
    }).populate({
      path: "activity",
      populate: {
        path: "name",
      },
    });

    //verificamos si el usuario ya esta registrado en la actividad

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
    if (isActivityExist.users.length >= isActivityExist.cupos) {
      return res.status(400).json({
        status: "error",
        message: "Cupos agotados",
      });
    }

    if (!user.activity) {
      user.activity = [];
    }


    //si la actividad seleccionada no tiene codigo de acceso verifico que el usuario no este registrado en una actividad con codigo de acceso
    if(!isActivityExist.codigoDeAcceso){
      for (let i = 0; i < user.activity.length; i++) {
        const actividad = user.activity[i];
        if (!actividad.codigoDeAcceso) {
          return res.status(400).json({
            status: "error",
            message:
              "Usuario ya inscripto en una actividad, por favor dar de baja la actividad actual para poder inscribirse en una nueva.",
          });
        }
      }      
    }

    if(isActivityExist.users.includes(user._id) && isActivityExist.codigoDeAcceso){
      console.log("entre aqui 312");
      return res.status(200).json({
        status: "success",
        message: "Usuario agregado a la actividad",

      });
    }

    //agregamos el usuario, e incrementamos el cupo
    const activityUpdate = await Activity.findOneAndUpdate(
      { _id: isActivityExist._id },
      { $push: { users: user }, $inc: { userRegister: 1 } },
      { new: true }
    );
    //   //le añadimos al usuario la actividad, con sus respectivos horarios
    user.activity.push(activityUpdate);

    if(user.activity.length == 1){
      user.status = false
    }

    const userUpdate = await user.save();

    return res.status(200).json({
      status: "success",
      message: "Usuario agregado a la actividad",
      data: {
        activityUpdate,
        userUpdate,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "error en el servidor",
    });
  }
};

export const DeshabilitarUser = async (req, res) => {
  //buscamos el usuario para deshabilitar por el id y lo actualizamos su stats a false y borramos la actividad de su campo y borramos el usuario del campo activity
  const { id, asunto, cuerpo } = req.body;
  try {
    //busco el usuario por el id
    console.log(asunto, cuerpo);
    const dateNow = new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const dateNowSave = `${day}/${month}/${year}`;

    if (!asunto || !cuerpo) {
      return res.status(400).json({
        status: "error",
        message: "Debe completar los campos asunto y mensaje",
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { status: false } },
      { new: true }
    );

    if (user.activity.length) {
      const activity = await Activity.findOneAndUpdate(
        { _id: user.activity[0]._id },
        { $pull: { users: id } },
        //disminuto el campo de userregister
        { $set: { userRegister: user.activity[0].userRegister - 1 } },
        { new: true }
      );
    }

    //borro el campo activity del usuario
    user.activity = [];

    //creo una notificacion para el usuario

    if (!user.notificaciones) {
      user.notificaciones = [];
    }
    user.notificaciones.push({
      asunto: asunto,
      cuerpo: cuerpo,
      fecha: dateNowSave,
    });

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Usuario deshabilitado",
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "error en el servidor",
    });
  }
};

export const HabilitarUser = async (req, res) => {
  //buscamos el usuario a habilitar por el id y lo actualizamos su stats a true
  const { id, asunto, cuerpo } = req.params;
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
        $set: { status: true, asistencia: [] },
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

    //creo una notificacion para el usuario
    if (!user.notificaciones) {
      user.notificaciones = [];
    }

    user.notificaciones.push({
      asunto: "Usuario registrado correctamente",
      cuerpo:
        "Usted ha sido registrado correctamente en la actividad, podrás ver los horarios en la sección de actividades, Recuerda que debes asistir a la actividad para que no seas deshabilitado, ademas de actualizar tu certificado de mucosis y pediculosis cada 1 mes, para mas información comunicate con el administrador del natatorio",
      fecha: dateNowSave,
    });

    user.inasistencias = [];
    user.asistencia = [];

    user.asistencia.push(dateNowSave);
    await user.save();

    console.log(user);

    return res.status(200).json({
      status: "success",
      message: "Usuario habilitado",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "error en el servidor",
    });
  }
};

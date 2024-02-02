export const initialState = {
  logged: false,
  role: "",
  user: {},
  actividadesUsuario: [],
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        logged: true,
        role: action.payload.role,
      };
    case "LOGOUT":
      return {
        ...state,
        logged: false,
        role: "usuario",
        user: {},
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
      };
    case "SET_ACTIVIDADES":
      return {
        ...state,
        actividadesUsuario: action.payload.actividadesUsuario,
      };
    default:
      return state;
  }
};

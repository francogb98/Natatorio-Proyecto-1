export const authReducer = (state, action) => {
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
    default:
      return state;
  }
};

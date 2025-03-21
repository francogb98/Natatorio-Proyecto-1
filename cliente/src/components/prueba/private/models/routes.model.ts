const ROUTES = {
  HOME: "/",
  QR: "/qr",
  USUARIO: {
    PERFIL: (id: string) => `/usuario/${id}`,
    FEEDS: "/usuario/feeds",
  },
  PETICIONES: "/peticiones",
  DASHBOARD: "/dashboard",
  USERS: {
    LIST: (filtro: string) => `/user-list/${filtro}`,
  },
  PILETAS: {
    LAYOUT: "/piletas",
    BUSCAR: "/buscar-pileta",
  },
  ACTIVIDADES: {
    BASE: "/actividades",
    LIST: "/actividades",
    CREAR: "/actividades/crear",
    EDITAR: (id: string) => `/actividades/editar/${id}`,
  },
};

export { ROUTES };

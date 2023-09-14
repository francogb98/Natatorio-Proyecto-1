//tengo que usar el valor d mis variables de entorno

// export const baseUrl = "https://api-club-atletico.herokuapp.com/";
// export const frontUrl = "https://club-atletico.vercel.app/";

//pero las tengo que agregar a traves de un archivo .env.local
//y en el archivo .env.local tengo que agregar las variables de entorno

//no me toma el valopr proceess.env.REACT_APP_API_URL

export const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
export const frontUrl = import.meta.env.VITE_REACT_APP_FRONT_URL;

// export const baseUrl = "http://localhost:4000/";
// export const frontUrl = "http://localhost:5173/";

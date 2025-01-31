export function capitalizeFirstLetter(string) {
  if (!string) return ""; // Maneja cadenas vacías o nulas
  return string.charAt(0).toUpperCase() + string.slice(1);
}

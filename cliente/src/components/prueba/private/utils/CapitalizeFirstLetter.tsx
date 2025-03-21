export function capitalizeFirstLetter(word: string) {
  if (!word) return ""; // Maneja cadenas vacías o nulas
  return word.charAt(0).toUpperCase() + word.slice(1);
}

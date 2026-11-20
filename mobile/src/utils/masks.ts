// "25122020" -> "25/12/2020"
export function maskDate(text: string): string {
  const d = text.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}
// "1430" -> "14:30"
export function maskTime(text: string): string {
  const d = text.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}:${d.slice(2)}`;
}

// Aceita só números e uma vírgula: "12,5"
export function maskWeight(text: string): string {
  const clean = text.replace(/[^0-9,]/g, '');
  const [int, ...rest] = clean.split(',');
  return rest.length ? `${int},${rest.join('').slice(0, 2)}` : int;
}
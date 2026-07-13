export function formatServicePrice(priceCents: number | null): string {
  if (priceCents === null) return 'Sob consulta';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceCents / 100);
}

export function formatServiceDuration(durationMinutes: number): string {
  if (durationMinutes < 60) return `~${durationMinutes} min`;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  if (minutes === 0) return `~${hours}h`;
  return `~${hours}h ${minutes}min`;
}

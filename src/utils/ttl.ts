export function parseTTL(ttl: string): number {
  const match = ttl.match(/^(\d+)([smhd])$/); // s = seconds, m = minutes, h = hours, d = days
  if (!match) throw new Error('Invalid TTL format');
  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    default:
      throw new Error('Unknown TTL unit');
  }
}

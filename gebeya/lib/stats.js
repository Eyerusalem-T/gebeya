export const DAY = 864e5;
export const avg = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);

// current = average of reports in the last 30 days; before = average of older reports.
export function summarize(prices, slug) {
  const now = Date.now();
  const rows = prices.filter((p) => p.item === slug);
  const current = avg(rows.filter((p) => now - p.at <= 30 * DAY).map((p) => p.price));
  const before = avg(rows.filter((p) => now - p.at > 30 * DAY).map((p) => p.price));
  const change = current != null && before ? ((current - before) / before) * 100 : null;
  return { count: rows.length, current, before, change };
}

export function weekly(prices, slug, n = 8) {
  const now = Date.now();
  const rows = prices.filter((p) => p.item === slug);
  return Array.from({ length: n }, (_, k) => {
    const w = n - 1 - k;
    const r = rows.filter((p) => now - p.at >= w * 7 * DAY && now - p.at < (w + 1) * 7 * DAY);
    return { label: w === 0 ? 'now' : `${w}w`, value: avg(r.map((p) => p.price)) };
  });
}

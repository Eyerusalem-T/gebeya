const d = new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium' });
export const fmtDate = (t) => d.format(t);
export const etb = (n, digits = 2) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);

/** Digits-only international form for tel:/wa.me links; bare 10-digit Indian numbers get +91. */
export function intlPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

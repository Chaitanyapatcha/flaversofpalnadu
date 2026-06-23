export const ADMIN_EMAIL = 'admin@flavoursofpalnadu.com'

export function isAdmin(email: string | null | undefined): boolean {
  return email === ADMIN_EMAIL
}

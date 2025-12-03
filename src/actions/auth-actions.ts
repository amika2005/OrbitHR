// Temporarily disabled to fix build
export async function requestPasswordReset(email: string) {
  return { success: false, error: "Feature temporarily disabled" };
}

export async function resetPassword(token: string, newPassword: string) {
  return { success: false, error: "Feature temporarily disabled" };
}

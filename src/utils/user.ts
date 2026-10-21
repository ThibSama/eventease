// ============================================================================
// IDENTIFIANTS UTILISATEUR
// ============================================================================

export function createUserId() {
  return `user-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

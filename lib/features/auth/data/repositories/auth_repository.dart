abstract class AuthRepository {
  /// Email / password login
  Future<void> signIn({
    required String email,
    required String password,
  });

  /// Google OAuth → exchange authorization code for tokens
  Future<void> exchangeCodeForToken({
    required String authorizationCode,
    String? username,
  });
}
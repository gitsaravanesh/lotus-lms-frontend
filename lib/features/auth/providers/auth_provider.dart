import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/datasources/cognito_datasource.dart';
import '../data/repositories/auth_repository_impl.dart';
import 'auth_state.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lotus_lms/core/config/cognito_config.dart';
import 'package:lotus_lms/features/auth/data/repositories/auth_repository.dart';
import 'package:lotus_lms/features/auth/presentation/providers/auth_state.dart';

final authProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authRepository = ref.read(authRepositoryProvider);
  return AuthNotifier(authRepository);
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _authRepository;

  AuthNotifier(this._authRepository)
      : super(const AuthState.initial());

  // ======================================================
  // 🔐 EMAIL / PASSWORD SIGNUP (DIRECT USER POOL)
  // ======================================================
  Future<void> signUp({
    required String username,
    required String email,
    required String password,
    String? topic,
  }) async {
    state = const AuthState.loading();

    try {
      await _authRepository.signUpWithEmail(
        userPoolId: CognitoConfig.directUserPoolId,
        clientId: CognitoConfig.directClientId,
        username: username,
        email: email,
        password: password,
        topic: topic,
      );

      state = const AuthState.signupSuccess(
        message:
            'Signup successful! Please check your email to verify your account.',
      );
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  // ======================================================
  // 🌐 GOOGLE SIGNUP (HOSTED UI – GOOGLE USER POOL)
  // ======================================================
  String getGoogleOAuthUrl() {
    final redirectUri = Uri.base.origin + '/callback';

    final uri = Uri.parse(
      '${CognitoConfig.googleDomain}/oauth2/authorize',
    ).replace(queryParameters: {
      'response_type': 'code',
      'client_id': CognitoConfig.googleOAuthClientId,
      'redirect_uri': redirectUri,
      'scope': CognitoConfig.googleScopes.join(' '),
      'identity_provider': 'Google',
    });

    return uri.toString();
  }

  // ======================================================
  // 🔑 EMAIL / PASSWORD LOGIN (DIRECT USER POOL)
  // ======================================================
  Future<void> login({
    required String username,
    required String password,
  }) async {
    state = const AuthState.loading();

    try {
      await _authRepository.loginWithEmail(
        userPoolId: CognitoConfig.directUserPoolId,
        clientId: CognitoConfig.directClientId,
        username: username,
        password: password,
      );

      state = const AuthState.authenticated();
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  // ======================================================
  // 🚪 LOGOUT (POOL-AGNOSTIC)
  // ======================================================
  Future<void> logout() async {
    await _authRepository.logout();
    state = const AuthState.unauthenticated();
  }
}
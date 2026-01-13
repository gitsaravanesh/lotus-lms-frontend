import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../data/datasources/cognito_datasource.dart';
import '../data/repositories/auth_repository_impl.dart';
import 'auth_state.dart';

final authProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final dataSource = CognitoDataSource(
    userPoolId: AppConstants.userPoolId,
    clientId: AppConstants.clientId,
    domain: AppConstants.cognitoDomain,
    redirectUri: AppConstants.cognitoRedirectUri,
    logoutRedirectUri: AppConstants.cognitoLogoutRedirectUri,
  );

  final repository = AuthRepositoryImpl(
    cognitoDataSource: dataSource,
  );

  return AuthNotifier(repository);
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepositoryImpl _repo;

  AuthNotifier(this._repo) : super(const AuthState.initial());

  Future<void> signUp({
    required String username,
    required String email,
    required String password,
    String? topic,
  }) async {
    state = const AuthState.loading();
    try {
      await _repo.signUp(
        username: username,
        email: email,
        password: password,
        topic: topic,
      );
      state = const AuthState.unauthenticated();
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<void> signIn({
    required String identifier,
    required String password,
  }) async {
    state = const AuthState.loading();
    try {
      final session = await _repo.signIn(
        identifier: identifier,
        password: password,
      );
      state = AuthState.authenticated(session);
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<void> signOut() async {
    await _repo.signOut();
    state = const AuthState.unauthenticated();
  }

  String getGoogleOAuthUrl() => _repo.getHostedUIUrl();

  String getLogoutUrl() => _repo.getLogoutUrl();

  Future<void> exchangeCodeForToken(
    String code,
    String? studentUsername,
  ) async {
    state = const AuthState.loading();
    try {
      final session = await _repo.exchangeCodeForToken(
        code: code,
        studentUsername: studentUsername,
      );
      state = AuthState.authenticated(session);
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }
}
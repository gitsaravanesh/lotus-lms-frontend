import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/datasources/cognito_datasource.dart';
import '../data/repositories/auth_repository_impl.dart';
import 'auth_state.dart';

final authProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final dataSource = CognitoDataSource(
    userPoolId: 'YOUR_USER_POOL_ID',
    clientId: 'YOUR_CLIENT_ID',
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
      await _repo.signIn(
        identifier: identifier,
        password: password,
      );
      state = const AuthState.authenticated();
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<void> signOut() async {
    await _repo.signOut();
    state = const AuthState.unauthenticated();
  }
}
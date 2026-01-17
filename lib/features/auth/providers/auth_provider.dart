import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/datasources/auth_remote_datasource.dart';
import '../data/repositories/auth_repository.dart';
import '../data/repositories/auth_repository_impl.dart';
import '../presentation/providers/auth_state.dart';

final authRemoteDataSourceProvider =
    Provider<AuthRemoteDataSource>((ref) {
  return AuthRemoteDataSource();
});

final authRepositoryProvider =
    Provider<AuthRepository>((ref) {
  final remote = ref.read(authRemoteDataSourceProvider);
  return AuthRepositoryImpl(remote);
});

final authProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repo = ref.read(authRepositoryProvider);
  return AuthNotifier(repo);
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthNotifier(this._repository)
      : super(const AuthState.initial());

  Future<void> signIn(String email, String password) async {
    try {
      state = const AuthState.loading();
      await _repository.signIn(
        email: email,
        password: password,
      );
      state = const AuthState.authenticated();
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<void> exchangeCodeForToken(
    String code,
    String? username,
  ) async {
    try {
      state = const AuthState.loading();
      await _repository.exchangeCodeForToken(
        authorizationCode: code,
        username: username,
      );
      state = const AuthState.authenticated();
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    state = const AuthState.initial();
  }
}
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/datasources/cognito_datasource.dart';
import '../data/datasources/auth_remote_datasource.dart';
import '../data/repositories/auth_repository_impl.dart';
import '../domain/repositories/auth_repository.dart';
import '../domain/entities/user.dart';
import 'auth_state.dart';

/// Cognito Data Source Provider
final cognitoDataSourceProvider = Provider<CognitoDataSource>((ref) {
  return CognitoDataSource();
});

/// Auth Remote Data Source Provider
final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  return AuthRemoteDataSource();
});

/// Auth Repository Provider
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    cognitoDataSource: ref.read(cognitoDataSourceProvider),
    remoteDataSource: ref.read(authRemoteDataSourceProvider),
  );
});

/// Auth State Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;
  
  AuthNotifier(this._repository) : super(const AuthState.initial()) {
    _checkAuthStatus();
  }
  
  /// Check initial auth status
  Future<void> _checkAuthStatus() async {
    try {
      state = const AuthState.loading();
      final user = await _repository.getCurrentUser();
      if (user != null) {
        state = AuthState.authenticated(user);
      } else {
        state = const AuthState.unauthenticated();
      }
    } catch (e) {
      state = const AuthState.unauthenticated();
    }
  }
  
  /// Sign up with email and password
  Future<void> signUp({
    required String username,
    required String email,
    required String password,
    String? topic,
  }) async {
    try {
      state = const AuthState.loading();
      await _repository.signUp(
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
  
  /// Sign in with email/username and password
  Future<void> signIn({
    required String identifier,
    required String password,
  }) async {
    try {
      state = const AuthState.loading();
      final user = await _repository.signIn(
        identifier: identifier,
        password: password,
      );
      state = AuthState.authenticated(user);
    } catch (e) {
      state = AuthState.error(_parseErrorMessage(e.toString()));
      // Reset to unauthenticated after showing error
      Future.delayed(const Duration(seconds: 3), () {
        if (state is _Error) {
          state = const AuthState.unauthenticated();
        }
      });
    }
  }
  
  /// Exchange OAuth code for tokens
  Future<void> exchangeCodeForToken(String code, String? pendingUsername) async {
    try {
      state = const AuthState.loading();
      final user = await _repository.exchangeCodeForToken(code, pendingUsername);
      state = AuthState.authenticated(user);
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }
  
  /// Sign out
  Future<void> signOut() async {
    try {
      await _repository.signOut();
      state = const AuthState.unauthenticated();
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }
  
  /// Get Google OAuth URL
  String getGoogleOAuthUrl() {
    return _repository.getGoogleOAuthUrl();
  }
  
  /// Parse error messages
  String _parseErrorMessage(String error) {
    if (error.contains('UserNotConfirmedException')) {
      return 'Please verify your email address first.';
    } else if (error.contains('UserNotFoundException')) {
      return 'Account not found. Try signing up first or use Google login.';
    } else if (error.contains('NotAuthorizedException')) {
      return 'Incorrect username or password.';
    } else if (error.contains('tenant')) {
      return 'Your account is not assigned to any organization. Please contact support.';
    }
    return 'Login failed. Please try again.';
  }
}

/// Auth State Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authRepositoryProvider));
});

/// Current User Provider (convenience)
final currentUserProvider = Provider<User?>((ref) {
  final authState = ref.watch(authProvider);
  return authState.maybeWhen(
    authenticated: (user) => user,
    orElse: () => null,
  );
});

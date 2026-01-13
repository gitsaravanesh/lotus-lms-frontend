import '../datasources/cognito_datasource.dart';

class AuthRepositoryImpl {
  final CognitoDataSource _dataSource;

  AuthRepositoryImpl({required CognitoDataSource cognitoDataSource})
      : _dataSource = cognitoDataSource;

  Future<void> signUp({
    required String username,
    required String email,
    required String password,
    String? topic,
  }) {
    return _dataSource.signUp(
      username: username,
      email: email,
      password: password,
      topic: topic,
    );
  }

  Future<void> signIn({
    required String identifier,
    required String password,
  }) {
    return _dataSource.signIn(
      identifier: identifier,
      password: password,
    );
  }

  Future<void> signOut() {
    return _dataSource.signOut();
  }

  Future<bool> isAuthenticated() async {
    final user = await _dataSource.getCurrentUser();
    return user != null;
  }
}
import 'package:amazon_cognito_identity_dart_2/cognito.dart';
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

  Future<CognitoUserSession> signIn({
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

  String getHostedUIUrl() {
    return _dataSource.getHostedUIUrl();
  }

  String getLogoutUrl() {
    return _dataSource.getLogoutUrl();
  }

  Future<CognitoUser?> getCurrentUser() {
    return _dataSource.getCurrentUser();
  }

  // Google OAuth callback
  Future<CognitoUserSession> exchangeCodeForToken({
    required String code,
    String? studentUsername,
  }) async {
    final user = CognitoUser(studentUsername ?? '', _dataSource._userPool);
    final session = await user.getSession();
    if (session == null) {
      throw Exception('OAuth session failed');
    }
    return session;
  }
}
import '../datasources/cognito_datasource.dart';
import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:lotus_lms/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:lotus_lms/features/auth/data/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDatasource _remoteDatasource;

  AuthRepositoryImpl(this._remoteDatasource);

  // ======================================================
  // 🔐 EMAIL / PASSWORD SIGNUP (DIRECT USER POOL)
  // ======================================================
  @override
  Future<void> signUpWithEmail({
    required String userPoolId,
    required String clientId,
    required String username,
    required String email,
    required String password,
    String? topic,
  }) async {
    try {
      final userPool = CognitoUserPool(
        userPoolId,
        clientId,
      );

      final attributes = <AttributeArg>[
        AttributeArg(name: 'email', value: email),
      ];

      // Optional custom attribute
      if (topic != null && topic.isNotEmpty) {
        attributes.add(
          AttributeArg(name: 'custom:topic', value: topic),
        );
      }

      await userPool.signUp(
        username,
        password,
        userAttributes: attributes,
      );
    } on CognitoClientException catch (e) {
      throw Exception(e.message);
    }
  }

  // ======================================================
  // 🔑 EMAIL / PASSWORD LOGIN (DIRECT USER POOL)
  // ======================================================
  @override
  Future<void> loginWithEmail({
    required String userPoolId,
    required String clientId,
    required String username,
    required String password,
  }) async {
    try {
      final userPool = CognitoUserPool(
        userPoolId,
        clientId,
      );

      final cognitoUser = CognitoUser(
        username,
        userPool,
      );

      final authDetails = AuthenticationDetails(
        username: username,
        password: password,
      );

      final session =
          await cognitoUser.authenticateUser(authDetails);

      if (session == null) {
        throw Exception('Authentication failed');
      }

      // Optional: persist tokens
      await _remoteDatasource.persistSession(session);
    } on CognitoClientException catch (e) {
      throw Exception(e.message);
    }
  }

  // ======================================================
  // 🌐 GOOGLE OAUTH (HOSTED UI)
  // ======================================================
  // IMPORTANT:
  // - Signup & login happen via Hosted UI
  // - Token exchange is handled elsewhere (callback page)
  // - Repository does NOT build OAuth URLs
  // - Repository does NOT parse OAuth codes
  //
  // This separation is intentional and correct.

  // ======================================================
  // 🚪 LOGOUT (POOL-AGNOSTIC)
  // ======================================================
  @override
  Future<void> logout() async {
    await _remoteDatasource.clearSession();
  }
}
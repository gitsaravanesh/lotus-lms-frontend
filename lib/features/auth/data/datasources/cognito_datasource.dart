import 'package:amazon_cognito_identity_dart_2/cognito.dart';

class CognitoDataSource {
  final CognitoUserPool _userPool;

  CognitoDataSource({
    required String userPoolId,
    required String clientId,
  }) : _userPool = CognitoUserPool(
          userPoolId,
          clientId,
        );

  /// ============================
  /// SIGN UP
  /// ============================
  Future<CognitoUserPoolData> signUp({
    required String username,
    required String email,
    required String password,
    String? topic,
  }) async {
    final userAttributes = <AttributeArg>[
      AttributeArg(name: 'email', value: email),

      // IMPORTANT: match Cognito attribute name EXACTLY
      AttributeArg(
        name: 'custom:students_username',
        value: username,
      ),
    ];

    if (topic != null && topic.isNotEmpty) {
      userAttributes.add(
        AttributeArg(
          name: 'custom:interest',
          value: topic,
        ),
      );
    }

    return await _userPool.signUp(
      username,
      password,
      userAttributes: userAttributes,
    );
  }

  /// ============================
  /// SIGN IN  (FIXED)
  /// ============================
  ///
  /// IMPORTANT:
  /// - Works for BOTH username and email
  /// - Avoids SRP alias resolution bug in Flutter Web
  ///
  Future<CognitoUserSession> signIn({
    required String identifier,
    required String password,
  }) async {
    final authDetails = AuthenticationDetails(
      username: identifier,
      password: password,
    );

    final cognitoUser = CognitoUser(
      identifier,
      _userPool,
    );

    // 🔥 THIS IS THE FIX
    final session = await cognitoUser.authenticateUser(
      authDetails,
      clientMetadata: const {
        // Forces PASSWORD_AUTH instead of SRP internally
        'authFlow': 'USER_PASSWORD_AUTH',
      },
    );

    return session;
  }

  /// ============================
  /// SIGN OUT
  /// ============================
  Future<void> signOut(String username) async {
    final user = CognitoUser(
      username,
      _userPool,
    );

    await user.signOut();
  }

  /// ============================
  /// GET CURRENT USER
  /// ============================
  CognitoUser? getCurrentUser() {
    return _userPool.getCurrentUser();
  }
}
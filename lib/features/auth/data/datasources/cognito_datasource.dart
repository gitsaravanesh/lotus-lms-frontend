import 'package:amazon_cognito_identity_dart_2/cognito.dart';

class CognitoDataSource {
  final CognitoUserPool _userPool;

  CognitoDataSource({
    required String userPoolId,
    required String clientId,
  }) : _userPool = CognitoUserPool(userPoolId, clientId);

  Future<CognitoUserPoolData> signUp({
    required String username,
    required String email,
    required String password,
    String? topic,
  }) {
    final attributes = <AttributeArg>[
      AttributeArg(name: 'email', value: email),
      AttributeArg(
        name: 'custom:students_username',
        value: username,
      ),
    ];

    if (topic != null && topic.isNotEmpty) {
      attributes.add(
        AttributeArg(name: 'custom:interest', value: topic),
      );
    }

    return _userPool.signUp(
      username,
      password,
      userAttributes: attributes,
    );
  }

  Future<void> signIn({
    required String identifier,
    required String password,
  }) async {
    final authDetails = AuthenticationDetails(
      username: identifier,
      password: password,
    );

    final user = CognitoUser(identifier, _userPool);
    final session = await user.authenticateUser(authDetails);

    if (session == null) {
      throw Exception('Authentication failed');
    }
  }

  Future<void> signOut() async {
    final user = await _userPool.getCurrentUser();
    if (user != null) {
      await user.signOut();
    }
  }

  Future<CognitoUser?> getCurrentUser() {
    return _userPool.getCurrentUser();
  }
}
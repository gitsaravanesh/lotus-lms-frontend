import 'package:amazon_cognito_identity_dart_2/cognito.dart';

class CognitoDataSource {
  final CognitoUserPool _userPool;

  // These are needed for Hosted UI URL generation
  final String _clientId;
  final String _domain;
  final String _redirectUri;

  CognitoDataSource({
    required String userPoolId,
    required String clientId,
    required String domain,
    required String redirectUri,
  })  : _clientId = clientId,
        _domain = domain,
        _redirectUri = redirectUri,
        _userPool = CognitoUserPool(
          userPoolId,
          clientId,
        );

  // ===============================
  // SIGN UP
  // ===============================
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
        AttributeArg(
          name: 'custom:interest',
          value: topic,
        ),
      );
    }

    return _userPool.signUp(
      username,
      password,
      userAttributes: attributes,
    );
  }

  // ===============================
  // SIGN IN
  // ===============================
  Future<void> signIn({
    required String identifier,
    required String password,
  }) async {
    final authDetails = AuthenticationDetails(
      username: identifier,
      password: password,
    );

    final user = CognitoUser(
      identifier,
      _userPool,
    );

    final session = await user.authenticateUser(authDetails);

    if (session == null) {
      throw Exception('Authentication failed');
    }
  }

  // ===============================
  // SIGN OUT
  // ===============================
  Future<void> signOut() async {
    final user = await _userPool.getCurrentUser();
    if (user != null) {
      await user.signOut();
    }
  }

  // ===============================
  // CURRENT USER
  // ===============================
  Future<CognitoUser?> getCurrentUser() {
    return _userPool.getCurrentUser();
  }

  // ===============================
  // HOSTED UI URL (Google OAuth)
  // ===============================
  String getHostedUIUrl() {
    return 'https://$_domain/login'
        '?client_id=$_clientId'
        '&response_type=code'
        '&scope=email+openid+profile'
        '&redirect_uri=$_redirectUri';
  }
}
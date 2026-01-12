import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import '../../../../core/config/cognito_config.dart';

/// Cognito Data Source for authentication
class CognitoDataSource {
  late final CognitoUserPool _userPool;
  
  CognitoDataSource() {
    _userPool = CognitoUserPool(
      CognitoConfig.userPoolId,
      CognitoConfig.clientId,
    );
  }
  
  /// Sign up with email and password
  Future<CognitoUserPoolData> signUp({
  required String username,
  required String email,
  required String password,
  String? topic,
}) async {
  final userAttributes = [
    AttributeArg(name: 'email', value: email),

    /// ✅ ADD THIS LINE
    AttributeArg(name: 'custom:student_username', value: username),
  ];

  if (topic != null && topic.isNotEmpty) {
    userAttributes.add(
      AttributeArg(name: 'custom:interest', value: topic),
    );
  }

  return await _userPool.signUp(
    username, // Cognito login username
    password,
    userAttributes: userAttributes,
  );
}
  
  /// Sign in with email/username and password
  Future<CognitoUserSession?> signIn({
    required String identifier,
    required String password,
  }) async {
    final cognitoUser = CognitoUser(
      identifier,
      _userPool,
    );
    
    final authDetails = AuthenticationDetails(
      username: identifier,
      password: password,
    );
    
    return await cognitoUser.authenticateUser(authDetails);
  }
  
  /// Get current user session
  Future<CognitoUserSession?> getCurrentSession() async {
    final cognitoUser = await _userPool.getCurrentUser();
    if (cognitoUser == null) return null;
    
    return await cognitoUser.getSession();
  }
  
  /// Sign out
  Future<void> signOut() async {
    final cognitoUser = await _userPool.getCurrentUser();
    if (cognitoUser != null) {
      await cognitoUser.signOut();
    }
  }
  
  /// Get Hosted UI login URL for Google OAuth
  String getHostedUIUrl() {
    final params = {
      'client_id': CognitoConfig.clientId,
      'response_type': 'code',
      'scope': CognitoConfig.scopes.join('+'),
      'redirect_uri': CognitoConfig.redirectUri,
      'identity_provider': CognitoConfig.googleProvider,
    };
    
    final queryString = params.entries
        .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
        .join('&');
    
    return 'https://${CognitoConfig.cognitoDomain}/oauth2/authorize?$queryString';
  }
  
  /// Get logout URL
  String getLogoutUrl() {
    final params = {
      'client_id': CognitoConfig.clientId,
      'logout_uri': Uri.encodeComponent(CognitoConfig.signoutUri),
    };
    
    final queryString = params.entries
        .map((e) => '${e.key}=${e.value}')
        .join('&');
    
    return 'https://${CognitoConfig.cognitoDomain}/logout?$queryString';
  }
}

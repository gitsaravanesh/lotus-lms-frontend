import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:logger/logger.dart';
import '../../../../core/config/cognito_config.dart';

/// Cognito Data Source for authentication
class CognitoDataSource {
  late final CognitoUserPool _userPool;
  final Logger _logger = Logger();
  
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
    ];
    
    if (topic != null && topic.isNotEmpty) {
      userAttributes.add(
        AttributeArg(name: 'custom:interest', value: topic),
      );
    }
    
    return await _userPool.signUp(
      username,
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
    // Don't URL-encode the scope value since it uses + as separator
    final scopeParam = CognitoConfig.scopes.join('+');
    
    final params = {
      'client_id': Uri.encodeComponent(CognitoConfig.clientId),
      'response_type': 'code',
      'scope': scopeParam,  // Don't encode - use + separator as-is
      'redirect_uri': Uri.encodeComponent(CognitoConfig.redirectUri),
      'identity_provider': CognitoConfig.googleProvider,
    };
    
    final queryString = params.entries
        .map((e) => '${e.key}=${e.value}')
        .join('&');
    
    final url = 'https://${CognitoConfig.cognitoDomain}/oauth2/authorize?$queryString';
    
    // Debug logging
    _logger.d('OAuth URL generated: $url');
    _logger.d('Scopes: ${CognitoConfig.scopes}');
    _logger.d('Redirect URI: ${CognitoConfig.redirectUri}');
    
    return url;
  }
  
  /// Get logout URL
  String getLogoutUrl() {
    final params = {
      'client_id': Uri.encodeComponent(CognitoConfig.clientId),
      'logout_uri': Uri.encodeComponent(CognitoConfig.signoutUri),
    };
    
    final queryString = params.entries
        .map((e) => '${e.key}=${e.value}')
        .join('&');
    
    return 'https://${CognitoConfig.cognitoDomain}/logout?$queryString';
  }
}

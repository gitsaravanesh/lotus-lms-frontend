/// AWS Cognito Configuration
class CognitoConfig {
  static const String userPoolId = 'ap-south-1_6C5lP9yfm';
  static const String clientId = '49gusp4sidkggc371vghtdvujb';
  static const String region = 'ap-south-1';
  static const String cognitoDomain = 'lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com';
  static const String redirectUri = 'https://dodyqytcfhwoe.cloudfront.net/';
  static const String signoutUri = 'https://dodyqytcfhwoe.cloudfront.net/';
  
  static const List<String> scopes = ['email', 'openid', 'profile'];
  
  // Google OAuth provider
  static const String googleProvider = 'Google';
}

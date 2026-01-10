import 'package:flutter_dotenv/flutter_dotenv.dart';

/// AWS Cognito Configuration
class CognitoConfig {
  // Read from environment variables with defaults from React .env
  static String get userPoolId => 
    dotenv.env['USER_POOL_ID'] ?? 
    dotenv.env['REACT_APP_USER_POOL_ID'] ?? 
    'ap-south-1_6C5lP9yfm';  // Updated to original user pool
    
  static String get clientId => 
    dotenv.env['CLIENT_ID'] ?? 
    dotenv.env['REACT_APP_CLIENT_ID'] ?? 
    '5ppt7ntr3a3ckvc670v71h920r';  // Updated to original client ID
    
  static String get region => 
    dotenv.env['AWS_REGION'] ?? 
    dotenv.env['REACT_APP_REGION'] ?? 
    'ap-south-1';
    
  static String get cognitoDomain {
    var domain = dotenv.env['COGNITO_DOMAIN'] ?? 
                 dotenv.env['REACT_APP_COGNITO_DOMAIN'] ?? 
                 'lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com';
    
    // Remove https:// or http:// prefix if present (React format includes it, Flutter doesn't need it)
    return domain.replaceFirst(RegExp(r'^https?://'), '');
  }
    
  static String get redirectUri => 
    dotenv.env['REDIRECT_URI'] ?? 
    dotenv.env['REACT_APP_REDIRECT_URL'] ?? 
    'https://dodyqytcfhwoe.cloudfront.net/';
    
  static String get signoutUri => 
    dotenv.env['SIGNOUT_URL'] ?? 
    dotenv.env['REACT_APP_SIGNOUT_URL'] ?? 
    'https://dodyqytcfhwoe.cloudfront.net/';
  
  static const List<String> scopes = ['email', 'openid', 'profile'];
  
  // Google OAuth provider
  static const String googleProvider = 'Google';
}

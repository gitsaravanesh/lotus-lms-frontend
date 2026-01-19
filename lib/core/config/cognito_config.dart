import 'package:flutter_dotenv/flutter_dotenv.dart';

/// AWS Cognito Configuration
class CognitoConfig {
  // Read from environment variables with defaults from React .env
  // Replace with your actual User Pool ID
  static const String userPoolId = 'ap-south-1_kaEBPbIxW';

  // App client for email/password signup & login
  static const String directAuthClientId =
      '78cfqtlh63cj8q8eht4hka7om7';

  // App client for Hosted UI / Google OAuth
  static const String oauthClientId =
      '1d46et2aoichnr8jbupvldi0c3';
    
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

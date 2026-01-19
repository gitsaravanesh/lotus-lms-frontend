import 'package:flutter_dotenv/flutter_dotenv.dart';

/// AWS Cognito Configuration
class CognitoConfig {
  // --------------------------------------------------
  // USER POOL ID
  // Flutter env > React env > fallback
  // --------------------------------------------------
  static String get userPoolId =>
      dotenv.env['COGNITO_USER_POOL_ID'] ??
      dotenv.env['REACT_APP_COGNITO_USER_POOL_ID'] ??
      'ap-south-1_kaEBPbIxW';

  // --------------------------------------------------
  // DIRECT AUTH CLIENT ID (email/password)
  // --------------------------------------------------
  static String get directAuthClientId =>
      dotenv.env['DIRECT_AUTH_CLIENT_ID'] ??
      dotenv.env['REACT_APP_DIRECT_AUTH_CLIENT_ID'] ??
      '78cfqtlh63cj8q8eht4hka7om7';

  // --------------------------------------------------
  // OAUTH CLIENT ID (Hosted UI / Google)
  // --------------------------------------------------
  static String get oauthClientId =>
      dotenv.env['OAUTH_CLIENT_ID'] ??
      dotenv.env['REACT_APP_OAUTH_CLIENT_ID'] ??
      '1d46et2aoichnr8jbupvldi0c3';

  // --------------------------------------------------
  // BACKWARD COMPATIBILITY (tests expect this)
  // --------------------------------------------------
  static String get clientId => directAuthClientId;

  // --------------------------------------------------
  // REGION
  // --------------------------------------------------
  static String get region =>
      dotenv.env['AWS_REGION'] ??
      dotenv.env['REACT_APP_REGION'] ??
      'ap-south-1';

  // --------------------------------------------------
  // COGNITO DOMAIN (strip protocol)
  // --------------------------------------------------
  static String get cognitoDomain {
    final domain =
        dotenv.env['COGNITO_DOMAIN'] ??
        dotenv.env['REACT_APP_COGNITO_DOMAIN'] ??
        'lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com';

    return domain.replaceFirst(RegExp(r'^https?://'), '');
  }

  // --------------------------------------------------
  // REDIRECT URI
  // --------------------------------------------------
  static String get redirectUri =>
      dotenv.env['REDIRECT_URI'] ??
      dotenv.env['REACT_APP_REDIRECT_URL'] ??
      'https://dodyqytcfhwoe.cloudfront.net/';

  // --------------------------------------------------
  // SIGNOUT URI
  // --------------------------------------------------
  static String get signoutUri =>
      dotenv.env['SIGNOUT_URL'] ??
      dotenv.env['REACT_APP_SIGNOUT_URL'] ??
      'https://dodyqytcfhwoe.cloudfront.net/';

  // --------------------------------------------------
  // SCOPES (tests expect this exact list)
  // --------------------------------------------------
  static const List<String> scopes = [
    'email',
    'openid',
    'profile',
  ];

  // --------------------------------------------------
  // GOOGLE PROVIDER (tests expect this)
  // --------------------------------------------------
  static const String googleProvider = 'Google';
}
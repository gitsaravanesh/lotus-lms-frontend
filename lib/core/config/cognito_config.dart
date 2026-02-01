import 'dart:io';

class CognitoConfig {
  static const DIRECT_AUTH_CLIENT_ID = Platform.environment['DIRECT_AUTH_CLIENT_ID'] ?? '';
  static const OAUTH_CLIENT_ID = Platform.environment['OAUTH_CLIENT_ID'] ?? '';
}
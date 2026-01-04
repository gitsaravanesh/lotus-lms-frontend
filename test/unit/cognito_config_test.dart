import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:lotus_lms/core/config/cognito_config.dart';

void main() {
  group('CognitoConfig Environment Variable Tests', () {
    setUp(() {
      // Reset dotenv before each test
      dotenv.testLoad(fileInput: '');
    });

    test('should use Flutter-style environment variables when available', () {
      // Arrange
      dotenv.testLoad(fileInput: '''
USER_POOL_ID=ap-south-1_flutter_test
CLIENT_ID=flutter_client_test
AWS_REGION=us-west-2
COGNITO_DOMAIN=test.auth.us-west-2.amazoncognito.com
REDIRECT_URI=https://flutter.test/
SIGNOUT_URL=https://flutter.test/logout
''');

      // Act & Assert
      expect(CognitoConfig.userPoolId, 'ap-south-1_flutter_test');
      expect(CognitoConfig.clientId, 'flutter_client_test');
      expect(CognitoConfig.region, 'us-west-2');
      expect(CognitoConfig.cognitoDomain, 'test.auth.us-west-2.amazoncognito.com');
      expect(CognitoConfig.redirectUri, 'https://flutter.test/');
      expect(CognitoConfig.signoutUri, 'https://flutter.test/logout');
    });

    test('should fallback to React-style environment variables when Flutter variables not set', () {
      // Arrange
      dotenv.testLoad(fileInput: '''
REACT_APP_USER_POOL_ID=ap-south-1_react_test
REACT_APP_CLIENT_ID=react_client_test
REACT_APP_REGION=eu-west-1
REACT_APP_COGNITO_DOMAIN=https://react.auth.eu-west-1.amazoncognito.com
REACT_APP_REDIRECT_URL=https://react.test/
REACT_APP_SIGNOUT_URL=https://react.test/logout
''');

      // Act & Assert
      expect(CognitoConfig.userPoolId, 'ap-south-1_react_test');
      expect(CognitoConfig.clientId, 'react_client_test');
      expect(CognitoConfig.region, 'eu-west-1');
      // React domain has https:// prefix which should be stripped
      expect(CognitoConfig.cognitoDomain, 'react.auth.eu-west-1.amazoncognito.com');
      expect(CognitoConfig.redirectUri, 'https://react.test/');
      expect(CognitoConfig.signoutUri, 'https://react.test/logout');
    });

    test('should use default values from React .env when no environment variables set', () {
      // Arrange
      dotenv.testLoad(fileInput: '');

      // Act & Assert
      expect(CognitoConfig.userPoolId, 'ap-south-1_6C5lP9yfm');
      expect(CognitoConfig.clientId, '49gusp4sidkggc371vghtdvujb');
      expect(CognitoConfig.region, 'ap-south-1');
      expect(CognitoConfig.cognitoDomain, 'lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com');
      expect(CognitoConfig.redirectUri, 'https://dodyqytcfhwoe.cloudfront.net/');
      expect(CognitoConfig.signoutUri, 'https://dodyqytcfhwoe.cloudfront.net/');
    });

    test('should prefer Flutter variables over React variables when both are set', () {
      // Arrange
      dotenv.testLoad(fileInput: '''
USER_POOL_ID=ap-south-1_flutter
REACT_APP_USER_POOL_ID=ap-south-1_react
CLIENT_ID=flutter_client
REACT_APP_CLIENT_ID=react_client
''');

      // Act & Assert
      expect(CognitoConfig.userPoolId, 'ap-south-1_flutter');
      expect(CognitoConfig.clientId, 'flutter_client');
    });

    test('should have correct scopes', () {
      expect(CognitoConfig.scopes, ['email', 'openid', 'profile']);
    });

    test('should have correct Google provider', () {
      expect(CognitoConfig.googleProvider, 'Google');
    });

    test('should strip https:// protocol from cognitoDomain', () {
      // Arrange
      dotenv.testLoad(fileInput: '''
COGNITO_DOMAIN=https://test.domain.com
''');

      // Act & Assert
      expect(CognitoConfig.cognitoDomain, 'test.domain.com');
    });

    test('should strip http:// protocol from cognitoDomain', () {
      // Arrange
      dotenv.testLoad(fileInput: '''
COGNITO_DOMAIN=http://test.domain.com
''');

      // Act & Assert
      expect(CognitoConfig.cognitoDomain, 'test.domain.com');
    });
  });
}

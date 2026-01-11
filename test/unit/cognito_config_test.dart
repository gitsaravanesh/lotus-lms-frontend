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
USER_POOL_ID=ap-south-1_TestPool123
CLIENT_ID=test_client_flutter_123
AWS_REGION=ap-south-1
COGNITO_DOMAIN=test-flutter.auth.ap-south-1.amazoncognito.com
REDIRECT_URI=https://flutter.test.example.com/
SIGNOUT_URL=https://flutter.test.example.com/logout
''');

      // Act & Assert
      expect(CognitoConfig.userPoolId, 'ap-south-1_TestPool123');
      expect(CognitoConfig.clientId, 'test_client_flutter_123');
      expect(CognitoConfig.region, 'ap-south-1');
      expect(CognitoConfig.cognitoDomain, 'test-flutter.auth.ap-south-1.amazoncognito.com');
      expect(CognitoConfig.redirectUri, 'https://flutter.test.example.com/');
      expect(CognitoConfig.signoutUri, 'https://flutter.test.example.com/logout');
    });

    test('should fallback to React-style environment variables when Flutter variables not set', () {
      // Arrange
      dotenv.testLoad(fileInput: '''
REACT_APP_USER_POOL_ID=ap-south-1_ReactPool456
REACT_APP_CLIENT_ID=test_client_react_456
REACT_APP_REGION=ap-south-1
REACT_APP_COGNITO_DOMAIN=https://test-react.auth.ap-south-1.amazoncognito.com
REACT_APP_REDIRECT_URL=https://react.test.example.com/
REACT_APP_SIGNOUT_URL=https://react.test.example.com/logout
''');

      // Act & Assert
      expect(CognitoConfig.userPoolId, 'ap-south-1_ReactPool456');
      expect(CognitoConfig.clientId, 'test_client_react_456');
      expect(CognitoConfig.region, 'ap-south-1');
      // React domain has https:// prefix which should be stripped
      expect(CognitoConfig.cognitoDomain, 'test-react.auth.ap-south-1.amazoncognito.com');
      expect(CognitoConfig.redirectUri, 'https://react.test.example.com/');
      expect(CognitoConfig.signoutUri, 'https://react.test.example.com/logout');
    });

    test('should use default values from React .env when no environment variables set', () {
      // Arrange
      dotenv.testLoad(fileInput: '');

      // Act & Assert
      expect(CognitoConfig.userPoolId, 'ap-south-1_6C5lP9yfm');
      expect(CognitoConfig.clientId, '5ppt7ntr3a3ckvc670v71h920r');
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

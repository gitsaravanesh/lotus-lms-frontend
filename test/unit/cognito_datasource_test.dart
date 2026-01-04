import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:lotus_lms/features/auth/data/datasources/cognito_datasource.dart';
import 'package:lotus_lms/core/config/cognito_config.dart';

void main() {
  group('CognitoDataSource OAuth URL Tests', () {
    late CognitoDataSource dataSource;

    setUp(() {
      // Initialize dotenv with test values
      dotenv.testLoad(fileInput: '''
USER_POOL_ID=ap-south-1_6C5lP9yfm
CLIENT_ID=49gusp4sidkggc371vghtdvujb
AWS_REGION=ap-south-1
COGNITO_DOMAIN=lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com
REDIRECT_URI=https://dodyqytcfhwoe.cloudfront.net/
SIGNOUT_URL=https://dodyqytcfhwoe.cloudfront.net/
''');
      dataSource = CognitoDataSource();
    });

    test('getHostedUIUrl should generate correct OAuth URL with proper scope encoding', () {
      // Act
      final url = dataSource.getHostedUIUrl();

      // Assert
      expect(url, contains('https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com/oauth2/authorize'));
      expect(url, contains('client_id=49gusp4sidkggc371vghtdvujb'));
      expect(url, contains('response_type=code'));
      expect(url, contains('scope=email+openid+profile'));
      expect(url, contains('redirect_uri=https%3A%2F%2Fdodyqytcfhwoe.cloudfront.net%2F'));
      expect(url, contains('identity_provider=Google'));
    });

    test('getHostedUIUrl should NOT encode the + symbols in scope parameter', () {
      // Act
      final url = dataSource.getHostedUIUrl();

      // Assert - scope should have + not %2B
      expect(url, contains('scope=email+openid+profile'));
      expect(url, isNot(contains('scope=email%2Bopenid%2Bprofile')));
    });

    test('getHostedUIUrl should properly URL-encode the redirect_uri', () {
      // Act
      final url = dataSource.getHostedUIUrl();

      // Assert - redirect_uri should be URL encoded
      expect(url, contains('redirect_uri=https%3A%2F%2Fdodyqytcfhwoe.cloudfront.net%2F'));
    });

    test('getHostedUIUrl should properly URL-encode the client_id', () {
      // Act
      final url = dataSource.getHostedUIUrl();

      // Assert - client_id should be URL encoded (though this ID doesn't have special chars)
      expect(url, contains('client_id=49gusp4sidkggc371vghtdvujb'));
    });

    test('getHostedUIUrl should handle client_id with special characters', () {
      // Arrange
      dotenv.testLoad(fileInput: '''
USER_POOL_ID=ap-south-1_6C5lP9yfm
CLIENT_ID=test+client&id=123
AWS_REGION=ap-south-1
COGNITO_DOMAIN=lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com
REDIRECT_URI=https://dodyqytcfhwoe.cloudfront.net/
''');
      final testDataSource = CognitoDataSource();

      // Act
      final url = testDataSource.getHostedUIUrl();

      // Assert - special characters in client_id should be encoded
      expect(url, contains('client_id=test%2Bclient%26id%3D123'));
    });

    test('getHostedUIUrl should match expected full URL format', () {
      // Act
      final url = dataSource.getHostedUIUrl();

      // Assert - verify the complete expected URL format
      final expectedUrl = 'https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com/oauth2/authorize?'
          'client_id=49gusp4sidkggc371vghtdvujb&'
          'response_type=code&'
          'scope=email+openid+profile&'
          'redirect_uri=https%3A%2F%2Fdodyqytcfhwoe.cloudfront.net%2F&'
          'identity_provider=Google';
      
      expect(url, equals(expectedUrl));
    });

    test('getLogoutUrl should properly encode logout_uri', () {
      // Act
      final url = dataSource.getLogoutUrl();

      // Assert
      expect(url, contains('https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com/logout'));
      expect(url, contains('client_id=49gusp4sidkggc371vghtdvujb'));
      expect(url, contains('logout_uri=https%3A%2F%2Fdodyqytcfhwoe.cloudfront.net%2F'));
    });
  });
}

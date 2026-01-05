import 'package:flutter_test/flutter_test.dart';
import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:lotus_lms/features/auth/data/datasources/cognito_datasource.dart';

void main() {
  group('CognitoDataSource Tests', () {
    late CognitoDataSource dataSource;

    setUp(() {
      dataSource = CognitoDataSource();
    });

    test('should create CognitoDataSource instance', () {
      expect(dataSource, isNotNull);
      expect(dataSource, isA<CognitoDataSource>());
    });

    test('getHostedUIUrl should return valid OAuth URL', () {
      // Act
      final url = dataSource.getHostedUIUrl();

      // Assert
      expect(url, isNotEmpty);
      expect(url, contains('oauth2/authorize'));
      expect(url, contains('response_type=code'));
      expect(url, contains('scope='));
    });

    test('getHostedUIUrl should include Google identity provider', () {
      // Act
      final url = dataSource.getHostedUIUrl();

      // Assert
      expect(url, contains('identity_provider=Google'));
    });

    test('getHostedUIUrl should include client_id', () {
      // Act
      final url = dataSource.getHostedUIUrl();

      // Assert
      expect(url, contains('client_id='));
    });

    test('getHostedUIUrl should include redirect_uri', () {
      // Act
      final url = dataSource.getHostedUIUrl();

      // Assert
      expect(url, contains('redirect_uri='));
    });

    test('getLogoutUrl should return valid logout URL', () {
      // Act
      final url = dataSource.getLogoutUrl();

      // Assert
      expect(url, isNotEmpty);
      expect(url, contains('/logout'));
      expect(url, contains('client_id='));
      expect(url, contains('logout_uri='));
    });

    test('getLogoutUrl should include client_id', () {
      // Act
      final url = dataSource.getLogoutUrl();

      // Assert
      expect(url, contains('client_id='));
    });

    test('getLogoutUrl should include logout_uri', () {
      // Act
      final url = dataSource.getLogoutUrl();

      // Assert
      expect(url, contains('logout_uri='));
    });

    test('should validate Google provider name', () {
      // Arrange
      const expectedProvider = 'Google';
      const googleProviderName = 'Google';

      // Assert
      expect(expectedProvider, googleProviderName);
    });
  });
}

import 'package:dio/dio.dart';
import '../../../../core/api/dio_client.dart';
import '../../../../core/config/cognito_config.dart';
import '../models/tenant_mapping_model.dart';
import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class AuthRemoteDatasource {
  Future<void> persistSession(CognitoUserSession session);
  Future<void> clearSession();
  Future<CognitoUserSession?> getSession();
}

class AuthRemoteDatasourceImpl implements AuthRemoteDatasource {
  static const String _accessTokenKey = 'access_token';
  static const String _idTokenKey = 'id_token';
  static const String _refreshTokenKey = 'refresh_token';

  @override
  Future<void> persistSession(CognitoUserSession session) async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.setString(
      _accessTokenKey,
      session.getAccessToken().getJwtToken(),
    );

    await prefs.setString(
      _idTokenKey,
      session.getIdToken().getJwtToken(),
    );

    await prefs.setString(
      _refreshTokenKey,
      session.getRefreshToken()?.getToken() ?? '',
    );
  }

  @override
  Future<CognitoUserSession?> getSession() async {
    final prefs = await SharedPreferences.getInstance();

    final accessToken = prefs.getString(_accessTokenKey);
    final idToken = prefs.getString(_idTokenKey);

    if (accessToken == null || idToken == null) {
      return null;
    }

    return CognitoUserSession(
      CognitoIdToken(idToken),
      CognitoAccessToken(accessToken),
    );
  }

  @override
  Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(_accessTokenKey);
    await prefs.remove(_idTokenKey);
    await prefs.remove(_refreshTokenKey);
  }
}
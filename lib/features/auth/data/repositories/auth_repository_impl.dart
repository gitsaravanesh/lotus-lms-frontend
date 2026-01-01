import '../../domain/repositories/auth_repository.dart';
import '../../domain/entities/user.dart';
import '../datasources/cognito_datasource.dart';
import '../datasources/auth_remote_datasource.dart';
import '../models/user_model.dart';
import '../../../../core/utils/jwt_parser.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/constants/app_constants.dart';

/// Auth Repository Implementation
class AuthRepositoryImpl implements AuthRepository {
  final CognitoDataSource _cognitoDataSource;
  final AuthRemoteDataSource _remoteDataSource;
  
  AuthRepositoryImpl({
    required CognitoDataSource cognitoDataSource,
    required AuthRemoteDataSource remoteDataSource,
  })  : _cognitoDataSource = cognitoDataSource,
        _remoteDataSource = remoteDataSource;
  
  @override
  Future<void> signUp({
    required String username,
    required String email,
    required String password,
    String? topic,
  }) async {
    await _cognitoDataSource.signUp(
      username: username,
      email: email,
      password: password,
      topic: topic,
    );
  }
  
  @override
  Future<User> signIn({
    required String identifier,
    required String password,
  }) async {
    final session = await _cognitoDataSource.signIn(
      identifier: identifier,
      password: password,
    );
    
    if (session == null) {
      throw Exception('Failed to sign in');
    }
    
    final idToken = session.getIdToken().getJwtToken();
    
    // Store token
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.idTokenKey, idToken);
    
    // Parse token
    final payload = JwtParser.parseJwt(idToken);
    if (payload == null) {
      throw Exception('Failed to parse token');
    }
    
    // Determine username
    final username = await _determineAndPersistUsername(payload, null);
    
    // Fetch tenant mapping
    final tenantMapping = await _remoteDataSource.fetchUserTenant(username);
    
    return UserModel(
      name: JwtParser.getNameFromPayload(payload) ?? username,
      username: username,
      email: JwtParser.getEmailFromPayload(payload) ?? '',
      tenantId: tenantMapping.tenantId,
      role: tenantMapping.role,
    ).toEntity();
  }
  
  @override
  Future<User> exchangeCodeForToken(String code, String? pendingUsername) async {
    final tokens = await _remoteDataSource.exchangeCodeForToken(code);
    final idToken = tokens['id_token'] as String;
    
    // Store token
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.idTokenKey, idToken);
    
    // Parse token
    final payload = JwtParser.parseJwt(idToken);
    if (payload == null) {
      throw Exception('Failed to parse token');
    }
    
    // Determine username
    final username = await _determineAndPersistUsername(payload, pendingUsername);
    
    // Fetch tenant mapping
    final tenantMapping = await _remoteDataSource.fetchUserTenant(username);
    
    return UserModel(
      name: JwtParser.getNameFromPayload(payload) ?? username,
      username: username,
      email: JwtParser.getEmailFromPayload(payload) ?? '',
      tenantId: tenantMapping.tenantId,
      role: tenantMapping.role,
    ).toEntity();
  }
  
  @override
  Future<User?> getCurrentUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString(AppConstants.idTokenKey);
      
      if (token == null) return null;
      
      final payload = JwtParser.parseJwt(token);
      if (payload == null) return null;
      
      final username = await _determineAndPersistUsername(payload, null);
      final tenantMapping = await _remoteDataSource.fetchUserTenant(username);
      
      return UserModel(
        name: JwtParser.getNameFromPayload(payload) ?? username,
        username: username,
        email: JwtParser.getEmailFromPayload(payload) ?? '',
        tenantId: tenantMapping.tenantId,
        role: tenantMapping.role,
      ).toEntity();
    } catch (e) {
      return null;
    }
  }
  
  @override
  Future<void> signOut() async {
    await _cognitoDataSource.signOut();
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.idTokenKey);
    await prefs.remove(AppConstants.usernameKey);
    await prefs.remove(AppConstants.userTopicKey);
  }
  
  @override
  String getGoogleOAuthUrl() {
    return _cognitoDataSource.getHostedUIUrl();
  }
  
  @override
  String getLogoutUrl() {
    return _cognitoDataSource.getLogoutUrl();
  }
  
  /// Helper to determine and persist username
  Future<String> _determineAndPersistUsername(
    Map<String, dynamic> payload,
    String? pendingUsername,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    
    // 1. Check existing username
    final existingUsername = prefs.getString(AppConstants.usernameKey);
    if (existingUsername != null) {
      return existingUsername;
    }
    
    // 2. Use pending username
    if (pendingUsername != null) {
      await prefs.setString(AppConstants.usernameKey, pendingUsername);
      return pendingUsername;
    }
    
    // 3. Extract from JWT payload
    final username = JwtParser.getUsernameFromPayload(payload);
    if (username != null) {
      await prefs.setString(AppConstants.usernameKey, username);
      return username;
    }
    
    throw Exception('Unable to determine username');
  }
}

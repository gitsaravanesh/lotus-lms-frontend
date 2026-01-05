import 'package:dio/dio.dart';
import '../../../../core/api/dio_client.dart';
import '../../../../core/config/cognito_config.dart';
import '../models/tenant_mapping_model.dart';

/// Auth Remote Data Source for API calls
class AuthRemoteDataSource {
  final Dio _dio = DioClient.instance;
  
  /// Exchange authorization code for tokens (OAuth callback)
  Future<Map<String, dynamic>> exchangeCodeForToken(String code) async {
    final body = {
      'grant_type': 'authorization_code',
      'client_id': CognitoConfig.clientId,
      'redirect_uri': CognitoConfig.redirectUri,
      'code': code,
    };
    
    final response = await _dio.post(
      'https://${CognitoConfig.cognitoDomain}/oauth2/token',
      data: body,
      options: Options(
        contentType: Headers.formUrlEncodedContentType,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      ),
    );
    
    return response.data as Map<String, dynamic>;
  }
  
  /// Fetch user tenant mapping from backend
  Future<TenantMappingModel> fetchUserTenant(String userId) async {
    final response = await _dio.get(
      '/user/tenant',
      queryParameters: {'user_id': userId},
    );
    
    return TenantMappingModel.fromJson(response.data as Map<String, dynamic>);
  }
}

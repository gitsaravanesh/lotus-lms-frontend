import 'dart:convert';

/// JWT Parser Utility
class JwtParser {
  /// Parse JWT token and return payload
  static Map<String, dynamic>? parseJwt(String token) {
    try {
      final parts = token.split('.');
      if (parts.length != 3) {
        return null;
      }
      
      final payload = parts[1];
      final normalized = base64Url.normalize(payload);
      final decoded = utf8.decode(base64Url.decode(normalized));
      
      return json.decode(decoded) as Map<String, dynamic>;
    } catch (e) {
      return null;
    }
  }
  
  /// Get username from JWT payload with priority:
  /// 1. cognito:username
  /// 2. preferred_username
  /// 3. email
  static String? getUsernameFromPayload(Map<String, dynamic> payload) {
    if (payload['cognito:username'] != null) {
      return payload['cognito:username'] as String;
    }
    if (payload['preferred_username'] != null) {
      return payload['preferred_username'] as String;
    }
    if (payload['email'] != null) {
      return payload['email'] as String;
    }
    return null;
  }
  
  /// Get name from JWT payload
  static String? getNameFromPayload(Map<String, dynamic> payload) {
    if (payload['name'] != null) {
      return payload['name'] as String;
    }
    if (payload['email'] != null) {
      return payload['email'] as String;
    }
    return null;
  }
  
  /// Get email from JWT payload
  static String? getEmailFromPayload(Map<String, dynamic> payload) {
    return payload['email'] as String?;
  }
}

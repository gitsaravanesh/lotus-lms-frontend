/// API Constants
class ApiConstants {
  // Base URL will be loaded from environment
  static String get baseUrl => const String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api.example.com',
  );
  
  // Endpoints
  static const String coursesEndpoint = '/courses';
  static const String userTenantEndpoint = '/user/tenant';
  static const String createOrderEndpoint = '/create-order';
  static const String transactionsEndpoint = '/transactions';
  
  // Headers
  static const String tenantIdHeader = 'x-tenant-id';
  static const String contentTypeJson = 'application/json';
}

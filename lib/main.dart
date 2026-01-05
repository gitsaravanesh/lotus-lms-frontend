import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'app/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load environment variables
  try {
    await dotenv.load(fileName: '.env');
    debugPrint('✅ Loaded .env file successfully');
    debugPrint('API_BASE_URL: ${dotenv.env['API_BASE_URL']}');
    debugPrint('USER_POOL_ID: ${dotenv.env['USER_POOL_ID'] ?? dotenv.env['REACT_APP_USER_POOL_ID']}');
  } catch (e) {
    // .env file not found, will use default values
    debugPrint('⚠️ Warning: .env file not found, using default configuration');
    debugPrint('Error: $e');
  }
  
  runApp(
    const ProviderScope(
      child: LotusLmsApp(),
    ),
  );
}

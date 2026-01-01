import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'app/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load environment variables
  try {
    await dotenv.load(fileName: '.env');
  } catch (e) {
    // .env file not found, will use default values
    debugPrint('Warning: .env file not found, using default configuration');
  }
  
  runApp(
    const ProviderScope(
      child: LotusLmsApp(),
    ),
  );
}

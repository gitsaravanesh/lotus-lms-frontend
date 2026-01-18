import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'features/auth/providers/auth_provider.dart';
import 'features/auth/presentation/pages/login_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthNotifier>(
          create: (_) => AuthNotifier(),
        ),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Lotus LMS',
        home: const LoginPage(),
      ),
    );
  }
}
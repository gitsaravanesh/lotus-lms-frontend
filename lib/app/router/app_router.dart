import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/signup_page.dart';
import '../../features/auth/presentation/pages/auth_callback_page.dart';
import '../../features/courses/presentation/pages/dashboard_page.dart';

/// Router Provider
final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        name: 'login',
        builder: (context, state) {
          // Check if this is an OAuth callback
          final code = state.uri.queryParameters['code'];
          final error = state.uri.queryParameters['error'];
          
          if (code != null || error != null) {
            // This is an OAuth callback
            final errorDescription = state.uri.queryParameters['error_description'];
            return const AuthCallbackPage();
          }
          
          // Regular login page
          return const LoginPage();
        },
      ),
      GoRoute(
        path: '/signup',
        name: 'signup',
        builder: (context, state) => const SignupPage(),
      ),
      GoRoute(
        path: '/dashboard',
        name: 'dashboard',
        builder: (context, state) => const DashboardPage(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text('Page not found: ${state.uri}'),
      ),
    ),
  );
});

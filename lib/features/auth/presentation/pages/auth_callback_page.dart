import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';
import '../../providers/auth_state.dart';

class AuthCallbackPage extends StatefulWidget {
  const AuthCallbackPage({super.key});

  @override
  State<AuthCallbackPage> createState() => _AuthCallbackPageState();
}

class _AuthCallbackPageState extends State<AuthCallbackPage> {
  @override
  void initState() {
    super.initState();

    // Simulate OAuth callback processing
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authNotifier = context.read<AuthNotifier>();

      // TODO: exchange auth code with backend / Cognito
      authNotifier.signIn('oauth-user@example.com', 'oauth-token');
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AuthNotifier>().state;

    if (state.status == AuthStatus.loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (state.status == AuthStatus.authenticated) {
      return const Scaffold(
        body: Center(child: Text('Authentication successful')),
      );
    }

    if (state.status == AuthStatus.error) {
      return Scaffold(
        body: Center(
          child: Text(
            state.errorMessage ?? 'Authentication failed',
            style: const TextStyle(color: Colors.red),
          ),
        ),
      );
    }

    return const Scaffold(
      body: Center(child: Text('Processing authentication...')),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/auth_state.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final authNotifier = context.watch<AuthNotifier>();
    final state = authNotifier.state;

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 16),

            if (state.status == AuthStatus.loading)
              const CircularProgressIndicator(),

            if (state.status != AuthStatus.loading)
              ElevatedButton(
                onPressed: () {
                  authNotifier.signIn(
                    _emailController.text,
                    _passwordController.text,
                  );
                },
                child: const Text('Login'),
              ),

            const SizedBox(height: 12),

            TextButton(
              onPressed: () {
                final url = authNotifier.getGoogleOAuthUrl();
                debugPrint('Redirect to: $url');
              },
              child: const Text('Login with Google'),
            ),

            if (state.status == AuthStatus.error)
              Text(
                state.errorMessage ?? 'Unknown error',
                style: const TextStyle(color: Colors.red),
              ),
          ],
        ),
      ),
    );
  }
}
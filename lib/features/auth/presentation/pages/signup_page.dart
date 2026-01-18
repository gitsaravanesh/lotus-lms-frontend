import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';
import '../../providers/auth_state.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final authNotifier = context.watch<AuthNotifier>();
    final state = authNotifier.state;

    return Scaffold(
      appBar: AppBar(title: const Text('Sign Up')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 24),

            if (state.status == AuthStatus.loading)
              const CircularProgressIndicator(),

            if (state.status != AuthStatus.loading)
              ElevatedButton(
                onPressed: () {
                  authNotifier.signUp(
                    email: _emailController.text,
                    password: _passwordController.text,
                  );
                },
                child: const Text('Create Account'),
              ),

            const SizedBox(height: 12),

            if (state.status == AuthStatus.signupSuccess)
              const Text(
                'Signup successful! Please login.',
                style: TextStyle(color: Colors.green),
              ),

            if (state.status == AuthStatus.error)
              Text(
                state.errorMessage ?? 'Signup failed',
                style: const TextStyle(color: Colors.red),
              ),
          ],
        ),
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../shared/widgets/custom_button.dart';
import '../../../../shared/widgets/custom_text_field.dart';
import '../../../../shared/widgets/error_banner.dart';
import '../../../../core/constants/app_constants.dart';
import '../../providers/auth_provider.dart';
import '../../providers/auth_state.dart';

/// Signup Page
class SignupPage extends ConsumerStatefulWidget {
  const SignupPage({super.key});

  @override
  ConsumerState<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends ConsumerState<SignupPage> {
  final _formKey = GlobalKey<FormState>();

  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  String _selectedTopic = '';
  String? _errorMessage;
  String? _successMessage;

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  /// 🔹 NORMAL SIGNUP
  void _handleSignup() {
    if (_formKey.currentState!.validate()) {
      ref.read(authProvider.notifier).signUp(
        studentUsername: _usernameController.text.trim(), // ✅ FIXED
        email: _emailController.text.trim(),
        password: _passwordController.text,
        topic: _selectedTopic.isEmpty ? null : _selectedTopic,
      );
    }
  }

  /// 🔹 GOOGLE SIGNUP
  Future<void> _handleGoogleSignUp() async {
    final result = await showDialog<Map<String, String?>>(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return _GoogleSignUpDialog(
          selectedTopic: _selectedTopic,
        );
      },
    );

    if (result != null && mounted) {
      try {
        final studentUsername = result['student_username']!;
        final topic = result['topic'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(
          AppConstants.pendingGoogleUsernameKey,
          studentUsername,
        );

        if (topic != null && topic.isNotEmpty) {
          await prefs.setString(
            AppConstants.pendingGoogleTopicKey,
            topic,
          );
        }

        final oauthUrl =
            ref.read(authProvider.notifier).getGoogleOAuthUrl();

        await launchUrl(
          Uri.parse(oauthUrl),
          mode: LaunchMode.platformDefault,
          webOnlyWindowName: '_self',
        );
      } catch (e) {
        setState(() {
          _errorMessage = 'Failed to initiate Google Sign-Up: $e';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    /// 🔹 LISTEN TO AUTH STATE
    ref.listen<AuthState>(authProvider, (previous, next) {
      next.maybeWhen(
        unauthenticated: () {
          setState(() {
            _successMessage =
                'Signup successful! Please check your email to verify your account.';
          });
        },
        error: (message) {
          setState(() {
            _errorMessage = message;
          });
        },
        orElse: () {},
      );
    });

    final authState = ref.watch(authProvider);
    final isLoading = authState.maybeWhen(
      loading: () => true,
      orElse: () => false,
    );

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppColors.primaryGradient,
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                if (_errorMessage != null) ...[
                  ErrorBanner(
                    message: _errorMessage!,
                    onDismiss: () {
                      setState(() {
                        _errorMessage = null;
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                ],
                if (_successMessage != null) ...[
                  Material(
                    color: AppColors.success,
                    elevation: 4,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          const Icon(Icons.check_circle_outline,
                              color: Colors.white),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              _successMessage!,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          IconButton(
                            icon:
                                const Icon(Icons.close, color: Colors.white),
                            onPressed: () {
                              setState(() {
                                _successMessage = null;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
                Card(
                  elevation: 8,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Container(
                    width: 400,
                    padding: const EdgeInsets.all(32),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Create Account',
                            style: Theme.of(context)
                                .textTheme
                                .displaySmall
                                ?.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 32),

                          /// USERNAME
                          CustomTextField(
                            controller: _usernameController,
                            hint: 'Username',
                            prefixIcon:
                                const Icon(Icons.person_outline),
                            enabled: !isLoading,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter a username';
                              }
                              if (value.length < 3) {
                                return 'Username must be at least 3 characters';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),

                          /// EMAIL
                          CustomTextField(
                            controller: _emailController,
                            hint: 'Email Address',
                            keyboardType:
                                TextInputType.emailAddress,
                            prefixIcon:
                                const Icon(Icons.email_outlined),
                            enabled: !isLoading,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your email';
                              }
                              if (!value.contains('@')) {
                                return 'Please enter a valid email';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),

                          /// PASSWORD
                          CustomTextField(
                            controller: _passwordController,
                            hint: 'Password (min 8 characters)',
                            obscureText: true,
                            prefixIcon:
                                const Icon(Icons.lock_outline),
                            enabled: !isLoading,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter a password';
                              }
                              if (value.length < 8) {
                                return 'Password must be at least 8 characters';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),

                          /// CONFIRM PASSWORD
                          CustomTextField(
                            controller:
                                _confirmPasswordController,
                            hint: 'Confirm Password',
                            obscureText: true,
                            prefixIcon:
                                const Icon(Icons.lock_outline),
                            enabled: !isLoading,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please confirm your password';
                              }
                              if (value !=
                                  _passwordController.text) {
                                return 'Passwords do not match';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),

                          /// TOPIC
                          DropdownButtonFormField<String>(
                            value: _selectedTopic.isEmpty
                                ? null
                                : _selectedTopic,
                            decoration: const InputDecoration(
                              labelText:
                                  'Interested Topics (Optional)',
                              prefixIcon:
                                  Icon(Icons.topic_outlined),
                            ),
                            items: AppConstants.topicOptions
                                .where((e) =>
                                    e['value']!.isNotEmpty)
                                .map((e) => DropdownMenuItem(
                                      value: e['value'],
                                      child: Text(e['label']!),
                                    ))
                                .toList(),
                            onChanged: isLoading
                                ? null
                                : (value) {
                                    setState(() {
                                      _selectedTopic = value ?? '';
                                    });
                                  },
                          ),
                          const SizedBox(height: 24),

                          /// SIGNUP BUTTON
                          SizedBox(
                            width: double.infinity,
                            child: CustomButton(
                              text: 'Sign Up',
                              isLoading: isLoading,
                              onPressed:
                                  isLoading ? null : _handleSignup,
                            ),
                          ),
                          const SizedBox(height: 16),

                          const Text(
                            'OR',
                            style: TextStyle(
                                color: AppColors.textSecondary),
                          ),
                          const SizedBox(height: 16),

                          /// GOOGLE SIGNUP
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton.icon(
                              onPressed: isLoading
                                  ? null
                                  : _handleGoogleSignUp,
                              icon: const Icon(Icons.g_translate),
                              label:
                                  const Text('Sign up with Google'),
                            ),
                          ),
                          const SizedBox(height: 24),

                          /// NAV TO LOGIN
                          Row(
                            mainAxisAlignment:
                                MainAxisAlignment.center,
                            children: [
                              const Text(
                                  'Already have an account? '),
                              TextButton(
                                onPressed: isLoading
                                    ? null
                                    : () => context.go('/'),
                                child: const Text('Sign in'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 🔹 GOOGLE SIGNUP DIALOG
class _GoogleSignUpDialog extends StatefulWidget {
  final String selectedTopic;

  const _GoogleSignUpDialog({required this.selectedTopic});

  @override
  State<_GoogleSignUpDialog> createState() =>
      _GoogleSignUpDialogState();
}

class _GoogleSignUpDialogState
    extends State<_GoogleSignUpDialog> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  String _selectedTopic = '';

  @override
  void initState() {
    super.initState();
    _selectedTopic = widget.selectedTopic;
  }

  @override
  void dispose() {
    _usernameController.dispose();
    super.dispose();
  }

  void _proceed() {
    if (_formKey.currentState!.validate()) {
      Navigator.of(context).pop({
        'student_username': _usernameController.text.trim(), // ✅ FIXED
        'topic': _selectedTopic.isEmpty ? null : _selectedTopic,
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Complete Your Profile'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Please choose a username for your account.',
              style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            CustomTextField(
              controller: _usernameController,
              hint: 'Username',
              prefixIcon:
                  const Icon(Icons.person_outline),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a username';
                }
                if (value.trim().length < 3) {
                  return 'Username must be at least 3 characters';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value:
                  _selectedTopic.isEmpty ? null : _selectedTopic,
              decoration: const InputDecoration(
                labelText: 'Interested Topics (Optional)',
                prefixIcon:
                    Icon(Icons.topic_outlined),
              ),
              items: AppConstants.topicOptions
                  .where((e) => e['value']!.isNotEmpty)
                  .map((e) => DropdownMenuItem(
                        value: e['value'],
                        child: Text(e['label']!),
                      ))
                  .toList(),
              onChanged: (value) {
                setState(() {
                  _selectedTopic = value ?? '';
                });
              },
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _proceed,
          child: const Text('Continue with Google'),
        ),
      ],
    );
  }
}
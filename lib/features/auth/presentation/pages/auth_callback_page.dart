import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/error_banner.dart';
import '../../providers/auth_provider.dart';
import '../../providers/auth_state.dart';

/// OAuth Callback Page
/// Handles the redirect from Cognito after Google OAuth authentication
class AuthCallbackPage extends ConsumerStatefulWidget {
  final String? code;
  final String? error;
  final String? errorDescription;

  const AuthCallbackPage({
    super.key,
    this.code,
    this.error,
    this.errorDescription,
  });

  @override
  ConsumerState<AuthCallbackPage> createState() => _AuthCallbackPageState();
}

class _AuthCallbackPageState extends ConsumerState<AuthCallbackPage> {
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _handleCallback();
  }

  Future<void> _handleCallback() async {
    // Handle OAuth errors
    if (widget.error != null) {
      final formattedError = Uri.decodeComponent(
        widget.errorDescription ?? 'Login failed.',
      );

      String errorMessage;
      if (formattedError.toLowerCase().contains('not enabled')) {
        errorMessage = 'Your account has not been enabled yet. Please contact support.';
      } else if (formattedError.toLowerCase().contains('disabled')) {
        errorMessage = 'Your account has been disabled. Please contact the administrator.';
      } else {
        errorMessage = formattedError;
      }

      setState(() {
        _errorMessage = errorMessage;
      });

      // Navigate back to login after showing error
      await Future.delayed(const Duration(seconds: 3));
      if (mounted) {
        context.go('/');
      }
      return;
    }

    // Handle successful authentication
    if (widget.code != null) {
      try {
        // Retrieve pending username from session storage
        final prefs = await SharedPreferences.getInstance();
        final pendingUsername = prefs.getString(AppConstants.pendingGoogleUsernameKey);
        final pendingTopic = prefs.getString(AppConstants.pendingGoogleTopicKey);

        // Store pending topic if available
        if (pendingTopic != null) {
          await prefs.setString(AppConstants.userTopicKey, pendingTopic);
        }

        // Clean up pending data
        await prefs.remove(AppConstants.pendingGoogleUsernameKey);
        await prefs.remove(AppConstants.pendingGoogleTopicKey);

        // Exchange code for tokens
        await ref.read(authProvider.notifier).exchangeCodeForToken(
          widget.code!,
          pendingUsername,
        );

        // Navigation will be handled by auth state listener
      } catch (e) {
        setState(() {
          _errorMessage = e.toString();
        });

        // Navigate back to login after showing error
        await Future.delayed(const Duration(seconds: 3));
        if (mounted) {
          context.go('/');
        }
      }
    } else {
      // No code or error - redirect to login
      context.go('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    // Listen to auth state
    ref.listen<AuthState>(authProvider, (previous, next) {
      next.maybeWhen(
        authenticated: (_) {
          // Navigate to dashboard on successful authentication
          context.go('/dashboard');
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

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppColors.primaryGradient,
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (_errorMessage != null) ...[
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: ErrorBanner(message: _errorMessage!),
                ),
              ] else ...[
                const CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
                const SizedBox(height: 24),
                Text(
                  authState.maybeWhen(
                    loading: () => 'Authenticating...',
                    orElse: () => 'Processing...',
                  ),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

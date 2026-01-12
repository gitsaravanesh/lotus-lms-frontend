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
/// Handles redirect from Cognito after Google OAuth authentication
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
  ConsumerState<AuthCallbackPage> createState() =>
      _AuthCallbackPageState();
}

class _AuthCallbackPageState
    extends ConsumerState<AuthCallbackPage> {
  static const _errorDisplayDuration = Duration(seconds: 3);
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _handleCallback();
  }

  Future<void> _handleCallback() async {
    /// 🔴 HANDLE OAUTH ERROR
    if (widget.error != null) {
      final formattedError = Uri.decodeComponent(
        widget.errorDescription ?? 'Login failed.',
      );

      String errorMessage;
      if (formattedError.toLowerCase().contains('not enabled')) {
        errorMessage =
            'Your account has not been enabled yet. Please contact support.';
      } else if (formattedError.toLowerCase().contains('disabled')) {
        errorMessage =
            'Your account has been disabled. Please contact the administrator.';
      } else {
        errorMessage = formattedError;
      }

      setState(() {
        _errorMessage = errorMessage;
      });

      await Future.delayed(_errorDisplayDuration);
      if (mounted) {
        context.go('/');
      }
      return;
    }

    /// 🟢 HANDLE SUCCESSFUL AUTH
    if (widget.code != null) {
      try {
        final prefs = await SharedPreferences.getInstance();

        /// ✅ THIS IS STUDENT USERNAME
        final String? studentUsername =
            prefs.getString(AppConstants.pendingGoogleUsernameKey);

        final String? pendingTopic =
            prefs.getString(AppConstants.pendingGoogleTopicKey);

        if (pendingTopic != null && pendingTopic.isNotEmpty) {
          await prefs.setString(
            AppConstants.userTopicKey,
            pendingTopic,
          );
        }

        /// CLEANUP TEMP DATA
        await prefs.remove(AppConstants.pendingGoogleUsernameKey);
        await prefs.remove(AppConstants.pendingGoogleTopicKey);

        /// 🔑 EXCHANGE CODE FOR TOKEN
        /// studentUsername is passed to backend
        await ref
            .read(authProvider.notifier)
            .exchangeCodeForToken(
              widget.code!,
              studentUsername,
            );

        // Navigation handled by auth state listener
      } catch (e) {
        setState(() {
          _errorMessage = e.toString();
        });

        await Future.delayed(_errorDisplayDuration);
        if (mounted) {
          context.go('/');
        }
      }
    } else {
      /// No code, no error → back to login
      context.go('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    /// 🔄 LISTEN TO AUTH STATE
    ref.listen<AuthState>(authProvider, (previous, next) {
      next.maybeWhen(
        authenticated: (_) {
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
                  valueColor:
                      AlwaysStoppedAnimation<Color>(Colors.white),
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
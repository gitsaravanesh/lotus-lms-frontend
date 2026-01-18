import 'package:flutter/material.dart';
import 'auth_state.dart';

class AuthNotifier extends ChangeNotifier {
  AuthState _state = AuthState.initial();
  AuthState get state => _state;

  void _setState(AuthState newState) {
    _state = newState;
    notifyListeners();
  }

  // -----------------------------
  // SIGN IN
  // -----------------------------
  Future<void> signIn(String email, String password) async {
    _setState(AuthState.loading());

    try {
      // TODO: Call repository / Cognito here
      await Future.delayed(const Duration(seconds: 1));

      _setState(AuthState.authenticated());
    } catch (e) {
      _setState(AuthState.error(e.toString()));
    }
  }

  // -----------------------------
  // SIGN UP
  // -----------------------------
  Future<void> signUp({
    required String email,
    required String password,
  }) async {
    _setState(AuthState.loading());

    try {
      // TODO: Call repository / Cognito signup
      await Future.delayed(const Duration(seconds: 1));

      _setState(AuthState.signupSuccess());
    } catch (e) {
      _setState(AuthState.error(e.toString()));
    }
  }

  // -----------------------------
  // GOOGLE OAUTH
  // -----------------------------
  String getGoogleOAuthUrl() {
    // TODO: Replace with real OAuth URL
    return 'https://accounts.google.com/o/oauth2/v2/auth';
  }

  void reset() {
    _setState(AuthState.initial());
  }
}
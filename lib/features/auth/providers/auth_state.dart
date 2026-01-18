import 'package:freezed_annotation/freezed_annotation.dart';
import '../presentation/providers/auth_state.dart';

@freezed
class AuthState with _$AuthState {
  const factory AuthState.initial() = _Initial;
  const factory AuthState.loading() = _Loading;
  const factory AuthState.authenticated() = _Authenticated;
  const factory AuthState.signupSuccess() = _SignupSuccess;
  const factory AuthState.error(String message) = _Error;
}
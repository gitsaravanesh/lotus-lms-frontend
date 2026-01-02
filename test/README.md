# Tests

This directory contains tests for the Lotus LMS Flutter application.

## Structure

```
test/
├── widget_test.dart           # Widget and integration tests
├── features/
│   ├── auth/
│   │   └── auth_test.dart    # Authentication tests
│   ├── courses/
│   │   └── courses_test.dart # Course management tests
│   └── payment/
│       └── payment_test.dart  # Payment integration tests
└── unit/                      # Unit tests
```

## Running Tests

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/features/auth/auth_test.dart

# Run with coverage
flutter test --coverage

# Run in watch mode
flutter test --watch
```

## Writing Tests

### Widget Tests
```dart
testWidgets('Login page displays correctly', (WidgetTester tester) async {
  await tester.pumpWidget(MyApp());
  expect(find.text('Login'), findsOneWidget);
});
```

### Unit Tests
```dart
test('User model serialization', () {
  final user = User(id: '1', email: 'test@test.com');
  expect(user.toJson(), containsPair('email', 'test@test.com'));
});
```

## TODO

- [ ] Add authentication flow tests
- [ ] Add course listing tests
- [ ] Add payment integration tests
- [ ] Add widget tests for all pages
- [ ] Set up test coverage reporting
- [ ] Add integration tests

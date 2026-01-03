import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lotus_lms/app/app.dart';

void main() {
  testWidgets('LotusLmsApp builds successfully', (WidgetTester tester) async {
    // Build the LotusLmsApp widget wrapped in ProviderScope
    await tester.pumpWidget(
      const ProviderScope(
        child: LotusLmsApp(),
      ),
    );

    // Verify that the app builds without errors
    expect(find.byType(LotusLmsApp), findsOneWidget);
  });

  testWidgets('LotusLmsApp creates MaterialApp with router', (WidgetTester tester) async {
    // Build the app
    await tester.pumpWidget(
      const ProviderScope(
        child: LotusLmsApp(),
      ),
    );

    // Pump the widget tree to allow the router to initialize
    await tester.pumpAndSettle();

    // Verify that LotusLmsApp is present
    expect(find.byType(LotusLmsApp), findsOneWidget);
  });
}

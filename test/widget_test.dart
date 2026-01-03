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
    expect(find.byType(MaterialApp), findsOneWidget);
  });

  testWidgets('LotusLmsApp has correct title', (WidgetTester tester) async {
    // Build the app
    await tester.pumpWidget(
      const ProviderScope(
        child: LotusLmsApp(),
      ),
    );

    // Access the MaterialApp widget and verify the title
    final MaterialApp app = tester.widget(find.byType(MaterialApp));
    expect(app.title, 'Lotus LMS');
  });

  testWidgets('LotusLmsApp debug banner is disabled', (WidgetTester tester) async {
    // Build the app
    await tester.pumpWidget(
      const ProviderScope(
        child: LotusLmsApp(),
      ),
    );

    // Verify debug banner is disabled
    final MaterialApp app = tester.widget(find.byType(MaterialApp));
    expect(app.debugShowCheckedModeBanner, false);
  });
}

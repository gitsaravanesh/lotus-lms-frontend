import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lotus_lms/app/app.dart';

void main() {
  testWidgets('LotusLmsApp can be created with ProviderScope', (WidgetTester tester) async {
    // Build the app with minimal setup
    await tester.pumpWidget(
      const ProviderScope(
        child: LotusLmsApp(),
      ),
    );

    // Just verify the widget exists - don't wait for full rendering
    expect(find.byType(ProviderScope), findsOneWidget);
    expect(find.byType(LotusLmsApp), findsOneWidget);
  });

  testWidgets('LotusLmsApp initializes without errors', (WidgetTester tester) async {
    // Build the app
    await tester.pumpWidget(
      const ProviderScope(
        child: LotusLmsApp(),
      ),
    );

    // Pump one frame to start initialization
    await tester.pump();

    // Verify no exceptions were thrown during initial build
    expect(tester.takeException(), isNull);
  });
}

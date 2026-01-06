# Lotus LMS - Flutter Frontend

> Multi-platform Learning Management System built with Flutter

[![Flutter](https://img.shields.io/badge/Flutter-3.0+-blue.svg)](https://flutter.dev/)
[![Dart](https://img.shields.io/badge/Dart-3.0+-blue.svg)](https://dart.dev/)

---

## 🔄 Migration Notice

**This project has been migrated from React to Flutter!**

- ✅ **All features preserved** and improved
- 🚀 **New platforms supported**: iOS, Android, Desktop
- 📱 **Better performance** with native compilation
- 📚 **See**: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for details
- 🔙 **Rollback**: React code available in branch `backup/react-original`
- 📝 **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

## 🌟 Overview

Lotus LMS is a modern, cross-platform learning management system built with Flutter. It supports Web, iOS, Android, Windows, macOS, and Linux platforms from a single codebase.

### ✨ Features

- **Multi-Platform Support**: Web, iOS, Android, Desktop (Windows, macOS, Linux)
- **AWS Cognito Authentication**: Email/password and Google OAuth
- **Multi-Tenant Architecture**: Isolated course content per organization
- **Razorpay Integration**: Secure payment processing for course enrollment
- **Material Design 3**: Modern, beautiful UI with custom theming
- **State Management**: Riverpod for predictable state management
- **Offline Support**: Secure local storage with flutter_secure_storage

## 🚀 Getting Started

### Prerequisites

- Flutter SDK 3.0 or higher
- Dart SDK 3.0 or higher
- For iOS development: Xcode 14+
- For Android development: Android Studio
- For Web: Chrome browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gitsaravanesh/lotus-lms-frontend.git
   cd lotus-lms-frontend
   ```

2. **Install Flutter dependencies**
   ```bash
   flutter pub get
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and update with your configuration:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   AWS_REGION=ap-south-1
   USER_POOL_ID=your_user_pool_id
   CLIENT_ID=your_client_id
   COGNITO_DOMAIN=your-domain.auth.region.amazoncognito.com
   REDIRECT_URI=https://your-frontend-url
   API_BASE_URL=https://your-api-gateway-url
   RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Generate code (for JSON serialization)**
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

### Running the Application

#### Web
```bash
flutter run -d chrome
```

#### Android
```bash
flutter run -d android
```

#### iOS (macOS required)
```bash
flutter run -d ios
```

#### Desktop
```bash
# Windows
flutter run -d windows

# macOS
flutter run -d macos

# Linux
flutter run -d linux
```

### Building for Production

#### Web
```bash
flutter build web --release
```
Output: `build/web/`

#### Android APK
```bash
flutter build apk --release
```
Output: `build/app/outputs/flutter-apk/app-release.apk`

#### iOS (requires Apple Developer account)
```bash
flutter build ios --release
```

#### Desktop
```bash
# Windows
flutter build windows --release

# macOS
flutter build macos --release

# Linux
flutter build linux --release
```

## 📁 Project Structure

```
lib/
├── main.dart                    # Application entry point
├── app/
│   ├── app.dart                 # Root widget
│   ├── router/
│   │   └── app_router.dart      # GoRouter configuration
│   └── theme/
│       ├── app_theme.dart       # Material Design 3 theme
│       └── app_colors.dart      # Color scheme
├── features/
│   ├── auth/                    # Authentication feature
│   ├── courses/                 # Courses feature
│   └── payment/                 # Payment feature
├── core/
│   ├── api/                     # API client setup
│   ├── config/                  # Configuration
│   ├── constants/               # App constants
│   └── utils/                   # Utility functions
└── shared/
    └── widgets/                 # Reusable widgets
```

## 🏗️ Architecture

This project follows **Clean Architecture** principles with:

- **Presentation Layer**: UI components (Pages, Widgets)
- **Domain Layer**: Business logic and entities
- **Data Layer**: Data sources, models, and repositories

## 🔑 Key Technologies

- `flutter_riverpod`: State management
- `amazon_cognito_identity_dart_2`: AWS Cognito authentication
- `google_sign_in`: Google OAuth integration
- `dio`: HTTP client
- `razorpay_flutter`: Payment gateway integration
- `go_router`: Navigation and routing
- `flutter_dotenv`: Environment configuration
- `google_fonts`: Custom typography (Poppins)

## 🧪 Testing

Run tests:
```bash
flutter test
```

Run with coverage:
```bash
flutter test --coverage
```

## 📝 Code Generation

Generate code for JSON serialization and state classes:
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

Watch for changes:
```bash
flutter pub run build_runner watch
```

## 🎨 Theming

The app uses Material Design 3 with a custom color scheme:

- **Primary**: `#0077b6` (Blue)
- **Secondary**: `#0096c7` (Light Blue)
- **Success**: `#28a745` (Green)
- **Error**: `#ff5252` (Red)
- **Font**: Poppins (Google Fonts)

## 🚀 Deployment

The application is automatically deployed to AWS S3 and CloudFront on every push to the `main` branch.

- **Production URL**: [https://dodyqtcfhwoe.cloudfront.net](https://dodyqtcfhwoe.cloudfront.net)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions
- **CI/CD**: GitHub Actions workflow handles build, test, and deployment

### Quick Setup

To enable automatic deployments, configure these GitHub secrets:
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID
- `API_BASE_URL` - Backend API URL
- `RAZORPAY_KEY_ID` - Payment gateway key

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please contact support@lotuslms.com or open an issue in the repository.

// AWS Cognito configuration for Lotus LMS
export const COGNITO_DOMAIN = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
export const CLIENT_ID = "1gd98lgt6jqtletgio0e2us33n";
export const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net/"; // CloudFront domain
export const TOKEN_ENDPOINT = `${COGNITO_DOMAIN}/oauth2/token`;
export const LOGOUT_ENDPOINT = `${COGNITO_DOMAIN}/logout`;
export const SCOPE = "email openid profile";
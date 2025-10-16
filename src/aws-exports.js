import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "ap-south-1",
    userPoolId: "ap-south-1_tlq8pMnBG",   // replace with your actual user pool ID
    userPoolWebClientId: "1gd98lgt6jqtletgio0e2us33n",
    oauth: {
      domain: "lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com",
      scope: ["email", "openid", "profile"],
      redirectSignIn: "https://dodyqytcfhwoe.cloudfront.net",
      redirectSignOut: "https://dodyqytcfhwoe.cloudfront.net",
      responseType: "code"
    }
  }
});
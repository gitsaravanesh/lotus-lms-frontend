const awsConfig = {
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,
      scope: ["email", "openid", "profile"],
      redirectSignIn: process.env.REACT_APP_REDIRECT_URL,
      redirectSignOut: process.env.REACT_APP_REDIRECT_URL,
      responseType: "code",
    },
  },
};

export default awsConfig;
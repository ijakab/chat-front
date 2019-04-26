export default {
  env: {
    cookieDomain: 'localhost',
    hostName: 'http://localhost:3000',
    isProduction: false,
    isProtected: false,
    subdomain: 'gaussdev',
    apiBaseUrl: 'https://apigaussbox.jsteam.gaussx.com',
    socketApiBaseUrl: 'http://localhost:3333/v1/chat/',
    socketUrl: 'ws://localhost:3333/',
  },

  server: {
    port: 7800, // default: 3000
      host: '0.0.0.0', // default: localhost
  }
};

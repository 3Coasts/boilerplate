module.exports = {
  version: '1', // used for api version in uri
  environment: 'development', // or 'production;
  authTokenTimeout: 60000, // Time before authTokens are deleted
  debug: true, // Used to print messages to console
  port: 3000,
  mongo: { // host, database, user, pass
    host: 'localhost',
    database: 'boilerplate'
  },
  twilio: {} // sid, token, number
};

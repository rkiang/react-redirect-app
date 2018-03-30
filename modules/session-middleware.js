const cookieSession = require('cookie-session');
const warnings = require('../constants/warnings');


const serverSessionSecret = () => {
  if (!process.env.SERVER_SESSION_SECRET ||
      process.env.SERVER_SESSION_SECRET.length < 8 ||
      process.env.SERVER_SESSION_SECRET === warnings.exampleBadSecret) {
    console.log(warnings.badSecret);
  }

  return process.env.SERVER_SESSION_SECRET;
};

module.exports = cookieSession({
  secret: serverSessionSecret() || 'secret',
  key: 'user',
  resave: 'true',
  saveUninitialized: false,
  cookie: { maxage: 60000, secure: false },
});

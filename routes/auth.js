const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  
  // console.log("AUTHORIZATION : ", authorization);
  if(req.headers['x-access-token']) {
    return req.headers['x-access-token'];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET_KEY || "knowledgebase",
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    algorithms: ['HS256']
  }),
  optional: jwt({
    secret: process.env.JWT_SECRET_KEY || "knowledgebase",
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    algorithms: ['HS256']
  }),
};

module.exports = auth;
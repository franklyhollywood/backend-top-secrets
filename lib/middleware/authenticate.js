const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    //Grab the session cookie:

    //This is all just copied and i literally don't understand it.
    const cookie = req.cookies.session;
    //verify the JWT contents of the cookie:
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);
    //if Valid, set req.user = jwt's payload (user object)
    req.user = payload;

    next();
  } catch (error) {
    console.error(error);
    error.message = 'You must be signed in to continue';
    error.status = 401;
    next(error);
  }
};

const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies.session;
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch (error) {
    console.error(error);
    error.message = 'You must be signed in to continue';
    error.status = 401;
    next(error);
  }
};

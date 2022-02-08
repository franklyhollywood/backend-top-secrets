module.exports = async (req, res, next) => {
  try {
    if (req.user.email !== 'admin') throw new Error('Unauthorized');
    else next();
  } catch (error) {
    console.error(error);
    error.message = 'You do not have access to view this page';
    error.status = 403;
    next(error);
  }
};

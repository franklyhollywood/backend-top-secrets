module.exports = async (req, res, next) => {
  try {
    const email = req.body.email;
    const splitEmail = email.split('@');
    if (splitEmail[1] !== 'defense.gov') throw new Error('Unauthorized');
    else next();
  } catch (error) {
    console.error(error);
    error.message = 'You do not have access to view this page';
    error.status = 403;
    next(error);
  }
};

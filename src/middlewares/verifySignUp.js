export const checkRolesExisted = (req, res, next) => {
  let roles = ['user', 'admin', 'moderator'];

  if (req.body.roles) {
    for (let i = 0; i < req.body.length; i++) {
      if (!roles.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Role ${req.body.roles[i]} does not exists`,
        });
      }
    }
  }

  next();
};

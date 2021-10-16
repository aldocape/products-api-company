import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
const database = require('../database');

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];

    if (!token) return res.status(403).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.id;

    const user = await database.findUserById(req.userId);
    user.password = 0;

    if (!user) return res.status(404).json({ message: 'User not found' });

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const isModerator = async (req, res, next) => {
  const user = await database.findUserById(req.userId);
  const roles = await database.findRolesByUserId(req.userId);

  console.log(roles);

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === 'moderator') {
      next();
      return;
    }
  }
  return res.status(403).json({ message: 'Require Moderator role' });
};

export const isAdmin = async (req, res, next) => {
  const user = await database.findUserById(req.userId);
  const roles = await database.findRolesByUserId(req.userId);

  console.log(roles);

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === 'admin') {
      next();
      return;
    }
  }
  return res.status(403).json({ message: 'Require Admin role' });
};

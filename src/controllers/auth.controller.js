const database = require('../database');
const requestHandler = require('../middlewares/requestHandler');

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const signup = requestHandler(async (req, res) => {
  const { username, email, password, roles } = req.body;

  // const userFound = database.findUserByEmail(email);

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);

  let rolesUser = [];

  if (roles) {
    rolesUser = roles;
  } else {
    rolesUser = ['user'];
  }

  const user = {
    username,
    email,
    password: hash,
    roles: rolesUser,
  };

  const savedUser = await database.add_user(user);

  const token = jwt.sign({ id: savedUser.userId }, JWT_SECRET, {
    expiresIn: 1800, // 30 min.
  });

  res.status(201).json({ token });
});

export const login = requestHandler(async (req, res) => {
  const userFound = await database.findUserByEmail(req.body.email);

  if (!userFound) {
    return res.status(400).json({ message: 'User not found' });
  }

  const matchPassword = bcrypt.compareSync(
    req.body.password,
    userFound[0].password
  );

  if (!matchPassword)
    return res.status(401).json({ token: null, message: 'Invalid password' });

  const token = jwt.sign(
    {
      id: userFound[0].userId,
    },
    JWT_SECRET,
    { expiresIn: 1800 }
  );
  console.log(userFound);

  res.json({ token });
});

import mysql from 'mysql2/promise';
// import bcrypt from 'bcryptjs';

// const mysql = require("mysql2/promise");

const { DB_CONFIG } = require('./config');

// mysql
//   .createConnection(DB_CONFIG)
//   .then(console.log("La base de datos está conectada"))
//   .catch((error) => console.log(error));

let connection;

// let comparePassword = async (password, receivedPassword) => {
//   return await bcrypt.compare(password, receivedPassword);
// };

// export async function encryptPassword(password) {
// bcrypt.genSalt(10, function (err, salt) {
//   bcrypt.hash('B4c0//', salt, function (err, hash) {
//     const result = await connection.execute(
//       'INSERT INTO users (name, category, price, imgUrl) VALUES (?, ?, ?, ?)',
//       [name, category, price, imgUrl]
//     );
//     return await this.findById(result[0].insertId);
//   });
// });
// }

export async function initConnection() {
  connection = await mysql.createConnection(DB_CONFIG);
}

export async function findById(productId) {
  const [products] = await connection.execute(
    'SELECT * FROM products WHERE productId = ?',
    [productId]
  );
  if (products.length) {
    return products[0];
  } else {
    return undefined;
  }
}

export async function add(product) {
  const { name, category, price, imgUrl } = product;

  const result = await connection.execute(
    'INSERT INTO products (name, category, price, imgUrl) VALUES (?, ?, ?, ?)',
    [name, category, price, imgUrl]
  );

  return await this.findById(result[0].insertId);
}

export async function list(filterName) {
  let products = [];
  if (filterName === undefined) {
    filterName = '';
  }

  [products] = await connection.execute(
    `SELECT * FROM products WHERE name like "%${filterName}%" ORDER BY name`
  );

  return products;
}

export async function update(productId, newProductData) {
  const product = await this.findById(productId);

  if (!product) {
    throw new Error(`No existe un producto con id "${productId}`);
  }

  if (newProductData.name) product.name = newProductData.name;
  if (newProductData.category) product.category = newProductData.category;
  if (newProductData.price) product.price = newProductData.price;
  if (newProductData.imgUrl) product.imgUrl = newProductData.imgUrl;

  await connection.execute(
    'UPDATE products SET name = ?, category = ?, price = ?, imgUrl = ? WHERE productId = ?',
    [product.name, product.category, product.price, product.imgUrl, productId]
  );

  return product;
}

export async function remove(productId) {
  const product = await this.findById(productId);

  if (!product) {
    throw new Error(`No existe un producto con id "${productId}`);
  }

  await connection.execute('DELETE FROM products WHERE productId = ?', [
    productId,
  ]);
}

export async function findUserById(userId) {
  const [users] = await connection.execute(
    'SELECT * FROM users WHERE userId = ?',
    [userId]
  );
  if (users.length) {
    return users[0];
  } else {
    return undefined;
  }
}

export async function findUserByEmail(email) {
  const [users] = await connection.execute(
    'SELECT users.*, roles.name FROM users INNER JOIN users_roles ON users.userId = users_roles.userId INNER JOIN roles ON users_roles.rolId = roles.rolId WHERE users.email = ?',
    [email]
  );
  if (users.length) return users;

  return undefined;
}

export async function findRolesByUserId(userId) {
  const [users] = await connection.execute(
    'SELECT roles.name FROM users INNER JOIN users_roles ON users.userId = users_roles.userId INNER JOIN roles ON users_roles.rolId = roles.rolId WHERE users.userId = ?',
    [userId]
  );
  if (users.length) return users;

  return undefined;
}

export async function add_user(user) {
  const { username, email, password, roles } = user;

  const result = await connection.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password]
  );

  let role;
  let role2 = undefined;
  let role3 = undefined;
  let result_roles;
  let query = '';

  role = await this.findRoleByName(roles[0]);
  if (roles[1]) role2 = await this.findRoleByName(roles[1]);
  if (roles[2]) role3 = await this.findRoleByName(roles[2]);

  query += `(${result[0].insertId}, ${role.rolId})`;

  if (role2) query += `, (${result[0].insertId}, ${role2.rolId})`;

  if (role3) query += `, (${result[0].insertId}, ${role2.rolId})`;

  result_roles = await connection.execute(
    `INSERT INTO users_roles (userId, rolId) VALUES ${query}`
  );

  return await this.findUserById(result[0].insertId);
}

export async function countRoles() {
  const counter = await connection.execute('SELECT COUNT(*) FROM roles');
  return counter;
}

export async function findRoleById(rolId) {
  const [roles] = await connection.execute(
    'SELECT * FROM roles WHERE rolId = ?',
    [rolId]
  );

  if (roles.length) return roles[0];

  return undefined;
}

export async function findRoleByName(name) {
  const [roles] = await connection.execute(
    'SELECT * FROM roles WHERE name = ?',
    [name]
  );
  if (roles.length) return roles[0];

  return undefined;
}

export async function addNewRole(name) {
  const result = await connection.execute(
    'INSERT INTO roles (name) VALUES (?)',
    [name]
  );

  return await this.findRoleById(result[0].insertId);
}

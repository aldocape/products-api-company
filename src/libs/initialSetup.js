const db = require('../database');

export const createRoles = async () => {
  try {
    const count = db.countRoles();

    if (count > 0) return;

    const values = [];

    // values.push(db.addNewRole('user'));
    // values.push(db.addNewRole('moderator'));
    // values.push(db.addNewRole('admin'));

    console.log(values);
  } catch (error) {
    console.error(error);
  }
};

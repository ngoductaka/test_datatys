const shajs = require('sha.js');
const db = require('../sql/db');

const SECRET = process.env.SECRET || 'test-dev-secret';
/**
 * Generate hash password
 * Generate online: https://emn178.github.io/online-tools/sha256.html
 * @param {string} email
 * @param {string} password
 */
const hashPassword = (email, password) => shajs('sha256').update(`${email}${password}${SECRET}`).digest('hex');

const authenticateUser = async (email, password) => {
  const hash = hashPassword(email, password);
  const queryText = {
    text: ` SELECT s.id, s.email, s.first_name, s.last_name
              FROM users s
              WHERE email = $1 AND password = $2`,
    values: [email, hash],
  };
  try {
    const { rows } = await db.query(queryText);
    if (rows[0]) {
      const user = rows[0];
      return user;
    }
    throw (new Error('Bad credentials'));
  } catch (error) {
    throw (new Error('Bad credentials'));
  }
};

const createUser = async (email, password) => {
  const hash = hashPassword(email, password);
  const queryText = {
    text: `INSERT INTO users (email, password) VALUES ($1, $2)`,
    values: [email, hash],
  };
  try {
    const { rows } = await db.query(queryText);
    return rows;
  } catch (error) {

    throw error;
  }
};


const getList = async () => {
  const queryText = {
    text: ` SELECT * FROM users`,
  };
  try {
    const { rows } = await db.query(queryText);
    return rows.map(({ password, ...rest }) => rest);
  } catch (error) {
    throw (new Error('Bad credentials'));
  }
}

const getUserById = async (id) => {
  const queryText = {
    text: ` SELECT *
    FROM users s
    WHERE id = $1`,
    values: [id],
  };
  try {
    const { rows } = await db.query(queryText);
    if (rows[0]) {
      const { password, ...rest } = rows[0]
      return rest;
    }
    throw (new Error('Not Found'));
  } catch (error) {
    console.log(error);
    throw (new Error('Not Found'));
  }
}
const updateUser = async (data) => {
  let listFields = [];
  let listData = [];

  let index = 1;
  for (let key in data) {
    const field = `${key} = $${index}`;
    listFields.push(field);
    listData.push(data[key]);
    index++;
  }

  const fields = listFields.join(', ');

  let text = `UPDATE users SET ${fields} WHERE id = $${index}`;
  listData.push(data.id);

  let queryText = { text, values: listData };

  try {
    const resp = await db.query(queryText);
    return resp.rowCount;
  } catch (error) {
    console.log(error.stack);
    return 0;
  }

}

module.exports = {
  authenticateUser,
  getUserById,
  updateUser,
  getList,
  createUser
};

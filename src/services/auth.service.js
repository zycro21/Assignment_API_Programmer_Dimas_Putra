const pool = require("../config/db");
const bcrypt = require("bcrypt");

const registerUser = async ({ email, first_name, last_name, password }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // cek email sudah ada atau belum
    const checkUserQuery = `
      SELECT id
      FROM users
      WHERE email = $1
    `;

    const existingUser = await client.query(checkUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const insertUserQuery = `
      INSERT INTO users (
        email,
        first_name,
        last_name,
        password
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const newUser = await client.query(insertUserQuery, [
      email,
      first_name,
      last_name,
      hashedPassword,
    ]);

    const userId = newUser.rows[0].id;

    // create data balance default
    const insertBalanceQuery = `
      INSERT INTO balances (
        user_id,
        balance
      )
      VALUES ($1, $2)
    `;

    await client.query(insertBalanceQuery, [userId, 0]);

    await client.query("COMMIT");

    return true;
  } catch (err) {
    await client.query("ROLLBACK");

    throw err;
  } finally {
    client.release();
  }
};

const loginUser = async ({ email, password }) => {
  const query = `
    SELECT
      id,
      email,
      password
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  // user tidak ditemukan
  if (result.rows.length === 0) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const user = result.rows[0];

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    id: user.id,
    email: user.email,
  };
};

const getProfile = async (email) => {
  const query = `
    SELECT
      email,
      first_name,
      last_name,
      profile_image
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  // user tidak ditemukan
  if (result.rows.length === 0) {
    throw new Error("USER_NOT_FOUND");
  }

  return result.rows[0];
};

const updateProfile = async ({ email, first_name, last_name }) => {
  const query = `
    UPDATE users
    SET
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name)
    WHERE email = $3
    RETURNING
      email,
      first_name,
      last_name,
      profile_image
  `;

  const values = [first_name || null, last_name || null, email];

  const result = await pool.query(query, values);

  // user tidak ditemukan
  if (result.rows.length === 0) {
    throw new Error("USER_NOT_FOUND");
  }

  return result.rows[0];
};

const updateProfileImage = async ({ email, profile_image }) => {
  const query = `
    UPDATE users
    SET profile_image = $1
    WHERE email = $2
    RETURNING
      email,
      first_name,
      last_name,
      profile_image
  `;

  const values = [profile_image, email];

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error("USER_NOT_FOUND");
  }

  return result.rows[0];
};

const getProfileImageByEmail = async (email) => {
  const query = `
    SELECT profile_image
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  if (result.rows.length === 0) {
    throw new Error("USER_NOT_FOUND");
  }

  return result.rows[0].profile_image;
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  updateProfileImage,
  getProfileImageByEmail,
};

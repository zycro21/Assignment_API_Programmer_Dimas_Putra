const pool = require("../config/db");

const getBalanceByEmail = async (email) => {
  const query = `
    SELECT
      b.balance
    FROM balances b
    INNER JOIN users u
      ON b.user_id = u.id
    WHERE u.email = $1
  `;

  const values = [email];

  const result = await pool.query(query, values);

  // user / balance tidak ditemukan
  if (result.rows.length === 0) {
    throw new Error("BALANCE_NOT_FOUND");
  }

  return result.rows[0];
};

const topUpBalance = async ({ email, amount }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ambil user id dan balance
    const getUserQuery = `
      SELECT
        u.id,
        b.balance
      FROM users u
      INNER JOIN balances b
        ON u.id = b.user_id
      WHERE u.email = $1
    `;

    const userResult = await client.query(getUserQuery, [email]);

    if (userResult.rows.length === 0) {
      throw new Error("USER_NOT_FOUND");
    }

    const user = userResult.rows[0];

    // update balance
    const updateBalanceQuery = `
      UPDATE balances
      SET
        balance = balance + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING balance
    `;

    const balanceResult = await client.query(updateBalanceQuery, [
      amount,
      user.id,
    ]);

    // generate invoice number
    const invoiceNumber = `TOPUP-${Date.now()}`;

    // insert transaction
    const insertTransactionQuery = `
      INSERT INTO transactions (
        invoice_number,
        user_id,
        transaction_type,
        total_amount,
        description
      )
      VALUES ($1, $2, $3, $4, $5)
    `;

    await client.query(insertTransactionQuery, [
      invoiceNumber,
      user.id,
      "TOPUP",
      amount,
      "Top Up Balance",
    ]);

    await client.query("COMMIT");

    return balanceResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");

    throw err;
  } finally {
    client.release();
  }
};

const createTransaction = async ({ email, service_code }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ambil user + balance
    const getUserQuery = `
      SELECT
        u.id,
        b.balance
      FROM users u
      INNER JOIN balances b
        ON u.id = b.user_id
      WHERE u.email = $1
    `;

    const userResult = await client.query(getUserQuery, [email]);

    if (userResult.rows.length === 0) {
      throw new Error("USER_NOT_FOUND");
    }

    const user = userResult.rows[0];

    // cek service
    const getServiceQuery = `
      SELECT
        service_code,
        service_name,
        service_tariff
      FROM services
      WHERE service_code = $1
    `;

    const serviceResult = await client.query(getServiceQuery, [service_code]);

    if (serviceResult.rows.length === 0) {
      throw new Error("SERVICE_NOT_FOUND");
    }

    const service = serviceResult.rows[0];

    // cek balance cukup atau tidak
    if (Number(user.balance) < Number(service.service_tariff)) {
      throw new Error("INSUFFICIENT_BALANCE");
    }

    // kurangi balance
    const updateBalanceQuery = `
      UPDATE balances
      SET
        balance = balance - $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
    `;

    await client.query(updateBalanceQuery, [service.service_tariff, user.id]);

    // generate invoice number
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    // random 4 karakter
    const randomString = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

    const invoiceNumber = `INV-${year}${month}${day}-${randomString}`;

    // insert transaction
    const insertTransactionQuery = `
      INSERT INTO transactions (
        invoice_number,
        user_id,
        service_code,
        transaction_type,
        total_amount,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        invoice_number,
        service_code,
        transaction_type,
        total_amount,
        created_at
    `;

    const transactionResult = await client.query(insertTransactionQuery, [
      invoiceNumber,
      user.id,
      service.service_code,
      "PAYMENT",
      service.service_tariff,
      service.service_name,
    ]);

    await client.query("COMMIT");

    const transaction = transactionResult.rows[0];

    return {
      invoice_number: transaction.invoice_number,
      service_code: service.service_code,
      service_name: service.service_name,
      transaction_type: transaction.transaction_type,
      total_amount: transaction.total_amount,
      created_on: transaction.created_at,
    };
  } catch (err) {
    await client.query("ROLLBACK");

    throw err;
  } finally {
    client.release();
  }
};

const getTransactionHistory = async ({ email, offset = 0, limit }) => {
  // cari user berdasarkan email JWT
  const getUserQuery = `
    SELECT id
    FROM users
    WHERE email = $1
  `;

  const userResult = await pool.query(getUserQuery, [email]);

  if (userResult.rows.length === 0) {
    throw new Error("USER_NOT_FOUND");
  }

  const user = userResult.rows[0];

  let query = `
    SELECT
      invoice_number,
      transaction_type,
      description,
      total_amount,
      created_at AS created_on
    FROM transactions
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const values = [user.id];

  // jika limit dikirim
  if (limit !== undefined) {
    query += `
      LIMIT $2
      OFFSET $3
    `;

    values.push(limit);
    values.push(offset);
  }

  const result = await pool.query(query, values);

  return {
    offset,
    limit: limit ?? null,
    records: result.rows,
  };
};

module.exports = {
  getBalanceByEmail,
  topUpBalance,
  createTransaction,
  getTransactionHistory,
};

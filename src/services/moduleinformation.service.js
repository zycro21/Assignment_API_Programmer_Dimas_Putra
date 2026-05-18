const pool = require("../config/db");

const getBanners = async () => {
  const query = `
    SELECT
      banner_name,
      banner_image,
      description
    FROM banners
    ORDER BY created_at ASC
  `;

  const result = await pool.query(query);

  return result.rows;
};

const getServices = async () => {
  const query = `
    SELECT
      service_code,
      service_name,
      service_icon,
      service_tariff
    FROM services
    ORDER BY created_at ASC
  `;

  const result = await pool.query(query);

  return result.rows;
};

module.exports = {
  getBanners,
  getServices,
};

const { successResponse, errorResponse } = require("../utils/response");

const {
  getBanners,
  getServices,
} = require("../services/moduleinformation.service");

const getBannerController = async (req, res) => {
  try {
    const banners = await getBanners();

    return successResponse(res, "Sukses", banners);
  } catch (err) {
    console.error(err);

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

const getServicesController = async (req, res) => {
  try {
    const services = await getServices();

    return successResponse(res, "Sukses", services);
  } catch (err) {
    console.error(err);

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

module.exports = {
  getBannerController,
  getServicesController,
};

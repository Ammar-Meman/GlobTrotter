import * as geoapifyService from "../services/geoapify.service.js";
import * as pexelsService from "../services/pexels.service.js";

export const searchCities = async (req, res, next) => {
  try {
    const query = req.query.q || "";
    const results = await geoapifyService.searchCities(query);
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const getCityImage = async (req, res, next) => {
  try {
    const { cityName } = req.params;
    const result = await pexelsService.getCityImage(cityName);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

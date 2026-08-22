import * as mapboxService from "../services/mapbox.service.js";
import * as unsplashService from "../services/unsplash.service.js";

export const searchCities = async (req, res, next) => {
  try {
    const query = req.query.q || "";
    const results = await mapboxService.searchCities(query);
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
    const result = await unsplashService.getCityImage(cityName);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

import * as geoapifyService from "../services/geoapify.service.js";

export const searchActivities = async (req, res, next) => {
  try {
    const { city, type, maxCost } = req.query;
    const results = await geoapifyService.searchActivities({
      city,
      type,
      maxCost: maxCost !== undefined ? Number(maxCost) : undefined,
    });
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

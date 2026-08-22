import * as budgetService from "../services/budget.service.js";

export const getTripBudget = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const result = await budgetService.getTripBudget(req.user.id, tripId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

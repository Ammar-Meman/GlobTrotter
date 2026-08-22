import * as activityService from "../services/activity.service.js";

export const createActivity = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const result = await activityService.createActivity(req.user.id, stopId, req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await activityService.updateActivity(req.user.id, id, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await activityService.deleteActivity(req.user.id, id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const reorderActivities = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const { activityIds } = req.body;
    const result = await activityService.reorderActivities(req.user.id, stopId, activityIds);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

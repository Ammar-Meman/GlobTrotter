import * as stopService from "../services/stop.service.js";

export const createStop = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const result = await stopService.createStop(req.user.id, tripId, req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await stopService.updateStop(req.user.id, id, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await stopService.deleteStop(req.user.id, id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const reorderStops = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { stopIds } = req.body;
    const result = await stopService.reorderStops(req.user.id, tripId, stopIds);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

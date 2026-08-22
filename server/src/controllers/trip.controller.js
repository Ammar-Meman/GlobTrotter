import * as tripService from "../services/trip.service.js";

export const createTrip = async (req, res, next) => {
  try {
    const result = await tripService.createTrip(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const result = await tripService.getTrips(req.user.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const result = await tripService.getTripById(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicTrip = async (req, res, next) => {
  try {
    const result = await tripService.getPublicTripByShareId(req.params.shareId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const copyTrip = async (req, res, next) => {
  try {
    const result = await tripService.copyTrip(req.user.id, req.params.id);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const result = await tripService.updateTrip(req.user.id, req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const result = await tripService.deleteTrip(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

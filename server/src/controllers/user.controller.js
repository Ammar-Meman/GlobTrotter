import * as userService from "../services/user.service.js";

export const updateMe = async (req, res, next) => {
  try {
    const result = await userService.updateMe(req.user.id, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    const { password } = req.body || {};
    const result = await userService.deleteMe(req.user.id, password);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedDestinations = async (req, res, next) => {
  try {
    const result = await userService.getSavedDestinations(req.user.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const addSavedDestination = async (req, res, next) => {
  try {
    const result = await userService.addSavedDestination(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSavedDestination = async (req, res, next) => {
  try {
    const result = await userService.deleteSavedDestination(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

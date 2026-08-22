import * as uploadService from "../services/upload.service.js";

export const uploadFile = async (req, res, next) => {
  try {
    const result = await uploadService.uploadFile(req.file);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

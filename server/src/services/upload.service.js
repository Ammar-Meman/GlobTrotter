import { uploadBufferToCloudinary } from "../lib/cloudinary.js";
import { ValidationError } from "../lib/errors.js";

export const uploadFile = async (file) => {
  if (!file || !file.buffer) {
    throw new ValidationError("file is required");
  }

  const result = await uploadBufferToCloudinary(file.buffer, "globetrotter");

  return {
    url: result.secure_url || result.url,
  };
};

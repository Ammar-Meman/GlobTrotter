import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = (fileBuffer, folder = "globetrotter") => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    const base64 = fileBuffer.toString("base64");
    const dataUri = `data:image/jpeg;base64,${base64}`;
    return Promise.resolve({
      secure_url: dataUri,
      url: dataUri,
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.warn("[cloudinary] Upload error, falling back to data URI:", error.message);
          const base64 = fileBuffer.toString("base64");
          const dataUri = `data:image/jpeg;base64,${base64}`;
          return resolve({
            secure_url: dataUri,
            url: dataUri,
          });
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;

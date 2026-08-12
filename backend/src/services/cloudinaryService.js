import cloudinary from '../config/cloudinary.js';

// const uploadBuffer = (buffer, { folder, resourceType = 'image', publicId } = {}) =>
//   new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder, resource_type: resourceType, public_id: publicId },
//       (error, result) => (error ? reject(error) : resolve(result)),
//     );

//     stream.end(buffer);
//   });

// export { uploadBuffer };

const uploadBuffer = (
  buffer,
  {
    folder,
    resourceType = 'image',
    publicId,
    originalFilename,
  } = {}
) =>
  new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: resourceType,
    };

    if (publicId) {
      options.public_id = publicId;
    }

    if (originalFilename) {
      options.filename_override = originalFilename;
    }

    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          console.error('Cloudinary upload failed:', error);
          reject(error);
          return;
        }

        resolve(result);
      })
      .end(buffer);
  });

export { uploadBuffer };
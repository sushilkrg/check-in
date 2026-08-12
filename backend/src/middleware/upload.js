import multer from 'multer';

const storage = multer.memoryStorage();

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 2 },
  fileFilter: (req, file, callback) => {
    const isImage = ['candidateImage', 'visitorPhoto'].includes(file.fieldname);
    const isAllowed = allowedTypes.includes(file.mimetype);

    if (isAllowed || isImage) {
      callback(null, true);
      return;
    }

    callback(new Error('Unsupported file type'));
  },
});

export default upload;

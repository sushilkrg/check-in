import BusinessMeeting from '../models/BusinessMeeting.js';
import { uploadBuffer } from '../services/cloudinaryService.js';
import { validateMeeting } from '../validators/businessMeetingValidator.js';

const create = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const validationError = validateMeeting(data);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const photo = req.files?.visitorPhoto?.[0];

    if (!photo) {
      return res.status(400).json({ success: false, message: 'Visitor photo is required' });
    }

    const image = await uploadBuffer(photo.buffer, {
      folder: 'visitor-checkin/business-visitors',
      resourceType: 'image',
    });

    const document = await BusinessMeeting.create({
      ...data,
      visitorPhotoUrl: image.secure_url,
    });

    return res.status(201).json({ success: true, data: document });
  } catch (error) {
    return next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const documents = await BusinessMeeting.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: documents });
  } catch (error) {
    return next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const document = await BusinessMeeting.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    return res.json({ success: true, data: document });
  } catch (error) {
    return next(error);
  }
};

export { create, list, get };

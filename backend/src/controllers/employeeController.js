import Employee from '../models/Employee.js';

const list = async (req, res, next) => {
  try {
    const search = String(req.query.search || '').trim();
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
      ];
    }

    const data = await Employee.find(query).sort({ name: 1 }).limit(20).lean();
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export { list };

import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.cookies?.admin_token;

  try {
    if (!token) throw new Error('Missing admin token');
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

export default auth;

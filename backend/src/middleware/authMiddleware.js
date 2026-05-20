import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = {
        id: user._id,
        role: decoded.role,
        email: user.email,
        name: user.name,
        phone: user.phone,
        roles: user.roles,
      };
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.roles || [req.user.role];
    const hasRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        message: `User roles [${userRoles.join(', ')}] are not authorized to access this route`,
      });
    }
    next();
  };
};

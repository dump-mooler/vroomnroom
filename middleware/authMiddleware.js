// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, '234qwer45t7uoklfghj7uiasd23dwed32.,.,sdfsdaf', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user.role.includes('admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

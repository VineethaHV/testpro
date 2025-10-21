const jwt = require('jsonwebtoken');

module.exports = function (roles = []) {
  return function (req, res, next) {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ error: 'No token provided' });
    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};
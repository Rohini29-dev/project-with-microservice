const jwt = require("jsonwebtoken");

function createAuthMiddleware(role = ['user']) {
  return function (req, res, next) {
    const token =
      req.cookies?.token ||
      req.headers?.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorization token"
      });
    }

    try {
      const decoded = require('jsonwebtoken').verify(
        token,
        process.env.JWT_SECRET || 'testsecret'
      );

      if (!role.includes(decoded.role)) {
        return res.status(403).json({
          message: "Forbidden: Insufficient permission"
        });
      }

      req.user = decoded; 
      next();
    } catch (error) {
      console.log("AUTH ERROR ", error.message); 
      return res.status(500).json({
        message: "Internal error"
      });
    }
  };
}

module.exports = { createAuthMiddleware };
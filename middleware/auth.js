const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Remove Bearer if present
  if (authHeader.startsWith("Bearer ")) {
    authHeader = authHeader.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

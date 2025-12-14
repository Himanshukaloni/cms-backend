// middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
    // Get token from headers
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Decode token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Save user info (id, role, is_approved, email)
        req.user = decoded;

        next(); // Continue to route
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

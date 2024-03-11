
const jwt = require("jsonwebtoken");
const User = require("../models/useModel");

const auth = async (req, res, next) => {
  try {
    // Extract token from request headers
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    // Attach user object to request for further usage in route handlers
    req.user = user;

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = { auth };

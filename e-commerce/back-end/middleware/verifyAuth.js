const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) return res.status(401).json({ message: "Login required" });

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // works for both admin & user

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
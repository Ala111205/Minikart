const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("HEADER:", req.headers.authorization);

  if (!token) return res.status(401).json({ message: "No token" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;
  console.log("USER:", req.user);
  next();
};
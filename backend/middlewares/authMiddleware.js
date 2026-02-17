const jwt = require("jsonwebtoken");
const User = require("../models/User");



const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {

      console.log("Authorization header:", req.headers.authorization);
      token = req.headers.authorization.split(" ")[1];

      console.log("JWT_SECRET:", process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
       console.log("Decoded:", decoded);

      req.user = await User.findById(decoded.id).select("-password");

      return next(); 
            } catch (error) {
            console.log("JWT ERROR:", error);
            return res.status(401).json({ message: "Not authorized" });
            }

  }

  return res.status(401).json({ message: "No token" });

  
 


};

module.exports = { protect };


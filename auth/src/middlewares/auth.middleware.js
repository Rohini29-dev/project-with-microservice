const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  console.log("Cookies =>", req.cookies);

  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(" ")[1];

  console.log("Token =>", token);

  if (!token) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded =>", decoded);

    req.user = decoded;

    next();

  } catch (error) {

    console.log(error);

    return res.status(401).json({
      message: "Invalid token"
    });
  }

}

module.exports = { authMiddleware };
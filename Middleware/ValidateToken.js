import jwt from "jsonwebtoken";

const ValidateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("token", token);
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    console.log("verified token", decoded);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

export default ValidateToken;

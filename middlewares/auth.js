const { verifyToken } = require("../utilities/jwt");

const auth = (req, res, next) => {
  try {
    const userToken = req.headers["authorization"];
    if (!userToken) {
      console.error("Token missing");
      return res.status(401).json({ error: "unauthorized1" });
    }
    const token = userToken.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload) {
      console.error("Invalid token");
      return res.status(401).json({ error: "unauthorized2" });
    }
    req.user = payload;

    if (
      payload.role !== "admin" &&
      payload.role !== "doctor" &&
      payload.role !== "patient"
    ) {
      console.error("Invalid role");
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (err) {
    console.error("Error in authentication middleware:", err);
    return res.status(401).json({ error: "unauthorized3" });
  }
};

module.exports = { auth };

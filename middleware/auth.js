const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
      status: true,
    });
    if (!user) throw new Error("");
    req.id = decoded._id;
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ error: "please auth" });
  }
};

module.exports = auth;

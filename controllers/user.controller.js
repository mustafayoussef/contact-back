const User = require("../Models/user.model");

module.exports = {
  register: async (req, res, next) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(200).json({
        apiStatus: true,
        data: { user },
        message: "user added",
      });
    } catch (error) {
      res.status(500).json({
        apiStatue: false,
        data: error.message,
        message: "error in add new user",
      });
    }
  },
  login: async (req, res, next) => {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );
      if (user.tokens.length >= 2)
        throw Error("You should log out any devices to be able login");
      const token = await user.generateToken();
      res.status(200).json({
        apiStatus: true,
        data: { user, token },
        message: "welcome",
      });
    } catch (error) {
      res.status(500).json({
        apiStatus: false,
        data: error.message,
        message: "error login",
      });
    }
  },
  logout: async (req, res, next) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.json("logged out");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

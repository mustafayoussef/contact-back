const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: true,
      match: /[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/,
    },
    lastname: {
      type: String,
      trim: true,
      required: true,
      match: /[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("invalid email");
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    },
    status: { type: Boolean, default: true },
    tokens: [{ token: { type: String, trim: true } }],
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.pre("save", async function (next) {
  user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 8);
  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("invalid email");

  if (!user.status) throw new Error("please activate your account");

  const isValidPass = await bcrypt.compare(password, user.password);
  if (!isValidPass) throw new Error("invalid password");

  return user;
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWTSECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
const User = mongoose.model("User", userSchema);
module.exports = User;

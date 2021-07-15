const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema({
  status: { type: Boolean, default: true },
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isMobilePhone(value, ["ar-EG"]))
        throw new Error("egyption mobile needed");
    },
  },
  note: { type: String, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;

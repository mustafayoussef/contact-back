const Contact = require("../Models/contact.model");
const mongoose = require("mongoose");
const createError = require("http-errors");

module.exports = {
  addContact: async (req, res, next) => {
    try {
      contact = new Contact({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        phone: req.body.phone,
        note: req.body.note,
        userID: req.user._id,
      });
      await contact.save();
      res.status(200).json({
        apiStatus: true,
        data: { contact },
        message: "added",
      });
    } catch (error) {
      res.status(500).json({
        apiStatus: false,
        data: error.message,
        message: "error adding",
      });
    }
  },
  getAllContacts: async (req, res, next) => {
    try {
      let pageNumber = req.query.page;
      if (pageNumber < 1 || !req.query.page) {
        pageNumber = 1;
      }
      let pageLimit = 5;
      let skip = (pageNumber - 1) * pageLimit;

      const contacts = await Contact.find()
        .populate({ path: "userID", select: "firstname lastname" })
        .skip(skip)
        .limit(pageLimit);
      res.status(200).json({
        apiStatus: true,
        contacts: contacts,
        message: "done",
        page: pageNumber,
      });
    } catch (error) {
      res.status(500).json({
        apiStatus: false,
        data: error.message,
        message: "Can not get contacts",
      });
    }
  },
  getUserContact: async (req, res, next) => {
    try {
      let pageNumber = req.query.page;
      if (pageNumber < 1 || !req.query.page) {
        pageNumber = 1;
      }
      let pageLimit = 5;
      let skip = (pageNumber - 1) * pageLimit;

      const contacts = await Contact.find({ userID: req.user._id })
        .populate({
          path: "userID",
          select: "firstname lastname",
        })
        .skip(skip)
        .limit(pageLimit);
      res.status(200).json({
        apiStatus: true,
        contacts: contacts,
        message: "done",
        page: pageNumber,
      });
    } catch (error) {
      res.status(500).json({
        apiStatus: false,
        data: error.message,
        message: "Can not get contacts",
      });
    }
  },
  deleteContact: async (req, res, next) => {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) throw new Error("contact previously deleted");
      if (req.id != contact.userID)
        throw new Error("You cannot delete this contact");
      await Contact.findByIdAndDelete(contact._id);
      res.status(200).json({
        apiStatus: true,
        message: "contact deleted",
      });
    } catch (error) {
      res.status(500).json({
        apiStatus: false,
        data: error.message,
        message: "Can not delete contacts",
      });
    }
  },
  editContact: async (req, res, next) => {
    try {
      const contact = await Contact.findById(req.params.id);
      if (req.id != contact.userID)
        throw new Error("You cannot edit this contact");
      await Contact.findByIdAndUpdate({ _id: req.params.id }, req.body);
      await Contact.findByIdAndUpdate(
        { _id: req.params.id },
        { status: false }
      );
      res.status(200).json({
        apiStatus: true,
        message: "edit deleted",
      });
    } catch (error) {
      res.status(500).json({
        apiStatus: false,
        data: error.message,
        message: "Can not edit contacts",
      });
    }
  },
  searchContact: async (req, res, next) => {
    try {
      let pageNumber = req.query.page;
      if (pageNumber < 1 || !req.query.page) {
        pageNumber = 1;
      }
      let pageLimit = 5;
      let skip = (pageNumber - 1) * pageLimit;
      let name = req.query.name;

      const result = await Contact.find({ name: { $regex: new RegExp(name) } })
        .skip(skip)
        .limit(pageLimit);
      res.status(200).json({
        apiStatus: true,
        contacts: result,
        message: "done",
        page: pageNumber,
      });
    } catch (error) {
      res.status(500).json({
        apiStatus: false,
        data: error.message,
        message: "no contacts",
      });
    }
  },
};

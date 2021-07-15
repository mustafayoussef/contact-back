const contactRoutes = require("express").Router();
const contact = require("../controllers/contact.controller");
const auth = require("../middleware/auth");

contactRoutes.post("/addcontact", auth, contact.addContact);
contactRoutes.get("/contacts", auth, contact.getAllContacts);
contactRoutes.get("/usercontacts", auth, contact.getUserContact);
contactRoutes.delete("/deletecontact/:id", auth, contact.deleteContact);
contactRoutes.patch("/editcontact/:id", auth, contact.editContact);
contactRoutes.get("/searchcontact", auth, contact.searchContact);

module.exports = contactRoutes;

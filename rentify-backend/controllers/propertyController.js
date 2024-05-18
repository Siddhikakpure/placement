const Property = require('../models/propertyModel');
const nodemailer = require('nodemailer');

const postProperty = async (req, res) => {
  try {
    const { place, area, bedrooms, bathrooms, amenities } = req.body;
    const property = new Property({
      owner: req.user.userId,
      place,
      area,
      bedrooms,
      bathrooms,
      amenities,
    });
    await property.save();
    res.status(201).json({ message: 'Property posted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'firstName lastName email phoneNumber');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'firstName lastName email phoneNumber');
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { place, area, bedrooms, bathrooms, amenities } = req.body;
    const property = await Property.findByIdAndUpdate(req.params.id, {
      place,
      area,
      bedrooms,
      bathrooms,
      amenities,
    }, { new: true });
    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    property.likes += 1;
    await property.save();
    res.json({ likes: property.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const contactSeller = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'firstName lastName email phoneNumber');
    const seller = property.owner;

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: seller.email,
      subject: 'New Interested Buyer',
      text: `Hello ${seller.firstName},\n\nSomeone is interested in your property located at ${property.place}. Here are the buyer details:\n\nName: ${req.user.firstName} ${req.user.lastName}\nEmail: ${req.user.email}\nPhone: ${req.user.phoneNumber}\n\nRegards,\nRentify Team`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Seller contacted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  postProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  likeProperty,
  contactSeller,
};

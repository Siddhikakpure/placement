const express = require('express');
const {
  postProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  likeProperty,
  contactSeller,
} = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, postProperty);
router.get('/', getProperties);
router.get('/:id', getProperty);
router.put('/:id', authMiddleware, updateProperty);
router.delete('/:id', authMiddleware, deleteProperty);
router.post('/:id/like', authMiddleware, likeProperty);
router.post('/:id/contact', authMiddleware, contactSeller);

module.exports = router;

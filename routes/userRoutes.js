const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', userController.getAllUsers);
router.get('/profile', authMiddleware.authenticateToken, userController.getProfile);
router.delete('/:id', userController.deleteUserById);

module.exports = router;

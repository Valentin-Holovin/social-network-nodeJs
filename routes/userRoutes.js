const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/users', userController.getAllUsers);
router.get('/profile', authMiddleware.authenticateToken, userController.getProfile);
router.delete('/:userId', userController.deleteUserById);
router.put('/:userId', upload.single('photo'), userController.updateUser);
router.delete('/:userId/photo', userController.deletePhoto);

module.exports = router;

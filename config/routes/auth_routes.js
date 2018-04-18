const express = require('express');

const authController = require('../../controllers/auth_controller');

const router = express.Router();


router.route('/login')
  .post(authController.authenticateUser);


module.exports = router;

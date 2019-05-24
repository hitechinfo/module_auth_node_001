const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const controller = require('./tokenF.controller');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/create', controller.createToken);
router.post('/refresh', controller.refreshToken);
router.post('/delete', controller.deleteToken);

module.exports = router;

'use strict';

var express = require('express');
var controller = require('./oauth.controller');

var router = express.Router();

router.get('/twitter', controller.twitter);
router.get('/oauth/twitter', controller.otwitter);

// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
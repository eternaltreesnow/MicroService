'use strict'

const Express = require('express');
const register = require('./control/register');
const update = require('./control/update');
const remove = require('./control/remove');
const query = require('./control/query');

let router = Express.Router();

router.get('/service', query);

router.post('/service', register);

router.delete('/service', remove);

router.put('/service', update);

module.exports = router;

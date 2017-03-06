const config = require('config');
const express = require('express');

function postAuthentication(req, res) {
	res.status(config.httpOk).end();
}

const router = express.Router();
router.post('/', postAuthentication);

module.exports = router;
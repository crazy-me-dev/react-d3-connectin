const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const utils = require('../common/utils')
const constants = require('../common/constants')
const repository = require('./routes/repository')
const user = require('./routes/user')

const queries = require('../common/queries')

const app = express()
const logger = utils.logger
const HttpStatus = constants.http

const init = () => {
	queries.loadQueries()
	app.use(bodyParser.json())
	app.use(cors(constants.cors))
	
	app.get('/api/repository/commits/:owner/:name', repository.getCommits)

	app.options('/api/user/token')
	app.post('/api/user/token', user.postToken)
	
	app.use((req, res) => {
		res.status(HttpStatus.notFound).send({ 'message': 'Resource not found' })
	})
	
	const port = process.env.PORT || 9000
	
	app.set('port', port)
	
	app.listen(port, () => {
		logger.info('app.init() info: Server started and listening on port %s', port)
	})
}

module.exports = {
	init
}
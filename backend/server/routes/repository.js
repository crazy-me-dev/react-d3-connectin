const rp = require('request-promise-native')
const utils = require('../../common/utils')
const HttpStatus = require('../../common/constants').http

const queries = require('../../common/queries')
const AppError = require('../../common/error')
const logger = utils.logger

const getCommits = (req, res) => {	
	const query = queries.getQuery('repo-commits')
	if (!query) {
		logger.error({ message: 'repository.getCommits() error: query repo-commits does not exist' })
		const appError = new AppError({
			message: 'Internal server error',
			status: httpStatus.internalError
		})
		
		return res.status(appError.status).send(appError)
	}

	const { owner, name } = req.params
	if (!owner || !name) {
		logger.error({ message: `repository.getCommits() error: parameter ${!owner ? 'owner' : 'name'} does not exist`, request: req })
		const appError = new AppError({
			message: `The ${!owner ? 'owner' : 'name'} parameter is empty`,
			status: httpStatus.unprocessable
		})
		
		return res.status(appError.status).send(appError)
	}
	
	const options = {
		method: 'POST',
		uri: 'https://api.github.com/graphql',
		json: true,
		headers: {
			'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
			'User-Agent': `${process.env.GITHUB_USER}`
		},
		body: { 'query': query.data.replace('%NAME%', req.params.name).replace('%OWNER%', req.params.owner) },
	}
	
	rp.post(options)
	.then(json => {
		logger.info({ message: 'repository.getCommits() info: Github request successful', payload: json, request: req })
		
		const commits = {
			type: 'commit',
			data: json.data.repository.ref.target.history.edges
		}
		
		res.status(HttpStatus.ok).send(commits)
	})
	.catch(error => {
		logger.error({ message: 'repository.getCommits() error: Github request failed', error: error, request: req })
		
		const appError = new AppError({
			message: 'Internal server error',
			status: httpStatus.internalError
		})
		
		res.status(appError.status).send(appError)
	})
}

module.exports = {
	getCommits
}
import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { changeRepo } from '../actions/repo'
import { useInput } from '../hooks/useInput'

const styles = {
	container: {
		paddingTop: '60px'
	},
	buttonContainer: {
		lineHeight: '72px',
		textAlign: 'center'
	}
}

const RepoForm = (props) => {
	const { classes } = props
	const { isLoggedIn } = useSelector(state => state.user)
	const { owner, name } = useSelector(state => state.repo)

	const { value:ownerInput, bind:bindOwner } = useInput(owner);
  const { value:nameInput, bind:bindName } = useInput(name);

	const dispatch = useDispatch()

	function handleSubmit(event) {
		event.preventDefault()

		if (isLoggedIn) {
			dispatch(changeRepo(ownerInput, nameInput))
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<Grid container className={classes.container}>
				<Grid item xs={4} sm={5}>
					<TextField id='with-placeholder' name='owner' label='owner' margin='normal' fullWidth={true}
						{...bindOwner} />
				</Grid>
				<Grid item xs={1}></Grid>
				<Grid item xs={4} sm={5}>
					<TextField id='with-placeholder' name='name' label='repository' margin='normal' fullWidth={true}
						{...bindName} />
				</Grid>
				<Grid item xs={3} sm={1} className={classes.buttonContainer}>
				< Button size='small' variant='raised' type='submit'>go</Button>
				</Grid>
			</Grid>
		</form>
	)
}

RepoForm.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(RepoForm)

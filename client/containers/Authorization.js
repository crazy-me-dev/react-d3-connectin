/* eslint-disable react/prop-types */
/* eslint-disable no-console */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { verifyUser } from '../actions/user';

const Authorization = (WrappedComponent) => {
	return connect(mapStateToProps)(class AuthorizationComponent extends React.Component {
		componentDidMount() {
			if (!this.props.location.query.code) {
				const { dispatch } = this.props;
				dispatch(verifyUser());
			}
		}

		componentWillReceiveProps(nextProps) {
			console.log(this.props.user);
			console.log(nextProps.user);
		}

		render() {
			if (this.props.location.query.code || (this.props.user && this.props.user.login)) {
				return <WrappedComponent {...this.props} />
			}
			else {
				return <div>This will not work</div>
			}
		}
	})
}

Authorization.propTypes = {
	dispatch: PropTypes.func.isRequired,
	user: PropTypes.object
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default Authorization;
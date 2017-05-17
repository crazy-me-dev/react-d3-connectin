/* eslint-disable no-console */

import { createAction } from 'redux-actions';
import jsonapi from '../core/jsonapi';
import Cookies from 'js-cookie';
import 'whatwg-fetch';

export const REQUEST_USERLOGIN = 'REQUEST_USERLOGIN';
export const RECEIVE_USERLOGIN = 'RECEIVE_USERLOGIN';
export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';

export function loginUser(code) {
	return (dispatch) => {
		dispatch(requestUserLogin);

		let user = {
			fetching: false,
			id: '',
			login: false
		};
		
		const body = jsonapi.authorizationSerializer.serialize({ code: code });

		fetch('http://localhost:4000/api/authorization/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
			else {
				throw new Error(response.statusText);
			}
		}).then(json => {
			jsonapi.userDeserializer.deserialize(json, (error, users) => {
				if (error) {
					throw new Error(error);
				}
				else {
					Cookies.set('id', users.id, { expires: 14 });

					user.id = users.id;
					user.login = true;

					dispatch(receiveUserLogin({user: user}));
				}
			})
		}).catch(error => {
			user.login = false;
			console.log(error);
		});
	};
}

export function verifyUser() {
	return (dispatch) => {
		dispatch(requestUser);

		const id = Cookies.get('id');
		let user = {
			fetching: false,
			id: id,
			login: false
		};

		if (id) {
			fetch(`http://localhost:4000/api/user/${id}`)
			.then(response => {
				if (response.status === 200) {
					return response.json();
				}
				else {
					throw new Error(response.statusText);
				}
			})
			.then(json => {
				jsonapi.userDeserializer.deserialize(json)
				.then(users => {
					if (user.id === users.id) {
						user.id = users.id
						user.login = true;

						dispatch(receiveUser({user: user}));
					}
				});
			})
			.catch(error => {
				console.log(error);
			});
		}
	};
}

const requestUserLogin = createAction(REQUEST_USERLOGIN);

const receiveUserLogin = createAction(RECEIVE_USERLOGIN);

const requestUser = createAction(REQUEST_USER);

const receiveUser = createAction(RECEIVE_USER);
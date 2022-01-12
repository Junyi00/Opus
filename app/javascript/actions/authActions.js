import axios from 'axios';

export const addUser = (data, handleSuccess) => (dispatch) => {
  axios.post(
    '/api/v1/users',
    { user: data }
    // { withCredentials: true }
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    dispatch({ type: 'LOGIN_USER', user: resp.data.user });
    dispatch({ type: 'CLEAR_ERRORS' });
    handleSuccess();
  })
  .catch((resp) => {
    dispatch({ type: 'ADD_ERROR', error_type: 'signup', critical: false, message: resp.message })
  })
}

export const loginUser = (data, handleSuccess) => (dispatch) => {
  axios.post(
    '/api/v1/login',
    { user: data },
    { withCredentials: true }
  )
  .then((resp) => {
    if (resp.data.status === 401) {
      throw new Error(resp.data.error)
    }
    dispatch({type: 'LOGIN_USER', user: resp.data.user});
    dispatch({ type: 'CLEAR_ERRORS' });
    handleSuccess();
  })
  .catch((resp) =>
    dispatch({ type: 'ADD_ERROR', error_type: 'login', critical: false, message: resp.message })
  )
}

export const updatePassword = (data, curr_pw, handleSuccess) => (dispatch, getState) => {
  const user_id = getState().user.id
  return axios.patch(
    '/api/v1/users/' + user_id,
    { user: data, 
      current_password: curr_pw 
    }
  ).then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    }

    dispatch({ type: 'CLEAR_ERRORS' });
    handleSuccess()
  }).catch((resp) => {

    dispatch({ type: 'ADD_ERROR', error_type: 'update_pw', critical: false, message: resp.message })
  })
}

export const sendResetEmail = (email, handleSuccess) => (dispatch) => {
  return axios.post(
    '/api/v1/password/forgot',
    { email: email }
  ).then((resp) => {  
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    }

    dispatch({ type: 'CLEAR_ERRORS' });
    handleSuccess()
  }).catch((resp) => {

    dispatch({ type: 'ADD_ERROR', error_type: 'reset_pw', critical: false, message: resp.message })
  })
}

export const forgetResetPassword = (token, data, handleSuccess) => (dispatch) => {
  return axios.post(
    '/api/v1/password/reset',
    { token: token, ...data }
  ).then((resp) => {  
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    }

    dispatch({ type: 'CLEAR_ERRORS' });
    handleSuccess()
  }).catch((resp) => {
    dispatch({ type: 'ADD_ERROR', error_type: 'reset_pw', critical: false, message: resp.error })
  })
}

export const logoutUser = (data) => (dispatch) => {
  axios.delete(
    '/api/v1/logout', 
    data,
    { withCredentials: true }
  )
  .then((resp) => {
    dispatch({ type: 'LOGOUT_USER' });

    // Clear app data
    dispatch({ type: 'RESET_PROJECTS' })
    dispatch({ type: 'RESET_PROJECT_LAYOUT' })
    dispatch({ type: 'CLEAR_ERRORS' });
  })
  .catch((error) =>
    dispatch({ type: 'ADD_ERROR', error_type: 'app', critical: false, message: 'Something went wrong, please try again.', data: resp.message })
  )
}

export const fetchLoginStatus = () => (dispatch) => {
  return axios
    .get(
      '/api/v1/logged_in', 
      { withCredentials: true }
    )
    .then((resp) => {
      if (resp.data.logged_in) {
        dispatch({
          type: 'LOGIN_USER',
          user: resp.data.user,
        });
        dispatch({ type: 'CLEAR_ERRORS' });
      }
    })
    .catch((error) =>
      dispatch({ type: 'ADD_ERROR', error_type: 'app', critical: false, message: 'Failed to fetch login status, please try again.', data: resp.message })
    )
}

export const clearErrors = () => (dispatch) => {
  return Promise.resolve(dispatch({ type: 'CLEAR_ERRORS' }))
}
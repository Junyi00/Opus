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
    dispatch({ type: 'CLEAR_ERROR' });
    handleSuccess();
  })
  .catch((resp) => {
    dispatch({ type: 'ADD_ERROR', error: resp.message, request_type: 'addUser' })
  })
}

export const loginUser = (data, handleSuccess) => (dispatch) => {
  console.log("Logging in...")
  axios.post(
    '/api/v1/login',
    { user: data },
    // { withCredentials: true }
  )
  .then((resp) => {
    if (resp.data.status === 401) {
      throw new Error(resp.data.error)
    }
    console.log('Success!')
    dispatch({type: 'LOGIN_USER', user: resp.data.user});
    dispatch({ type: 'CLEAR_ERROR' });
    handleSuccess();
  })
  .catch((resp) =>
    dispatch({ type: 'ADD_ERROR', error: resp.message, request_type: 'loginUser' })
  )
}

export const logoutUser = (data) => (dispatch) => {
  axios.delete(
    '/api/v1/logout', 
    data,
    // { withCredentials: true }
  )
  .then((resp) => {
    dispatch({ type: 'LOGOUT_USER' });
    dispatch({ type: 'CLEAR_ERROR' });
  })
  .catch((error) =>
    dispatch({ type: 'ADD_ERROR', error: 'Something went wrong. Try again.', request_type: 'logoutUser' })
  )
}

export const fetchLoginStatus = () => (dispatch) => {
  return axios
    .get(
      '/api/v1/logged_in', 
      // { withCredentials: true }
    )
    .then((resp) => {
      console.log(resp)
      if (resp.data.logged_in) {
        dispatch({
          type: 'LOGIN_USER',
          user: resp.data,
        });
        dispatch({ type: 'CLEAR_ERROR' });
      }
    })
    .catch((error) =>
      dispatch({ type: 'ADD_ERROR', error: 'Something went wrong. Try again.', request_type: 'fetchLoginStatus' })
    )
}
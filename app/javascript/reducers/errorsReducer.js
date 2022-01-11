const initialState = {
  signup: null,
  login: null,
  update_pw: null,
  reset_pw: null,
  app: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        [action.error_type]: {
          critical: action.critical,
          message: action.message,
          data: action.data
        }
      }
      
    case 'CLEAR_ERRORS':
      return initialState

    default:
      return state
  }
};
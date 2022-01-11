export default (state = {
  signup: null,
  login: null,
  update_pw: null,
  app: null
}, action) => {
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
      return {
        signup: null,
        login: null,
        update_pw: null,
        app: null
      };

    default:
      return state;
  }
};
export default (state = {
  signup: null,
  login: null,
  app: null
}, action) => {
  switch (action.type) {
    case 'ADD_ERROR':
      
      switch (action.error_type) {
        case 'signup':
          return {
            ...state,
            signup: {
              critical: action.critical,
              message: action.message,
              data: action.data
            }
          }
        case 'login':
          return {
            ...state,
            login: {
              critical: action.critical,
              message: action.message,
              data: action.data
            }
          }
        case 'app':
          return {
            ...state,
            app: {
              critical: action.critical,
              message: action.message,
              data: action.data
            }
          }
        default:
          return {
            ...state,
            app: {
              critical: false,
              message: 'Unknown error type: ' + action.error_type,
              data: null  
            }
          }
      }
      
    case 'CLEAR_ERRORS':
      return {
        signup: null,
        login: null,
        app: null
      };

    default:
      return state;
  }
};
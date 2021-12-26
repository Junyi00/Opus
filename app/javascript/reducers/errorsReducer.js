export default (state = {}, action) => {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        request_type: action.request_type,
        error: action.error
      };
    case 'CLEAR_ERROR':
      return {};
    default:
      return state;
  }
};
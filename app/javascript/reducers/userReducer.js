export default (
  state = {
    isLoggedIn: false,
    id: null,
    username: '',
  },
  action
) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return {
        isLoggedIn: true,
        id: action.user.id,
        username: action.user.username,
      };
    case 'LOGOUT_USER':
      return {
        isLoggedIn: false,
        id: null,
        username: '',
      };
    default:
      return state;
  }
};
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import errorsReducer from './errorsReducer';
import projectReducer from './projectReducer';

const rootReducer = combineReducers({
  user: userReducer,
  errors: errorsReducer,
  project: projectReducer
});
export default rootReducer;
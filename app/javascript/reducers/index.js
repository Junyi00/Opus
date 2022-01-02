import { combineReducers } from 'redux';
import userauthReducer from './userauthReducer';
import errorsReducer from './errorsReducer';
import projectLayoutReducer from './projectLayoutReducer';
import projectsReducer from './projectsReducer';

const rootReducer = combineReducers({
  user: userauthReducer,
  errors: errorsReducer,
  projects: projectsReducer,
  projectLayout: projectLayoutReducer
});
export default rootReducer;
import { combineReducers } from 'redux';
import userauthReducer from './userauthReducer';
import errorsReducer from './errorsReducer';
import projectLayoutReducer from './projectLayoutReducer';
import projectsReducer from './projectsReducer';
import undoableLayoutEnhancer from './undoableLayoutEnhancer';

const rootReducer = combineReducers({
  user: userauthReducer,
  errors: errorsReducer,
  projects: projectsReducer,
  projectLayout: undoableLayoutEnhancer(projectLayoutReducer)
});
export default rootReducer;
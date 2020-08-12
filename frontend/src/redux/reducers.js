import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import user from './user/reducer';
import content from './content/reducer';
import category from './category/reducer';
const reducers = combineReducers({
  menu,
  settings,
  authUser,
  user,
  content, 
  category
 
});

export default reducers;
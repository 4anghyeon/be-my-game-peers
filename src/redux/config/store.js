import {combineReducers, legacy_createStore as createStore} from 'redux';
import users from '../modules/users';
import userAuth from '../modules/userAuth';

const rootReducer = combineReducers({users, userAuth});

const store = createStore(rootReducer);

export default store;

import {combineReducers, legacy_createStore as createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import PostModule from 'redux/modules/PostModule';
import categoriModule from 'redux/modules/categoriModule';
import users from '../modules/users';
import userAuth from '../modules/userAuth';

const rootReducer = combineReducers({users, userAuth, PostModule, categoriModule});

const store = createStore(rootReducer, composeWithDevTools());

export default store;

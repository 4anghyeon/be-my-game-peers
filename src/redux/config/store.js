import {combineReducers, legacy_createStore as createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import categoriModule from 'redux/modules/categoriModule';
import users from '../modules/users';
import userAuth from '../modules/userAuth';
import alertModule from '../modules/alert/alertModule';
import modalModule from '../modules/modal/modalModule';
import postModule from '../modules/postModule';

const rootReducer = combineReducers({users, userAuth, postModule, categoriModule, alertModule, modalModule});

const store = createStore(rootReducer, composeWithDevTools());

export default store;

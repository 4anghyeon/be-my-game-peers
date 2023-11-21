import {combineReducers, legacy_createStore as createStore} from 'redux';
import {devToolsEnhancer} from 'redux-devtools-extension';
import categoriModule from '../modules/categoriModule';
const rootReducer = combineReducers({categoriModule});

const store = createStore(rootReducer, devToolsEnhancer());

export default store;

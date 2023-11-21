import {combineReducers, legacy_createStore as createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import PostModule from 'redux/modules/PostModule';

const rootReducer = combineReducers({
  PostModule,
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;

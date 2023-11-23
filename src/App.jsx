import {GlobalStyle} from './shared/GlobalStyle';
import {Provider} from 'react-redux';
import AppRouter from './shared/AppRouter';
import store from './redux/config/store';
import Alert from './components/Alert/Alert';
import React from 'react';
import Modal from './components/Modal/Modal';
function App() {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <Alert />
        <AppRouter />
      </Provider>
    </>
  );
}

export default App;

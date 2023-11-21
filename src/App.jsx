import {GlobalStyle} from './shared/GlobalStyle';
import {Provider} from 'react-redux';
import AppRouter from './shared/AppRouter';

function App() {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </>
  );
}

export default App;

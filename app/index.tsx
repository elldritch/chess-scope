import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter, push, routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import createHistory from 'history/createBrowserHistory';

import TacScope from './TacScope';
import { reducers, epic } from './state';

// Set up state-history sync.
const history = createHistory();
const reduxRouter = routerMiddleware(history);

// Set up effect system.
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Set up state management.
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  composeEnhancers(applyMiddleware(routerMiddleware(history), createEpicMiddleware(epic))),
);

// Set up hot reloading.
const render = (App: React.ComponentClass) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );
};

render(TacScope);

if (module.hot) {
  module.hot.accept('./TacScope.tsx', () => {
    render(TacScope);
  });
}

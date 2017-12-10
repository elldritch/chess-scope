import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

// tslint:disable-next-line:no-implicit-dependencies
import { AppContainer } from 'react-hot-loader';

import createHistory from 'history/createBrowserHistory';

import { epic, reducers } from './state';
import TacScope from './TacScope';

// Set up state-history sync.
const history = createHistory();
const reduxRouter = routerMiddleware(history);

// Set up effect system.
declare global {
  interface Window {
    readonly __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Set up state management.
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  composeEnhancers(applyMiddleware(reduxRouter, createEpicMiddleware(epic))),
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

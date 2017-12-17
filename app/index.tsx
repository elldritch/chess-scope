import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

// tslint:disable:no-implicit-dependencies
import { AppContainer } from 'react-hot-loader';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import FilterMonitor from 'redux-devtools-filter-actions';
import Inspector from 'redux-devtools-inspector';
// tslint:enable:no-implicit-dependencies

import createHistory from 'history/createBrowserHistory';

import { epic, reducers } from './state';
import TacScope from './TacScope';

// Set up developer tools
const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-i" changePositionKey="ctrl-p" changeMonitorKey="ctrl-m">
    <FilterMonitor blacklist={['LOBBY_PING', 'GAME_PING']}>
      <Inspector />
    </FilterMonitor>
    <Inspector />
  </DockMonitor>,
);

// Set up state-history sync.
const history = createHistory();
const reduxRouter = routerMiddleware(history);

// Set up state management.
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  compose(applyMiddleware(reduxRouter, createEpicMiddleware(epic)), DevTools.instrument()),
);

// Set up hot reloading.
const render = (App: React.ComponentClass) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <App />
            <DevTools />
          </div>
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

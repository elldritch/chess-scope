import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { TacScope } from './TacScope';

// Set up hot reloading.
const render = (App: React.ComponentClass) => {
  ReactDOM.render(
    <AppContainer>
      <App />
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

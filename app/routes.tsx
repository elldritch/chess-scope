import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import FindGame from './components/lobby/FindGame';
import Login from './components/user/Login';
import Logout from './components/user/Logout';

export default (
  <Switch>
    <Route path="/logout" component={Logout} />
    <Route path="/login" component={Login} />
    <Route path="/" component={FindGame} />
  </Switch>
);

import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './components/user/Login';
import Logout from './components/user/Logout';
import Landing from './components/Landing';

export default (
  <Switch>
    <Route path="/logout" component={Logout} />
    <Route path="/login" component={Login} />
    <Route path="/" component={Landing} />
  </Switch>
);

import * as React from 'react';
import { FormEvent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { NonIdealState } from '@blueprintjs/core';

import { State } from '../../state';
import { logout, Logout, UserState } from '../../state/user';

type LogoutProps = {
  user: UserState;
  logout(): Logout;
};

class LogoutComponent extends React.Component<LogoutProps> {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    if (!this.props.user.data) {
      return <Redirect to="/" />;
    }

    return <NonIdealState title="Logging you out..." visual="log-out" />;
  }
}

export default connect((state: State) => ({ user: state.user }), { logout })(LogoutComponent);

import * as React from 'react';
import { FormEvent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { Button } from '@blueprintjs/core';

import { State } from '../../state';
import { login, Login, UserState } from '../../state/user';

type LoginProps = {
  user: UserState;
  login(username: string, password: string): Login;
};

type LoginState = {
  username: string;
  password: string;

  usernameInvalid: boolean;
  passwordInvalid: boolean;
};

class LoginComponent extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      password: '',
      passwordInvalid: false,
      username: '',
      usernameInvalid: false,
    };
  }

  public render() {
    if (this.props.user.data) {
      return <Redirect to="/" />;
    }

    return (
      <form onSubmit={this.onSubmit}>
        <div className="columns is-multiline is-gapless">
          <div className="column is-half has-text-right">
            <label className="pt-label pt-inline pt-large pt-ui-text-large" style={{ paddingRight: '0.75em' }}>
              Username
            </label>
          </div>
          <div className="column is-half">
            <input
              className={'pt-input pt-large' + (this.state.usernameInvalid ? ' pt-intent-danger' : '')}
              type="text"
              placeholder="Username"
              dir="auto"
              value={this.state.username}
              onChange={this.setUsername}
              disabled={this.props.user.loading}
            />
            {this.state.usernameInvalid ? (
              <div className="pt-form-group pt-intent-danger">
                <div className="pt-form-helper-text">Please enter a value</div>
              </div>
            ) : null}
          </div>
          <div className="column is-half has-text-right">
            <label className="pt-label pt-inline pt-large pt-ui-text-large" style={{ paddingRight: '0.75em' }}>
              Password
            </label>
          </div>
          <div className="column is-half">
            <input
              className={'pt-input pt-large' + (this.state.passwordInvalid ? ' pt-intent-danger' : '')}
              type="password"
              placeholder="Password"
              dir="auto"
              value={this.state.password}
              onChange={this.setPassword}
              disabled={this.props.user.loading}
            />
            {this.state.passwordInvalid ? (
              <div className="pt-form-group pt-intent-danger">
                <div className="pt-form-helper-text">Please enter a value</div>
              </div>
            ) : null}
          </div>
          <div className="column is-half" />
          <div className="column is-half">
            <Button className="pt-large" text="Log in" type="submit" loading={this.props.user.loading} />
          </div>
        </div>
      </form>
    );
  }

  private setUsername = (event: FormEvent<HTMLInputElement>) =>
    this.setState({ username: event.currentTarget.value.trim(), usernameInvalid: false });

  private setPassword = (event: FormEvent<HTMLInputElement>) =>
    this.setState({ password: event.currentTarget.value.trim(), passwordInvalid: false });

  private onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.state.username.length === 0) {
      this.setState({ usernameInvalid: true });
    }
    if (this.state.password.length === 0) {
      this.setState({ passwordInvalid: true });
    }

    if (this.state.username.length > 0 && this.state.password.length > 0) {
      this.props.login(this.state.username, this.state.password);
    }
  };
}

export default connect((state: State) => ({ user: state.user }), { login })(LoginComponent);

import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { Button, Classes } from '@blueprintjs/core';

import { State } from '../../state';
import { login, Login, UserState } from '../../state/user';

type LoginProps = {
  readonly user: UserState;
  readonly login: (username: string, password: string) => Login;
};

type LoginState = {
  readonly username: string;
  readonly password: string;

  readonly usernameInvalid: boolean;
  readonly passwordInvalid: boolean;
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
            <label
              className={[Classes.LABEL, Classes.INLINE, Classes.LARGE, Classes.UI_TEXT_LARGE].join(' ')}
              style={{ paddingRight: '0.75em' }}
            >
              Username
            </label>
          </div>
          <div className="column is-half">
            <input
              className={[Classes.INPUT, Classes.LARGE]
                .concat(this.state.usernameInvalid ? [Classes.INTENT_DANGER] : [])
                .join(' ')}
              type="text"
              placeholder="Username"
              dir="auto"
              value={this.state.username}
              onChange={this.setUsername}
              disabled={this.props.user.loading}
            />
            {this.state.usernameInvalid ? (
              <div className={[Classes.FORM_GROUP, Classes.INTENT_DANGER].join(' ')}>
                <div className={Classes.FORM_HELPER_TEXT}>Please enter a value</div>
              </div>
            ) : null}
          </div>
          <div className="column is-half has-text-right">
            <label
              className={[Classes.LABEL, Classes.INLINE, Classes.LARGE, Classes.UI_TEXT_LARGE].join(' ')}
              style={{ paddingRight: '0.75em' }}
            >
              Password
            </label>
          </div>
          <div className="column is-half">
            <input
              className={[Classes.INPUT, Classes.LARGE]
                .concat(this.state.usernameInvalid ? [Classes.INTENT_DANGER] : [])
                .join(' ')}
              type="password"
              placeholder="Password"
              dir="auto"
              value={this.state.password}
              onChange={this.setPassword}
              disabled={this.props.user.loading}
            />
            {this.state.passwordInvalid ? (
              <div className={[Classes.FORM_GROUP, Classes.INTENT_DANGER].join(' ')}>
                <div className={Classes.FORM_HELPER_TEXT}>Please enter a value</div>
              </div>
            ) : null}
          </div>
          <div className="column is-half" />
          <div className="column is-half">
            <Button className={Classes.LARGE} text="Log in" type="submit" loading={this.props.user.loading} />
          </div>
        </div>
      </form>
    );
  }

  private readonly setUsername = (event: React.FormEvent<HTMLInputElement>) =>
    this.setState({ username: event.currentTarget.value.trim(), usernameInvalid: false });

  private readonly setPassword = (event: React.FormEvent<HTMLInputElement>) =>
    this.setState({ password: event.currentTarget.value.trim(), passwordInvalid: false });

  private readonly onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

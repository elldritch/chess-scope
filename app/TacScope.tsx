import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button, Classes, Spinner } from '@blueprintjs/core';

import routes from './routes';
import { State } from './state';
import { loadUser, LoadUser, UserState } from './state/user';

type TacScopeProps = {
  readonly user: UserState;
  readonly path: string;
  readonly loadUser: () => LoadUser;
};

class TacScope extends React.Component<TacScopeProps> {
  public componentDidMount(): void {
    this.props.loadUser();
  }

  public render(): JSX.Element {
    return (
      <span>
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <div className="level">
                <div className="level-left">
                  <div className="level-item">
                    <div>
                      <h1 className="title" style={{ marginBottom: '1.5rem' }}>
                        <Link to="/" style={{ color: 'inherit' }}>
                          ChessScope
                        </Link>
                      </h1>
                      <h2 className="subtitle">Radar for Chess</h2>
                    </div>
                  </div>
                </div>
                <div className="level-right">
                  {this.props.user.data ? (
                    [
                      <div className="level-item" key="account-name">
                        <span>
                          Logged in as{' '}
                          <a
                            href={`https://lichess.org/@/${this.props.user.data.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {this.props.user.data.username}
                          </a>
                        </span>
                      </div>,
                      <div className="level-item" key="log-out-button">
                        <Link to="/logout">
                          <Button className={Classes.LARGE} text="Log out" />
                        </Link>
                      </div>,
                    ]
                  ) : this.props.user.loading ? (
                    <Spinner className={Classes.SMALL} />
                  ) : (
                    <div className="level-item">
                      <Link to="/login">
                        <Button className={Classes.LARGE} text="Log in" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">{routes}</div>
        </section>
      </span>
    );
  }
}

export default connect((state: State) => ({ user: state.user, path: state.router.location.pathname }), { loadUser })(
  TacScope,
);

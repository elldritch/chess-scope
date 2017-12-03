import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Button } from '@blueprintjs/core';

import routes from './routes';
import { State } from './state';
import { loadUser, LoadUser, UserState } from './state/user';

type TacScopeProps = {
  user: UserState;
  path: string;
  loadUser(): LoadUser;
};

class TacScope extends React.Component<TacScopeProps, {}> {
  // private socket: WebSocket;

  constructor(props: TacScopeProps) {
    super(props);
  }

  componentDidMount() {
    this.props.loadUser();
    // const board = ChessBoard('chessboard', {
    //   pieceTheme: (piece: Piece) => `/assets/pieces/${piece}.png`,
    //   position: 'start',
    // });
    // console.log(board);
    // this.socket = new WebSocket(`ws://localhost:8080/socket?sri=${Math.random().toString(36).substring(2)}`)
    // this.socket.onopen = (e: any) => console.log('opened')
    // this.socket.onclose= () => console.log('closed')
    // this.socket.onmessage= message => console.log(message)
  }

  render() {
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
                          TacScope
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
                          <Button className="pt-large" text="Log out" />
                        </Link>
                      </div>,
                    ]
                  ) : this.props.user.loading ? (
                    <div className="pt-spinner pt-small">
                      <div className="pt-spinner-svg-container">
                        <svg viewBox="0 0 100 100">
                          <path
                            className="pt-spinner-track"
                            d="M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89"
                          />
                          <path className="pt-spinner-head" d="M 94.5 50 A 44.5 44.5 0 0 0 50 5.5" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="level-item">
                      <Link to="/login">
                        <Button className="pt-large" text="Log in" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">{routes}</div>
        </section>
        {/* <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column">
                <div id="chessboard" style={{ width: `${80 * 8 + 2}px` }} />
              </div>
              <div className="column">
                <h3>Right Panel</h3>
                <p>Lorem ipsum.</p>
              </div>
            </div>
          </div>
        </section> */}
      </span>
    );
  }
}

export default connect((state: State) => ({ user: state.user, path: state.router.location.pathname }), { loadUser })(
  TacScope,
);

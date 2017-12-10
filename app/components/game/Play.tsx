import * as React from 'react';
import { connect } from 'react-redux';

import { History, Location } from 'history';
import { match, withRouter } from 'react-router-dom';

import { NonIdealState, Spinner } from '@blueprintjs/core';

import { State } from '../../state';
import { Game, loadGame, LoadGame } from '../../state/game';
import { Async } from '../../state/util/types';

type PlayRouteProps = {
  readonly gameId: string;
};

type PlayProps = {
  readonly match: match<PlayRouteProps>;
  readonly location: Location;
  readonly history: History;

  readonly game: Async<Game>;
  readonly loadGame: (gameId: string) => LoadGame;
};

// TODO: re-enable on completion
// tslint:disable
class Play extends React.Component<PlayProps> {
  public componentDidMount() {
    this.props.loadGame(this.props.match.params.gameId);
  }

  public componentDidUpdate() {
    if (!this.props.game.loading && this.props.game.data) {
      const board = ChessBoard('chessboard', {
        pieceTheme: piece => `/assets/pieces/${piece}.png`,
        position: 'start',
      });

      console.log(board);
    }
  }

  public render() {
    return this.props.game.loading ? (
      <section className="hero is-large">
        <div className="hero-body">
          <div className="container">
            <NonIdealState title="Loading game..." visual={<Spinner />} />
          </div>
        </div>
      </section>
    ) : (
      <div className="columns">
        <div className="column">
          <div id="chessboard" style={{ width: `${80 * 8 + 2}px` }} />
        </div>
        <div className="column" />
      </div>
    );
  }
}

export default connect((state: State) => ({ game: state.game.game }), { loadGame })(withRouter(Play));

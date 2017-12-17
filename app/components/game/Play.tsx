import * as React from 'react';
import { connect } from 'react-redux';

import { History, Location } from 'history';
import { match, withRouter } from 'react-router-dom';

import { NonIdealState, Spinner } from '@blueprintjs/core';

import Chess = require('chess.js');

import { State } from '../../state';
import { Game, loadGame, LoadGame, SendMove, sendMove } from '../../state/game';
import { Async } from '../../state/util/types';

type PlayRouteProps = {
  readonly gameId: string;
};

type PlayProps = {
  readonly match: match<PlayRouteProps>;
  readonly location: Location;
  readonly history: History;

  readonly game: Async<Game | null>;
  readonly board: string;
  readonly loadGame: (gameId: string) => LoadGame;
  readonly sendMove: (from: string, to: string, promotion?: string) => SendMove;
};

class Play extends React.Component<PlayProps> {
  // tslint:disable:readonly-keyword
  private board: ChessBoard;
  private game: Chess;
  // tslint:enable:readonly-keyword

  public componentDidMount() {
    this.props.loadGame(this.props.match.params.gameId);
  }

  public componentDidUpdate(prevProps: PlayProps) {
    if (!this.props.game.loading && prevProps.game.loading) {
      this.board = ChessBoard('chessboard', {
        pieceTheme: piece => `/assets/pieces/${piece}.png`,
        position: this.props.game.data!.game.fen,
        draggable: true,
        orientation: this.props.game.data!.player.color,
        onDrop: (source, target) => {
          if (
            this.game
              .moves({ square: source, verbose: true })
              .filter(move => move.from === source && move.to === target).length > 0
          ) {
            this.props.sendMove(source, target);
            return;
          }
          return 'snapback';
        },
      });
      this.game = new Chess(this.props.game.data!.game.fen);
    }

    if (prevProps.board !== this.props.board) {
      this.board.position(this.props.board);
      this.game.load(this.props.board);
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

export default connect((state: State) => ({ game: state.game.game, board: state.game.board }), { loadGame, sendMove })(
  withRouter(Play),
);

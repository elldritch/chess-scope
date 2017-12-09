import * as React from 'react';
import { connect } from 'react-redux';

import { State } from '../../state';

// tslint:disable:no-console

class Play extends React.Component {
  public componentDidMount() {
    const board = ChessBoard('chessboard', {
      pieceTheme: (piece: Piece) => `/assets/pieces/${piece}.png`,
      position: 'start',
    });
    console.log(board);
  }

  public render() {
    return (
      <div className="columns">
        <div className="column">
          <div id="chessboard" style={{ width: `${80 * 8 + 2}px` }} />
        </div>
        <div className="column">
          <h3>Right Panel</h3>
          <p>Lorem ipsum.</p>
        </div>
      </div>
    );
  }
}

export default connect((state: State) => ({}))(Play);

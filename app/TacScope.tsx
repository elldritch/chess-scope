import * as React from 'react';

export class TacScope extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  componentDidMount() {
    const board = ChessBoard('chessboard', {
      pieceTheme: (piece: Piece) => `/assets/pieces/${piece}.png`,
      position: 'start',
    });
    console.log(board);
  }

  render() {
    return (
      <div className="container">
        <section className="hero">
          <div className="hero-body">
            <h1 className="title">TacScope</h1>
            <h2 className="subtitle">Radar for Chess</h2>
          </div>
        </section>
        <section className="section">
          <div className="columns">
            <div className="column">
              <div id="chessboard" style={{width: `${80 * 8 + 2}px`}} />
            </div>
            <div className="column">
              <h3>Right Panel</h3>
              <p>Lorem ipsum.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

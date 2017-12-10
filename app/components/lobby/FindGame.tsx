import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AnchorButton, Classes, NonIdealState, Position, Spinner, Tooltip } from '@blueprintjs/core';

import { State } from '../../state';
import { Challenge, Game } from '../../state/lobby';
import { Paged } from '../../state/util/models';
import { Async } from '../../state/util/types';

type FindGameProps = {
  readonly challenges: ReadonlyArray<Challenge>;
  readonly games: Async<Paged<Game>>;
};

class FindGame extends React.Component<FindGameProps> {
  public render() {
    return (
      <div className="tile is-ancestor">
        <div className="tile is-vertical is-parent">
          <div className="tile is-child">
            <h2 className="title is-4">Incoming Challenges</h2>
            {this.props.challenges.length > 0 ? (
              <table className={[Classes.TABLE, Classes.INTERACTIVE].join(' ')}>
                <thead>
                  <tr>
                    <th>Opponent</th>
                    <th>Type</th>
                    <th>Rating</th>
                    <th>Color</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.challenges.map(challenge => (
                    <tr key={challenge.id}>
                      <td>{challenge.challenger.name}</td>
                      <td>
                        {challenge.rated ? 'Rated' : 'Casual'} {challenge.variant.name} ({challenge.timeControl.type})
                      </td>
                      <td>{challenge.challenger.rating}</td>
                      <td>{challenge.color}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '2em 0' }}>
                <NonIdealState description="No incoming challenges." visual="inbox" />
              </div>
            )}
          </div>
          <div className="tile is-child">
            <h2 className="title is-4">Your Games</h2>
            {/* Refresh, show completed games */}
            {this.props.games.loading ? (
              <div style={{ textAlign: 'center', padding: '4em' }}>
                <Spinner className={Classes.SMALL} />
              </div>
            ) : this.props.games.data && this.props.games.data.currentPageResults.length > 0 ? (
              <table className={[Classes.TABLE, Classes.INTERACTIVE].join(' ')}>
                <thead>
                  <tr>
                    <th>Opponent</th>
                    <th>Type</th>
                    <th>Rating</th>
                    <th>Color</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.games.data.currentPageResults.map(game => (
                    <tr key={game.id}>
                      <td style={{ padding: 0 }}>
                        <Link to={`/game/${game.id}`} style={{ padding: '11px', display: 'inline-block' }}>
                          {game.color === 'black' ? game.players.white.userId : game.players.black.userId}
                        </Link>
                      </td>
                      <td style={{ padding: 0 }}>
                        <Link to={`/game/${game.id}`} style={{ padding: '11px', display: 'inline-block' }}>
                          {game.speed}
                        </Link>
                      </td>
                      <td style={{ padding: 0 }}>
                        <Link to={`/game/${game.id}`} style={{ padding: '11px', display: 'inline-block' }}>
                          {game.color === 'black'
                            ? game.players.white.rating + (game.players.white.provisional ? '?' : '')
                            : game.players.black.rating + (game.players.black.provisional ? '?' : '')}
                        </Link>
                      </td>
                      <td style={{ padding: 0 }}>
                        <Link to={`/game/${game.id}`} style={{ padding: '11px', display: 'inline-block' }}>
                          {game.color}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '2em 0' }}>
                <NonIdealState description="No games found." visual="list" />
              </div>
            )}
          </div>
          <div className="tile is-child">
            <h2 className="title is-4">Find Games</h2>
            {/* Player 1 vs. Player 2 */}
            {/* Only show ongoing games */}
            <div style={{ padding: '2em 0' }}>
              <NonIdealState description="No games found." visual="search-template" />
            </div>
          </div>
        </div>
        <div className="tile is-8 is-parent">
          <div className="tile is-child">
            <NonIdealState
              title="No game selected"
              description="Select a game to start analyzing it."
              visual="search"
              action={
                <div className="has-text-centered">
                  {/* <Link to="/create"> */}
                  <Tooltip content="Coming soon!" position={Position.BOTTOM}>
                    <AnchorButton className={Classes.LARGE} text="Create game" disabled />
                  </Tooltip>
                  {/* </Link> */}
                </div>
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state: State) => ({ challenges: state.lobby.challenges, games: state.lobby.games }))(FindGame);

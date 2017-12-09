import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AnchorButton, NonIdealState, Position, Tooltip } from '@blueprintjs/core';

import { State } from '../../state';
import { Challenge, Game } from '../../state/lobby';
import { Async, Paged } from '../../state/util/types';

interface FindGameProps {
  challenges: Challenge[];
  games: Async<Paged<Game>>;
}

class FindGame extends React.Component<FindGameProps> {
  public render() {
    return (
      <div className="columns">
        <div className="column">
          <div style={{ marginBottom: '2em' }}>
            <h2 className="title is-4">Incoming Challenges</h2>
            {this.props.challenges.length > 0 ? (
              <table className="pt-table .pt-interactive">
                <thead>
                  <tr>
                    <th>Opponent</th>
                    <th>Type</th>
                    <th>Rating</th>
                    <th>Color</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.challenges.map((challenge) => (
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
          <div style={{ marginBottom: '2em' }}>
            <h2 className="title is-4">Your Games</h2>
            {/* Opponent, won/lost/ongoing, refresh */}
            {/* Only show ongoing games */}
            {this.props.games.data && this.props.games.data.currentPageResults.length > 0 ? (
              <table className="pt-table .pt-interactive">
                <thead>
                  <tr>
                    {/* <th>Opponent</th>
                    <th>Type</th>
                    <th>Rating</th>
                    <th>Color</th> */}
                    <th>Debug</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.games.data.currentPageResults.map((game) => (
                    <tr key={game.id}>
                      <td>
                        <pre>
                          <code>{JSON.stringify(game, null, 2)}</code>
                        </pre>
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
          <div>
            <h2 className="title is-4">Find Games</h2>
            {/* Player 1 vs. Player 2 */}
            {/* Only show ongoing games */}
            <div style={{ padding: '2em 0' }}>
              <NonIdealState description="No games found." visual="search-template" />
            </div>
          </div>
        </div>
        <div className="column is-two-thirds">
          <NonIdealState
            title="No game selected"
            description="Select a game to start analyzing it."
            visual="search"
            action={
              <div className="has-text-centered">
                {/* <Link to="/create"> */}
                <Tooltip content="Under construction." position={Position.BOTTOM}>
                  <AnchorButton className="pt-large" text="Create game" disabled />
                </Tooltip>
                {/* </Link> */}
              </div>
            }
          />
        </div>
      </div>
    );
  }
}

export default connect((state: State) => ({ challenges: state.lobby.challenges, games: state.lobby.games }))(FindGame);

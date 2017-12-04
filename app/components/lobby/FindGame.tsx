import * as React from 'react';
import { Link } from 'react-router-dom';

import { AnchorButton, NonIdealState, Tooltip, Position } from '@blueprintjs/core';

class FindGame extends React.Component {
  render() {
    return (
      <div className="columns">
        <div className="column">
          <div>
            <h2 className="title is-4">Incoming Challenges</h2>
            <section className="section">
              <NonIdealState description="No incoming challenges." visual="inbox" />
            </section>
          </div>
          <div>
            <h2 className="title is-4">Your Games</h2>
            <section className="section">
              <NonIdealState description="No games found." visual="list" />
            </section>
          </div>
          <div>
            <h2 className="title is-4">Find Games</h2>
            <section className="section">
              <NonIdealState description="No games found." visual="search-template" />
            </section>
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

export default FindGame;

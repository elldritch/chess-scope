import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button, NonIdealState } from '@blueprintjs/core';

export default () => (
  <NonIdealState
    title="No game selected"
    description="Select a game to start analyzing it."
    visual="search"
    action={
      <div className="has-text-centered">
        <Link to="/create" style={{ pointerEvents: 'none' }}>
          <Button className="pt-large" text="Create game" disabled />
        </Link>
        <br />
        <br />
        <Link to="/find">
          <Button className="pt-large" text="Find game" />
        </Link>
      </div>
    }
  />
);

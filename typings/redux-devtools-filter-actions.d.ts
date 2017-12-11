declare module 'redux-devtools-filter-actions' {
  // Type definitions for redux-devtools-filter-actions 1.2.2
  // Project: https://github.com/zalmoxisus/redux-devtools-filter-actions
  // Definitions by: Leo Zhang <https://github.com/ilikebits>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

  /// <reference types="react" />
  /// <reference types="redux" />

  type FilterMonitorProps = {
    /** An array of actions (regex as string) to be hidden in the child monitor. */
    blacklist?: string[];
    /** An array of actions (regex as string) to be shown. If specified, other than those actions will be hidden (the 'blacklist' parameter will be ignored). */
    whitelist?: string[];
    /** Function which takes `action` object and id number as arguments, and should return `action` object back. See the example above. */
    actionsFilter?: (action: Action, id: number) => Action;
    /** Function which takes `state` object and index as arguments, and should return `state` object back. See the example above. */
    statesFilter?: <S>(state: S, index: number) => S;
  };

  export default class FilterMonitor extends React.Component<FilterMonitorProps> {}
}

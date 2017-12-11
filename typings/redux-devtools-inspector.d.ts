declare module 'redux-devtools-inspector' {
  // Type definitions for redux-devtools-inspector 0.11.3
  // Project: https://github.com/alexkuz/redux-devtools-inspector
  // Definitions by: Leo Zhang <https://github.com/ilikebits>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

  /// <reference types="react" />

  type InspectorProps = {
    /** Contains either base16 theme name or object, that can be base16 colors map or object containing classnames or styles. */
    theme?: object | string;
    /** Inverts theme color luminance, making light theme out of dark theme and vice versa. */
    invertTheme?: boolean;
    /** Better Immutable rendering in Diff (can affect performance if state has huge objects/arrays). false by default. */
    supportImmutable?: boolean;
    /** Overrides list of tabs (see below) */
    tabs?: Array | Function;
    /** Optional callback for better array handling in diffs (see jsondiffpatch docs) */
    diffObjectHash?: Function;
    /** Optional callback for ignoring particular props in diff (see jsondiffpatch docs) */
    diffPropertyFilter?: Function;
  };

  export default class Inspector extends React.Component<InspectorProps> {}
}

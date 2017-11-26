type PositionObject = { [position: string]: string };

type BoardPosition = PositionObject | FENString | 'start';

type FENString = string;

type Square =
  | 'a1'
  | 'b1'
  | 'c1'
  | 'd1'
  | 'e1'
  | 'f1'
  | 'g1'
  | 'h1'
  | 'a2'
  | 'b2'
  | 'c2'
  | 'd2'
  | 'e2'
  | 'f2'
  | 'g2'
  | 'h2'
  | 'a3'
  | 'b3'
  | 'c3'
  | 'd3'
  | 'e3'
  | 'f3'
  | 'g3'
  | 'h3'
  | 'a4'
  | 'b4'
  | 'c4'
  | 'd4'
  | 'e4'
  | 'f4'
  | 'g4'
  | 'h4'
  | 'a5'
  | 'b5'
  | 'c5'
  | 'd5'
  | 'e5'
  | 'f5'
  | 'g5'
  | 'h5'
  | 'a6'
  | 'b6'
  | 'c6'
  | 'd6'
  | 'e6'
  | 'f6'
  | 'g6'
  | 'h6'
  | 'a7'
  | 'b7'
  | 'c7'
  | 'd7'
  | 'e7'
  | 'f7'
  | 'g7'
  | 'h7'
  | 'a8'
  | 'b8'
  | 'c8'
  | 'd8'
  | 'e8'
  | 'f8'
  | 'g8'
  | 'h8';

type Piece = 'wP' | 'wK' | 'wQ' | 'wB' | 'wN' | 'wR' | 'bP' | 'bK' | 'bQ' | 'bB' | 'bN' | 'bR';

type Orientation = 'black' | 'white';

type InvalidDropBehavior = 'snapback' | 'trash';

type AnimationSpeed = number | 'slow' | 'fast';

type ChessBoardConfig = {
  draggable: boolean;
  dropOffBoard: InvalidDropBehavior;
  position: BoardPosition;
  onChange(oldPosition: PositionObject, newPosition: PositionObject): void;
  onDragStart(source: Square, piece: Piece, position: PositionObject, orientation: Orientation): false | void;
  onDragMove(
    newLocation: Square,
    oldLocation: Square,
    source: Square,
    piece: Piece,
    position: PositionObject,
    orientation: Orientation,
  ): void;
  onDrop(
    source: Square,
    target: Square,
    piece: Piece,
    newPosition: PositionObject,
    oldPosition: PositionObject,
    orientation: Orientation,
  ): InvalidDropBehavior | void;
  onMouseoutSquare(square: Square, piece: Piece | false, position: PositionObject, orientation: Orientation): void;
  onMouseoverSquare(square: Square, piece: Piece | false, position: PositionObject, orientation: Orientation): void;
  onMoveEnd(oldPosition: PositionObject, newPosition: PositionObject): void;
  onSnapbackEnd(piece: Piece, backTo: Square, currentPosition: PositionObject, orientation: Orientation): void;
  onSnapEnd(source: Square, target: Square, piece: Piece): void;
  orientation: Orientation;
  showNotation: boolean;
  sparePieces: boolean;
  showErrors: false | 'console' | 'alert' | ((errorCode: number, errorString: string, data: {}) => void);
  pieceTheme: string | ((piece: Piece) => string);
  appearSpeed: AnimationSpeed;
  moveSpeed: AnimationSpeed;
  snapbackSpeed: AnimationSpeed;
  snapSpeed: AnimationSpeed;
  trashSpeed: AnimationSpeed;
};

declare interface ChessBoard {
  clear(useAnimation?: false): void;
  destroy(): void;
  fen(): string;
  flip(): void;
  move(...moves: string[]): PositionObject;
  position(fen: 'fen'): FENString;
  position(fen?: {}): PositionObject;
  position(newPosition: BoardPosition, useAnimation?: false): void;
  orientation(): Orientation;
  orientation(side: Orientation | 'flip'): void;
  resize(): void;
  start(useAnimation?: false): void;
}

declare function ChessBoard(boardId: string, config?: Partial<ChessBoardConfig>): ChessBoard;
declare function ChessBoard(boardId: string, position?: BoardPosition): ChessBoard;
declare function Chessboard(boardId: string, config?: Partial<ChessBoardConfig>): ChessBoard;
declare function Chessboard(boardId: string, position?: BoardPosition): ChessBoard;

declare module 'chess.js' {
  // Type definitions for chess.js 1.12.2
  // Project: https://github.com/jhlywa/chess.js/
  // Definitions by: Leo Zhang <https://github.com/ilikebits>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

  type PieceType = 'r' | 'n' | 'b' | 'q' | 'k' | 'p';

  type Piece = {
    type: PieceType;
    color: 'b' | 'w';
  };

  type Move = {
    from: string;
    to: string;
    captured?: PieceType;
    promotion?: PieceType;
    flags: string;
    san: string;
  };

  declare class Chess {
    constructor(fen?: string);

    ascii(): string;
    board(): Array<Array<Piece | null>>;
    clear(): void;
    fen(): string;
    game_over(): boolean;
    get(square: string): Piece | null;
    history(options?: { verbose: false }): string[];
    history(options: { verbose: true }): Move[];
    in_check(): boolean;
    in_checkmate(): boolean;
    in_draw(): boolean;
    in_stalemate(): boolean;
    in_threefold_repetition(): boolean;
    header(...headers: string[]): void;
    insufficient_material(): boolean;
    load(fen: string): boolean;
    load_pgn(pgn: string, options?: Partial<{ newline_char: string; sloppy: boolean }>): boolean;
    move(move: string, options?: { sloppy: true });
    move(move: { from: string; to: string; promotion?: PieceType });
    moves(options?: Partial<{ square: string; verbose: false }>): string[];
    moves(options: Partial<{ square: string; verbose: true }>): Move[];
    pgn(options?: Partial<{ max_width: number; newline_char: string }>): string;
    put(piece: Piece, square: string): void;
    remove(square: string): Piece | null;
    reset(): void;
    square_color(square: string): 'light' | 'dark' | null;
    turn(): 'b' | 'w';
    undo(): Move | null;
    validate_fen(fen: string): { valid: boolean; error_number: number; error: string };
  }

  export = Chess;
}

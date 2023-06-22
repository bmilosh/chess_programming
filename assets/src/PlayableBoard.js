import { min } from "lodash";
import { Chessboard } from "react-chessboard";
import '/static/css/Board.css';

export default function PlayableBoard({
  game, 
  boardOrientation, 
  moveSquares,
  optionSquares,
  setSquareClicked,
    }) {
      const bwidth = min([window.outerWidth, 500])
  

  return (
    <Chessboard
        id="ClickToMove"
        // animationDuration={200}
        arePiecesDraggable={false}
        position={game.fen()}
        // onPieceDrop={onDrop}
        boardOrientation={boardOrientation}
        onSquareClick={(e) => setSquareClicked(e)}
        customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            // minWidth: "400px"
        }}
        boardWidth={`${bwidth}`}
        customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            // ...rightClickedSquares,
        }}
    />
  )
}
import { Chess } from 'chess.js';
import React from 'react';

const PositionButtons = ({
    action,
    classn_,
    computerTurn,
    game,
    setGame,
    fenStack,
    setFenStack,
    setMoveCount,
    fenStackUndoUndo,
    setFenStackUndoUndo,
    setMoveSquares,
    setIsFirstMove = null,
    setOptionSquares = null,

}) => {

    const buttonActions = {
        "once": forward,
        "end": forward,
        "undo": undo,
        "reset": undo
    }

    const buttonStyle = {
        cursor: "pointer",
        padding: "10px 20px",
        marginLeft: '3px',
        marginRight: '3px',
        // margin: "20px 50px 0px 50px",
        borderRadius: "4px",
        backgroundColor: "#b58863",
        // backgroundColor: "#f0d9b5",
        border: "none",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
        height: '40px',
        width: '40px',
      };

    function forward(action) {
        
        if (computerTurn) {
        //   console.log("Can't move because computer is thinking")
          return
        }
        if (fenStackUndoUndo.length) {
          if (action === 'once') {
  
            const item = fenStackUndoUndo.pop();
            setFenStackUndoUndo(fenStackUndoUndo)
            fenStack.push(item)
            setFenStack(fenStack)

			  const squares = {};
			  squares[item?.from] = {background: "rgba(155, 199, 0, 0.41)",};
			  squares[item?.to] = {background: "rgba(155, 199, 0, 0.41)",};
			  setMoveSquares(squares)
            
            setGame(new Chess(item["fen"]))
            setMoveCount((former) => former + 1)
  
          } else if (action === 'end') {  
                console.log("end button clicked")
              const fenHolder = fenStack.concat(fenStackUndoUndo.reverse())
              const endstate = fenStackUndoUndo.pop()
              setFenStackUndoUndo([])
              setFenStack(fenHolder)
              setGame(new Chess(endstate["fen"]))
              setMoveCount(game.moveNumber())
				const squares = {};
				squares[endstate?.from] = {background: "rgba(155, 199, 0, 0.41)",};
				squares[endstate?.to] = {background: "rgba(155, 199, 0, 0.41)",};
				setMoveSquares(squares)
  
          }
        } else {
          if (fenStack.length > 1) {
			  const displayedItem = fenStack[fenStack.length - 1];
			  const squares = {};
			  squares[displayedItem?.from] = {background: "rgba(155, 199, 0, 0.41)",};
			  squares[displayedItem?.to] = {background: "rgba(155, 199, 0, 0.41)",};
			  setMoveSquares(squares)
			  setGame(new Chess(displayedItem["fen"]))
          } 
        }
        return
      }
  
      function undo(action) {
          setMoveSquares({});
          setOptionSquares({});
        //   setRightClickedSquares({});
  
          if (action === "undo") {
            //   safeGameMutate((game) => {
            //       game.undo();
            //   });
              game.undo();
              if (fenStack.length > 1) {
                const item = fenStack.pop();
                fenStackUndoUndo.push(item)
                setFenStackUndoUndo(fenStackUndoUndo)
                const displayedItem = fenStack[fenStack.length - 1];
                const squares = {};
                squares[displayedItem?.from] = {background: "rgba(155, 199, 0, 0.41)",};
                squares[displayedItem?.to] = {background: "rgba(155, 199, 0, 0.41)",};
				setMoveSquares(squares)
                setGame(new Chess(displayedItem["fen"]))
                setFenStack(fenStack)
                setMoveCount((former) => former - 1)
              }
              if (fenStack.length === 1) setIsFirstMove(game.turn() === 'b' ? true : false)
  
          } else if (action === "reset") {
              setGame(new Chess(fenStack[0]["fen"]))
              setFenStack([fenStack[0]])
              const fenHolder = fenStackUndoUndo.concat(fenStack.reverse())
              fenHolder.pop()
              setMoveCount(game.moveNumber())
              setIsFirstMove(game.turn() === 'b' ? true : false)
              setFenStackUndoUndo(fenHolder)
          }
      }
  
    return (
        <button
            style={buttonStyle}
            onClick={() => buttonActions[action](action)}
            className={`${classn_}`}
        >
        </button>
    )
}

export default PositionButtons
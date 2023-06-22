import { Chess } from 'chess.js';
import cloneDeep from 'lodash/cloneDeep';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Ideally, should be responsible for making moves on the board.
 * So, should hold the makeMove functions, as well as onSquareClick.
 * @returns 
 */

const GameReferee = ({
	// gameId,
    humanColour,
    computerColour,
    game,
    setGame,
    computerTurn,
    setComputerTurn,
    isFirstMove,
    setIsFirstMove,
    fenStack,
    setFenStack,
    moveFrom,
    setMoveFrom,
    squareClicked,
    setSquareClicked,
    timerWorker,
    setMoveCount,
    optionSquares,
    isGameOver,
    setIsGameOver,
    setOptionSquares,
	moveSquares,
    setMoveSquares,
	searchTimeLimit,
	orientation
    
}) => {

    const colours = ['b', 'w']
	const {gameId} = useParams()

    useEffect(() => {
          if (computerTurn) {
              makeMove();
              setMoveFrom("");
              setOptionSquares({});
          } 
      }, [computerTurn])

    useEffect(() => {
        if (squareClicked) {
            onSquareClick(squareClicked)
            setSquareClicked(null)
        }
    }, [squareClicked])

	useEffect(() => {
		if (isGameOver) {
			setOptionSquares({})
		}
	}, [isGameOver])

	useEffect(() => {
		if (!isGameOver) {
			let gameStatus_ = ""
			if (game.isGameOver() || game.isDraw() ) {
				timerWorker.postMessage("kill")
				if (game.isDraw()) {
					setIsGameOver("We have a draw")
					gameStatus_ = "We have a draw"
				}
				else {
					if (game.turn() === 'b') {
						setIsGameOver(`Game over. White wins by checkmate.`)
						gameStatus_ = "Game over. White wins by checkmate."
					}
					else {
						setIsGameOver(`Game over. Black wins by checkmate.`)
						gameStatus_ = "Game over. Black wins by checkmate."
					}
				}
				setComputerTurn(false)
			};
			// console.log("isgameover stat:", isGameOver)
			// console.log("game stat:", gameStatus_)
			const retrievedGameInfo = JSON.parse(localStorage.getItem(gameId))
			let updatedInfo = { 
				...retrievedGameInfo, 
				fenStack: fenStack, 
				moveSquares: moveSquares, 
				fen: game.fen(), 
				gameStatus: gameStatus_
			}
			localStorage.setItem(gameId, JSON.stringify(updatedInfo))
		}
	}, [game])

    function safeGameMutate(modify) {
        setGame((g) => {
            const update = cloneDeep(g);
            modify(update);
            return update;
        });
    }

    function getMoveOptions(square) {
        const moves = game.moves({
            square,
            verbose: true,
        });
        if (moves.length === 0) {
            return false;
        }

        const newSquares = {};
        moves.map((move) => {
            newSquares[move.to] = {
            background:
                game.get(move.to) && game.get(move.to).color !== game.get(square).color
                ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
                : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
            borderRadius: "50%",
            };
            return move;
        });
        newSquares[square] = {
            background: "rgba(255, 255, 0, 0.4)",
        };
        setOptionSquares(newSquares);
        return true;
    }

    function startTimer (colour) {
      if (colour === "black") timerWorker.postMessage({initial: false, startBlackTimer: true})
      else timerWorker.postMessage({initial: false, startWhiteTimer: true})
	  // timerWorker.postMessage({initial: false, startBlackTimer: true}) //, startWhiteTimer: false, blackTime: blackTimeRem})
    }
    
    async function makeMove () {
        // exit if the game is over
        if (isGameOver) {
          setComputerTurn(false)
          return
        }

        let response = await fetch('/api/test_play/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "fen": game.fen(),
                "searchTimeLimit": Number(searchTimeLimit),
                // "searchTimeLimit": someGameInitials.searchTimeLimit,
                // "move": ourMove,
            })
        })

        let data = await response.json()
        let jsondata = JSON.parse(data)
        
        const newFEN = jsondata["fen"]
        const bestMove = jsondata["best_move"]
        const bestMoveSan = jsondata["san"]
        const squareFrom = jsondata["square_from"]
        const squareTo = jsondata["square_to"]
        const movenum = game.moveNumber();
        const ourColour = game.turn();
        let movePGN = ''

        if (isFirstMove) {
          setIsFirstMove(false)
        }
		if (isGameOver) {
			setComputerTurn(false)
			return
		  }
        safeGameMutate((game) => {
            game.move(bestMove);
          });
          movePGN += ourColour === 'b' ? bestMoveSan : movenum + '. ' + bestMoveSan
          setComputerTurn((former) => former ^ 1)
          setMoveCount((former) => former + 1)
          fenStack.push({
			  'pgn': movePGN,
			  'fen': newFEN,
			  from: squareFrom,
			  to: squareTo
			})
			setFenStack(fenStack)
			const squares = {}; 
			squares[squareFrom.toLowerCase()] = {background: "rgba(155, 199, 0, 0.41)",};
			squares[squareTo.toLowerCase()] = {background: "rgba(155, 199, 0, 0.41)",};
			setMoveSquares(squares)
			setGame(new Chess(newFEN))
  
          startTimer(humanColour)
    }

    function onSquareClick(square) {
        // setRightClickedSquares({}); // 1
        if (isGameOver) {
          	return
        }
        if (square === moveFrom) {
            setMoveFrom({})
            setOptionSquares({})
            return
        }
        let p = game.get(square)
        if (p && (p.color !== colours[orientation] && !(square in optionSquares))) {
          // Prevent from moving opponent's piece
          return
        }
    
        function resetFirstMove(square) {
          const hasOptions = getMoveOptions(square);
          if (hasOptions) {setMoveFrom(square)}
          else {
              setMoveFrom({})
              setOptionSquares({})
          }
        }
    
        // from square
        if (!moveFrom) { // 1
          resetFirstMove(square);
          return;
        }
    
        // attempt to make move
      const gameCopy = cloneDeep(game);
      try {
          const move = gameCopy.move({
            from: moveFrom,
            to: square,
            promotion: "q",
          });
          const squares = {};
          squares[move.from] = {background: "rgba(155, 199, 0, 0.41)",};
          squares[move.to] = {background: "rgba(155, 199, 0, 0.41)",};
          setMoveSquares(squares) // 1
          let movePGN =  '';
          
          const movenum = game.moveNumber();
          if (isFirstMove) {
              setIsFirstMove(false)
            }
          const ourColour = game.turn();
          movePGN += ourColour === 'b' ? move.san : movenum + '. ' + move.san
          fenStack.push({
              'pgn': movePGN,
              'fen': gameCopy.fen(),
			  from: move.from,
			  to: move.to
          })
          setFenStack(fenStack)
          setMoveCount((former) => former + 1)
          
          // If no exception is thrown, update the game state
          setGame(gameCopy);
          startTimer(computerColour)
          setComputerTurn((former) => former ^ 1)
        } catch (error) {
          resetFirstMove(square);
          // return false;
        }
      }
    
    //   function onSquareRightClick(square) {
    //     const colour = "rgba(0, 0, 255, 0.4)";
    //     setRightClickedSquares({
    //       ...rightClickedSquares,
    //       [square]:
    //         rightClickedSquares[square] &&
    //         rightClickedSquares[square].backgroundColor === colour
    //           ? undefined
    //           : { backgroundColor: colour },
    //     });
    //   }

  return (
    <></>
  )
}

export default GameReferee
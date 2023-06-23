import { Chess } from 'chess.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { someGameInitials } from './CreateGame.js';
import GameReferee from './GameReferee.js';
import PGNArea from './PGNArea.js';
import PlayableBoard from './PlayableBoard.js';
import PositionButtons from './PositionButtons.js';
import InvalidGameId from './errorComps/InvalidGameId.js';
import '/static/css/Board.css';

const PlayArea = ({
    setCreatingGame,
}) => {
    const { gameId } = useParams()
    const [gameInfo, setGameInfo] = useState(getGameInfo())
    const [orientation, setOrientation] = useState(gameInfo.orientation)
    const [boardOrientation, setBoardOrientation] = useState(gameInfo.orientation == 0 ? 'black' : 'white')
    const [game, setGame] = useState(
        gameInfo ? new Chess(gameInfo.fen) : new Chess("r2q1rk1/ppp2ppp/2n1bn2/2b1p3/3pP3/3P1NPP/PPP1NPB1/R1BQ1RK1 b - - 0 9")
    );
    const [computerTurn, setComputerTurn] = useState(null);
    let [moveCount, setMoveCount] = useState(game.moveNumber());
    const [moveFrom, setMoveFrom] = useState("");
    const [moveSquares, setMoveSquares] = useState(gameInfo ? gameInfo.moveSquares : {});
    const [optionSquares, setOptionSquares] = useState(gameInfo ? gameInfo.optionSquares : {});
    const [blackTimeRem, setBlackTimeRem] = useState(
        gameInfo ? 
        {min: gameInfo.blackTime.min, secs: gameInfo.blackTime.secs, milSecs: gameInfo.blackTime.milSecs} : 
        {min: someGameInitials.gameTime, secs: 0, milSecs: 0}
    )
    const [whiteTimeRem, setWhiteTimeRem] = useState(
        gameInfo ? 
        {min: gameInfo.whiteTime.min, secs: gameInfo.whiteTime.secs, milSecs: gameInfo.whiteTime.milSecs} : 
        {min: someGameInitials.gameTime, secs: 0, milSecs: 0}
    )
    const [fenStack, setFenStack] = useState(
        gameInfo ? gameInfo.fenStack : [
            {'pgn': game.turn() === 'b' ? [game.moveNumber() + '.' + ' ...'] : [{/*'PGN: '*/}], 
            'fen': game.fen(),
            from: "",
            to: ""
        }
        ]
    )
    const [isFirstMove, setIsFirstMove] = useState(() => game.turn() === 'b' ? true : false)
    const [fenStackUndoUndo, setFenStackUndoUndo] = useState(gameInfo ? gameInfo.fenStackUndoUndo : [])
    const [squareClicked, setSquareClicked] = useState(null)
    const [isGameOver, setIsGameOver] = useState(gameInfo ? gameInfo.gameStatus : "")
    const [timerWorker, _] = useState(new Worker(new URL('../src/timer/timer-worker.js', import.meta.url)))
    const navigate = useNavigate()
    const humanColour = orientation == 0 ? 'black' : 'white'
    const computerColour = orientation == 0 ? 'white' : 'black'
    // console.log(humanColour, computerColour, orientation, boardOrientation)

    function getGameInfo() {
        let retrievedGameInfo = JSON.parse(localStorage.getItem(gameId))
        return retrievedGameInfo
    }

    function updateLocalStorage(whiteTime, blackTime, gameStatus) {
        const updatedInfo = {
            initial: false,
            blackTime: blackTime,
            whiteTime: whiteTime,
            gameStatus: gameStatus,
            fenStack: fenStack,
            fen: fenStack.length ? fenStack[fenStack.length - 1].fen : game.fen(),
            optionSquares: optionSquares,
            moveSquares: moveSquares,
            fenStackUndoUndo: fenStackUndoUndo,
            squareClicked: squareClicked,
            secondsIncrement: gameInfo.secondsIncrement,
            searchTimeLimit: gameInfo.searchTimeLimit,
            orientation: gameInfo.orientation
        }
        localStorage.setItem(gameId, JSON.stringify(updatedInfo))
    }

    timerWorker.onmessage = function (event) {
    //   console.log("message from worker:", event.data)
        if (typeof event.data === "object") {
        if ("whiteTime" in event.data) setWhiteTimeRem(event.data.whiteTime)
        if ("blackTime" in event.data)  setBlackTimeRem(event.data.blackTime)

        // update local storage every second
        updateLocalStorage(event.data.whiteTime, event.data.blackTime, isGameOver)
        } else {
            if (!isGameOver) {

                setIsGameOver(event.data)
                // this update is primarily for the game status
                updateLocalStorage(whiteTimeRem, blackTimeRem, event.data)
                endGameSession()
            }
        }
    }

    useEffect(() => {
        if (gameInfo){
            // console.log("What about game info? initial:",gameInfo.initial)
            if (isGameOver) return;
            startEngine();
            timerWorker.postMessage({
            initial: true,
            whiteTime: whiteTimeRem,
            blackTime: blackTimeRem,
            startWhiteTimer: (!gameInfo.gameStatus && !gameInfo.initial && game.turn() === 'w'), //? true : false,
            startBlackTimer: (!gameInfo.gameStatus && !gameInfo.initial && game.turn() === 'b'), //? true : false,
            increment: Number(gameInfo.secondsIncrement),
            });
            setTimeout(() => {
                // console.log("now setting computer turn")
                setComputerTurn(game.turn() === computerColour[0])
                
            }, 2000);
        }
      }, [])

      useEffect(() => {
		if (isGameOver  ) {
            // console.log("Did it change at some point during the reload")
            console.log(isGameOver)
			timerWorker.postMessage("kill")
			setOptionSquares({})
            endGameSession()
		}
	}, [isGameOver])

    // Using this to kill the MBC engine.
    let endGameSession = async () => {
        if (!isGameOver) timerWorker.postMessage("kill")
        let response = await fetch('/api/quit', {
          method: 'GET',
        })
        let data = await response.json()
        // let jsondata = JSON.parse(data)
        // console.log("response from api on quit:", jsondata)
    }

    // Using this to start the MBC engine.
    let startEngine = async () => {
        console.log("We're starting the engine")
        let response = await fetch('/api/start_engine', {
          method: 'GET',
        })
        let data = await response.json()
        // let jsondata = JSON.parse(data)
        // console.log("response from api on engine start:", jsondata)
    }

    function flipBoard () {
        if (boardOrientation === 'black') {
            setBoardOrientation('white')
        }
        else {
            setBoardOrientation('black')
        }
      }

    function resignGame () {
        // endGameSession()
        setIsGameOver(`Game over. ${humanColour} resigns. ${computerColour} wins.`)
        const retrievedGameInfo = JSON.parse(localStorage.getItem(gameId))
        let updatedInfo = {
            ...retrievedGameInfo,
            gameStatus: `Game over. ${humanColour} resigns. ${computerColour} wins.`
        }
        localStorage.setItem(gameId, JSON.stringify(updatedInfo))
        // timerWorker.postMessage("kill")
    }

    function quitGame () {
        // endGameSession()
        setIsGameOver(`Game terminated.`)
        const retrievedGameInfo = JSON.parse(localStorage.getItem(gameId))
        let updatedInfo = {
            ...retrievedGameInfo,
            gameStatus: `Game terminated.`
        }
        localStorage.setItem(gameId, JSON.stringify(updatedInfo))
        // timerWorker.postMessage("kill")
        if (computerTurn) endGameSession()
        navigate('/')
    }

    function startNewGame () {
        endGameSession()
        // timerWorker.postMessage("kill")
        setCreatingGame(true)
        navigate('/')  
    }

return (
    <>{gameInfo ? ( 
        <div id="board-main">
            <div id='board-and-pgn'>
            {/* board and clock starts */}
            {/* <div id='board-and-clock'> */}
                {/* board and fen starts */}
                <div className='board'>
                    {/* <Link to={'/'}> */}
                        <button className='clock try' onClick={() => quitGame()}>
                            Quit
                        </button>
                    {/* </Link> */}
                    <div className='clock clock-top'>
                        {boardOrientation === 'white' ? (
                        String(blackTimeRem.min).padStart(2,0) + ":" + String(blackTimeRem.secs).padStart(2,0) // + '.' + String(blackTimeRem.milSecs).padStart(2,0)
                        ) : (
                        String(whiteTimeRem.min).padStart(2,0) + ":" + String(whiteTimeRem.secs).padStart(2,0) // + '.' + String(whiteTimeRem.milSecs).padStart(2,0)
                        )}
                    </div> {/** clock-top ends */}

                    <GameReferee
                        humanColour={humanColour}
                        computerColour={computerColour}
                        game={game} 
                        setGame={setGame}
                        fenStack={fenStack}
                        setFenStack={setFenStack}
                        moveFrom={moveFrom}
                        setMoveFrom={setMoveFrom}
                        isFirstMove={isFirstMove}
                        setIsFirstMove={setIsFirstMove}
                        computerTurn={computerTurn}
                        setComputerTurn={setComputerTurn}
                        squareClicked={squareClicked}
                        setSquareClicked={setSquareClicked}
                        timerWorker={timerWorker}
                        setMoveCount={setMoveCount}
                        optionSquares={optionSquares}
                        setOptionSquares={setOptionSquares}
                        moveSquares={moveSquares}
                        setMoveSquares={setMoveSquares}
                        isGameOver={isGameOver}
                        setIsGameOver={setIsGameOver}
                        searchTimeLimit={gameInfo.searchTimeLimit}
                        orientation={orientation}
                    />
                    <div className='just-board'>
                        <PlayableBoard 
                            game={game}
                            boardOrientation={boardOrientation}
                            setSquareClicked={setSquareClicked}
                            moveSquares={moveSquares}
                            optionSquares={optionSquares}
                        />
                    </div>
                    {/* Bottom clock goes here */}
                    {/* FEN goes here */}

                    <div className='fen-display'>FEN: {game.fen()}</div>
                    <div className='clock clock-bottom'>
                        {boardOrientation === 'white' ? (
                        String(whiteTimeRem.min).padStart(2,0) + ":" + String(whiteTimeRem.secs).padStart(2,0) // + '.' + String(whiteTimeRem.milSecs).padStart(2,0)
                        ) : (
                        String(blackTimeRem.min).padStart(2,0) + ":" + String(blackTimeRem.secs).padStart(2,0) // + '.' + String(blackTimeRem.milSecs).padStart(2,0)
                        )}
                    </div> {/** clock-bottom ends */}
                    <button className='clock try-bottom' onClick={() => startNewGame()}>
                        New Game
                    </button>
                    {/* board and fen ends */}
                </div> {/** board ends */}


                <div id='pgn-and-buttons' >
                    {/* PGN display goes here */}
                    <div id='pgns'>
                        <PGNArea 
                            fenStack={fenStack}
                            setGame={setGame}
                            moveCount={moveCount}
                        />
                    </div>
                    {/* Position control buttons go here */}
                    {isGameOver && <div className='buttons'>
                        <PositionButtons 
                            classn_={"reset-button"} 
                            action={"reset"} 
                            computerTurn={computerTurn}
                            game={game}
                            setGame={setGame}
                            fenStack={fenStack}
                            setFenStack={setFenStack}
                            setMoveCount={setMoveCount}
                            setMoveSquares={setMoveSquares}
                            setOptionSquares={setOptionSquares}
                            setIsFirstMove={setIsFirstMove}
                            fenStackUndoUndo={fenStackUndoUndo}
                            setFenStackUndoUndo={setFenStackUndoUndo}
                        />

                        <PositionButtons 
                            classn_={"undo-button"} 
                            action={"undo"} 
                            computerTurn={computerTurn}
                            game={game}
                            setGame={setGame}
                            fenStack={fenStack}
                            setFenStack={setFenStack}
                            setMoveCount={setMoveCount}
                            setMoveSquares={setMoveSquares}
                            setOptionSquares={setOptionSquares}
                            setIsFirstMove={setIsFirstMove}
                            fenStackUndoUndo={fenStackUndoUndo}
                            setFenStackUndoUndo={setFenStackUndoUndo}
                        />

                        <PositionButtons 
                            classn_={"forward-once-button"} 
                            action={"once"} 
                            computerTurn={computerTurn}
                            game={game}
                            setGame={setGame}
                            fenStack={fenStack}
                            setFenStack={setFenStack}
                            setMoveCount={setMoveCount}
                            fenStackUndoUndo={fenStackUndoUndo}
                            setFenStackUndoUndo={setFenStackUndoUndo}
                            setMoveSquares={setMoveSquares}
                        />

                        <PositionButtons 
                            classn_={"double-forward-button"} 
                            action={"end"} 
                            computerTurn={computerTurn}
                            game={game}
                            setGame={setGame}
                            fenStack={fenStack}
                            setFenStack={setFenStack}
                            setMoveCount={setMoveCount}
                            fenStackUndoUndo={fenStackUndoUndo}
                            setFenStackUndoUndo={setFenStackUndoUndo}
                            setMoveSquares={setMoveSquares}
                        />
                    </div>} {/** buttons ends */}
                    {/* <div> */}
                    {isGameOver ? (<div className='game-status'>{isGameOver}</div>) : (
                        <div >
                            <button className='resignBtn c-btn' onClick={(e) => resignGame()}>Resign</button>
                        </div>
                    )}
                    {/* </div> */}
                </div> {/** pgn-and-buttons ends */}
            </div> {/** board-and-pgn ends */}
        </div> ) : (
            <InvalidGameId />
        )}
    </>
  )
}

export default PlayArea

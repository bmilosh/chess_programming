import { Chess } from 'chess.js';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '/static/css/Landing.css';

export const someGameInitials = {
    secondsIncrement: 0,
    gameTime: 1,
    searchTimeLimit: 0.2,
    orientation: 1, // default is white
};

const CreateGame = ({
    orientation,
    setOrientation
}) => {
    let [gameId, setGameId] = useState("")
    let [chosenColor, setChosenColor] = useState(1)
    let [gameCreated, _] = useState(false)
    let navigate = useNavigate();
    const colorMap = {
        0: 'black',
        1: 'white',
        null: null
    }
    const difficultyRef = useRef(null)
    const timeRef = useRef(null)
    const incrementRef = useRef(null)

    async function saveGameToDb(chosenColor) {
        event.preventDefault();
        // console.log("Attempting to save game to db")
        setChosenColor(chosenColor)
    }

    useEffect(() => {
        setOrientation(chosenColor)
    }, [chosenColor])

    function handleSubmit(event) {
        event.preventDefault();
        // Set initials
        someGameInitials.gameTime = Number(timeRef.current.value)
        someGameInitials.searchTimeLimit = Number(difficultyRef.current.value)
        someGameInitials.secondsIncrement = Number(incrementRef.current.value)
        someGameInitials.orientation = chosenColor
        const id = uuidv4()
        setGameId(id)
        let g = new Chess()
        const gameInfo = {
            initial: true,
            blackTime: {min: someGameInitials.gameTime, secs: 0, milSecs: 0},
            whiteTime: {min: someGameInitials.gameTime, secs: 0, milSecs: 0},
            gameStatus: "",
            fen: g.fen(),
            fenStack: [],
            optionSquares: {},
            moveSquares: {},
            fenStackUndoUndo: [],
            squareClicked: "",
            secondsIncrement: someGameInitials.secondsIncrement,
            searchTimeLimit: someGameInitials.searchTimeLimit,
            orientation: orientation,
        }
        localStorage.setItem(id, JSON.stringify(gameInfo))
    }

    useEffect(() => {
        if (gameId) {
            navigate(`/api/play/${gameId}/`)
            // window.location.reload()
        }
    }, [gameId])

  return (
    // <div>
        <div className='creating-game'>
            <div id='chosen-color-indicator'>Play as <span id='chosen-color'>{colorMap[chosenColor]}</span> </div>
            <div id='choose-btns'>
                {!gameCreated ?
                    (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <button className='choose-player-btn choosing-white-btn' onClick={() => { saveGameToDb(1) }} />
                                <button className='choose-player-btn choosing-black-btn' onClick={() => { saveGameToDb(0) }} />
                                <button className='choose-player-btn ' onClick={() => { 
                                    let col = Math.floor(Math.random() * 2);
                                    saveGameToDb(col)
                                }} />

                                {/** Time Control Settings */}

                                <div className='time-and-difficulty'>
                                    <div className='time-control'>
                                        <div className='time-set'>
                                            <label>Minutes per side: </label>
                                            <span>      </span>
                                            <input type='number' defaultValue={1} max={180} min={1} ref={timeRef} />
                                        </div>

                                        <div className='increment'>
                                            <label>Increment (in seconds): </label>
                                            <span>      </span>
                                            <input id='increment-box' type='number' defaultValue={0} max={60} ref={incrementRef} />
                                        </div>
                                    </div>

                                    <div></div>

                                    <div className='difficulty-control'>
                                        <label >Difficulty: </label>
                                        <span>      </span>
                                        <select id="difficulty-level" defaultValue={1} ref={difficultyRef}>
                                            <option value={1}>Level 1</option>
                                            <option value={2}>Level 2</option>
                                            <option value={3}>Level 3</option>
                                            <option value={4}>Level 4</option>
                                            <option value={5}>Level 5</option>
                                        </select>
                                    </div>
                                    {/* <NavLink to={'/api/play/'}> */}
                                        <div className='landing-btn'>
                                            <button type='submit' className='newGameBtns c-btn'>Start Game</button>
                                        </div>
                                    {/* </NavLink> */}
                                </div>
                            </div>
                        </form>
                    ) : (
                        <></>
                    )
                }
            </div>
        </div>
    )
}

export default CreateGame
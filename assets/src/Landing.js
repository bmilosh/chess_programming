import React from 'react';
import CreateGame from './CreateGame.js';
import '/static/css/Landing.css';



const Landing = ({
    creatingGame,
    setCreatingGame,
    orientation,
    setOrientation
}) => {

    function createGame() {
        setCreatingGame(true)
    }

    return (
        <div id='landing-main'>
            <div className='landing-text'>
                Welcome to Michael's Chess.
                {/* <a href='/api/play'>Welcome</a> to Michael's Chess. */}
            </div>
            {!creatingGame && 
                <div className='landing-btn'>
                    <button className='newGameBtns c-btn' onClick={(e) => createGame()}>Create Game</button>
                </div>
            }
            {creatingGame && 
            <>
                <CreateGame
                    orientation={orientation}
                    setOrientation={setOrientation}
                />
            </>
            }
        </div>
    )
}

export default Landing
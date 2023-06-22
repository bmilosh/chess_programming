import { Chess } from 'chess.js';
import React, { useEffect, useRef } from 'react';
import '/static/css/Board.css';

const PGNArea = ({
    fenStack,
    setGame,
    moveCount
}) => {

    const pgnListRef = useRef(null)
    const pgnDiv = document.getElementById("pgn-scroll")

    const scrollToBottom = () => {
        pgnListRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (window.outerWidth > 500) {
            scrollToBottom()
        } else {
            // Automatically scroll to the end of the PGN area as moves are displayed.
            // This works for horizontal scrolling, while `scrollToBottom` does
            // same for vertical scrolling.
            try {
                pgnDiv.scrollLeft = pgnDiv.scrollWidth
            }
            catch (error) {
                return
            }
        }
      }, [moveCount]);

  return (
    <div id='pgn-scroll' className='pgnlist'>PGN: {window.outerWidth > 500 && <div></div>}
        {
            fenStack.map(function (item, idx) {
                return <div className='pgn' key={idx} onClick={() => setGame(new Chess(item["fen"]))}>{item["pgn"]}</div>
            })
        }
        {/** This extra div is just so that the pgn div scrolls to
         * the bottom automatically as it grows.
        */}
        <div ref={pgnListRef}/> 
    </div>
    )
}

export default PGNArea
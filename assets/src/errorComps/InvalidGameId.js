import React from 'react'
import { useRouteError } from 'react-router-dom'

const InvalidGameId = () => {
    let error = useRouteError()
    console.log(error)
  return (
    <div id='invalid-game-id'>
        <div >
            This game id is not valid. Please create a new game <a href='/api/'>here</a>.
        </div>
    </div>
  )
}

export default InvalidGameId
import React, { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Landing from './Landing.js';
import PlayArea from './PlayArea.js';
import ErrorComponent from './errorComps/ErrorComponent.js';

const App = () => {
    let [creatingGame, setCreatingGame] = useState(false)
    let [orientation, setOrientation] = useState(null) // white by default
    const router = createBrowserRouter([
        {
            path: "/play/:gameId",
            element: <PlayArea 
                        setCreatingGame={setCreatingGame} 
                        orientation={orientation}
                    />,
            errorElement: <ErrorComponent />,
        },
        {
            path: "/*",
            element: <ErrorComponent />,
        },
        {
            path: "/",
            element: <Landing 
                        creatingGame={creatingGame} 
                        setCreatingGame={setCreatingGame}
                        orientation={orientation} 
                        setOrientation={setOrientation}
                    />,
            errorElement: <ErrorComponent />,
        },
    ])

    return (<RouterProvider router={router} />);
}

export default App

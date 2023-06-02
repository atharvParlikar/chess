import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider, useParams} from 'react-router-dom'
import Game from './components/Game.jsx'

const SomeComponent = () => {
  return (
    <p>{useParams().game_id}</p>
  );
}

const router = createBrowserRouter([
  {
    path: "/:game_id",
    element: <Game />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)

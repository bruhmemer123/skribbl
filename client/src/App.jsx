import { Routes, Route } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import Lobby from './pages/Lobby.jsx'
import GamePage from './pages/GamePage.jsx'
const App = () => {
  return (
    <div className="min-h-screen bg-indigo-950">
    <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/GamePage' element={<GamePage />} />
        <Route path='/Lobby' element={<Lobby />} />
      </Routes>
    </div>
  )
}

export default App
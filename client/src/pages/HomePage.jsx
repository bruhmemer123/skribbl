import { Link } from 'react-router'
const HomePage = () => {
  return (
    <div className="min-h-screen bg-indigo-950">
        <Link to="/Lobby">
        <button className="bg-indigo-500 text-white px-4 py-2 rounded m-4" >Lobby</button>
        </Link>
    </div>
  )
}

export default HomePage
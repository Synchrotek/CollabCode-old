import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'

function App() {
  return (
    <>
      <div>
        <Toaster
          position='top-right'
          toastOptions={{
            success: { theme: { primary: '#4aed88' } }
          }}
        ></Toaster>
      </div>
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/editor/:roomId' Component={EditorPage} />
      </Routes>
    </>
  )
}

export default App

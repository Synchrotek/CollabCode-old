import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'
import Auth from './pages/Auth'
import Protected from './Protected'

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
        <Route path='/' element={<Protected Component={Home} />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/editor/:roomId' element={<Protected Component={EditorPage} />} />
      </Routes>
    </>
  )
}

export default App

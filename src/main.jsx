import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import { IndexPage } from './components/pages'
import { Callback } from './components/pages/callback'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<IndexPage/>}/>
        <Route path='/callback' element={<Callback/>}/>
      </Routes>
    </Router>
  </StrictMode>,
)

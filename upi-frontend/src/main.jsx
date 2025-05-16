import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css';
ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
    <BrowserRouter> {/* ✅ This must wrap everything using React Router */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

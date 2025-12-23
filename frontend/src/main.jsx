import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios'

// Configure API base URL
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
axios.defaults.baseURL = apiUrl

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

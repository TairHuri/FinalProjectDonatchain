import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Web3Providers } from './contexts/wallet'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Web3Providers>
      <App />
      </Web3Providers>
    </BrowserRouter>
  </React.StrictMode>
)

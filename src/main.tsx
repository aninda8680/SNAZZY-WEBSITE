import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Shop from './pages/Shop.tsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)

function renderApp() {
  const hash = window.location.hash
  if (hash === '#/shop') {
    root.render(
      <React.StrictMode>
        <Shop />
      </React.StrictMode>,
    )
  } else {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  }
}

window.addEventListener('hashchange', renderApp)
renderApp()

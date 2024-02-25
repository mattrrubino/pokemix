window.TFJS_BACKEND = 'cpu'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="w-screen h-screen flex flex-col justify-center">
      <App />
      <a href="https://github.com/mattrrubino/pokemix" target="_blank">
        <img className="absolute bottom-0 right-0 p-8 h-32 w-32" src="github.png" />
      </a>
    </div>
  </React.StrictMode>,
)
